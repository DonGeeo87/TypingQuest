import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const configPath = path.join(rootDir, 'agent-system', 'agents.json')

function nowIso() {
  return new Date().toISOString()
}

function addDaysIso(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function minutesBetween(a, b) {
  return Math.floor((b.getTime() - a.getTime()) / 60000)
}

function daysBetween(a, b) {
  return Math.floor((b.getTime() - a.getTime()) / 86400000)
}

function uniq(arr) {
  return Array.from(new Set(arr))
}

function pickPriority(labels) {
  if (labels.includes('p0')) return 'p0'
  if (labels.includes('p1')) return 'p1'
  if (labels.includes('p2')) return 'p2'
  return 'p2'
}

function pickSize(labels) {
  const order = ['size:xl', 'size:l', 'size:m', 'size:s', 'size:xs']
  return order.find((x) => labels.includes(x)) ?? 'size:m'
}

function estimateHoursFromBody(body) {
  if (!body) return null
  const m = body.match(/(?:^|\n)\s*(?:Estimate|Estimación)\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*h\s*(?:$|\n)/i)
  if (!m) return null
  const v = Number(m[1])
  return Number.isFinite(v) ? v : null
}

function depsFromBody(body) {
  if (!body) return []
  const lines = body.split('\n')
  const deps = []
  for (const line of lines) {
    const m = line.match(/depends on\s+#(\d+)/i) || line.match(/depende de\s+#(\d+)/i)
    if (m) deps.push(Number(m[1]))
  }
  return uniq(deps)
}

function domainSkillsFromLabels(labels) {
  const map = new Map([
    ['frontend', 'frontend'],
    ['backend', 'backend'],
    ['database', 'database'],
    ['security', 'security'],
    ['performance', 'performance'],
    ['qa', 'qa'],
    ['i18n', 'i18n'],
    ['education', 'education'],
    ['docs', 'docs'],
    ['marketing', 'marketing'],
    ['monetization', 'monetization'],
  ])
  const skills = []
  for (const l of labels) {
    if (map.has(l)) skills.push(map.get(l))
  }
  return uniq(skills).filter(Boolean)
}

async function ghFetch(url, opts = {}) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (!token) {
    throw new Error('Missing GITHUB_TOKEN (or GH_TOKEN)')
  }

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    ...(opts.headers ?? {}),
  }

  const res = await fetch(url, { ...opts, headers })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`GitHub API ${res.status}: ${url}\n${txt}`)
  }
  if (res.status === 204) return null
  return res.json()
}

async function listIssues(owner, repo, state) {
  const perPage = 100
  let page = 1
  const out = []
  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=${state}&per_page=${perPage}&page=${page}`
    const data = await ghFetch(url)
    const issues = (data ?? []).filter((x) => !x.pull_request)
    out.push(...issues)
    if (issues.length < perPage) break
    page += 1
  }
  return out
}

async function ensureMilestone(owner, repo, title) {
  const ms = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/milestones?state=all&per_page=100`)
  const found = (ms ?? []).find((m) => m.title === title)
  if (found) return found
  return ghFetch(`https://api.github.com/repos/${owner}/${repo}/milestones`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
}

async function updateMilestone(owner, repo, milestoneNumber, patch) {
  return ghFetch(`https://api.github.com/repos/${owner}/${repo}/milestones/${milestoneNumber}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

async function setIssueMilestone(owner, repo, issueNumber, milestoneNumber) {
  return ghFetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
    method: 'PATCH',
    body: JSON.stringify({ milestone: milestoneNumber }),
  })
}

async function assignIssue(owner, repo, issueNumber, assignees) {
  return ghFetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
    method: 'PATCH',
    body: JSON.stringify({ assignees }),
  })
}

async function addLabels(owner, repo, issueNumber, labels) {
  return ghFetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/labels`, {
    method: 'POST',
    body: JSON.stringify({ labels }),
  })
}

async function removeLabel(owner, repo, issueNumber, label) {
  return ghFetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/labels/${encodeURIComponent(label)}`, {
    method: 'DELETE',
  })
}

async function comment(owner, repo, issueNumber, body) {
  return ghFetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  })
}

async function listComments(owner, repo, issueNumber) {
  const perPage = 100
  let page = 1
  const out = []
  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=${perPage}&page=${page}`
    const data = await ghFetch(url)
    out.push(...(data ?? []))
    if ((data ?? []).length < perPage) break
    page += 1
  }
  return out
}

async function ensureLabel(owner, repo, name, color, description) {
  const all = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/labels?per_page=100`)
  const existing = (all ?? []).find((l) => l.name === name)
  if (existing) return existing
  return ghFetch(`https://api.github.com/repos/${owner}/${repo}/labels`, {
    method: 'POST',
    body: JSON.stringify({ name, color, description }),
  })
}

function scoreAgentForTask(agent, task, config, loadPoints) {
  const priority = pickPriority(task.labels)
  const priorityScore = config.priorityWeights[priority] ?? 0

  const need = task.skills
  let skillScore = 0
  for (const s of need) {
    if (agent.skills.includes(s)) skillScore += config.skillWeights[s] ?? 1
  }

  const load = loadPoints[agent.id] ?? 0
  const capacity = agent.capacityPoints ?? 0
  const remaining = capacity - load
  const capacityPenalty = remaining < task.points ? 1000 : 0

  return priorityScore + skillScore - load * 6 - capacityPenalty
}

function pickAssignee(task, agents, config, loadPoints) {
  const candidates = agents
    .filter((a) => a.type === 'human' && a.githubUsername)
    .concat(agents.filter((a) => a.type === 'ai'))

  let best = null
  let bestScore = -Infinity
  for (const a of candidates) {
    const s = scoreAgentForTask(a, task, config, loadPoints)
    if (s > bestScore) {
      bestScore = s
      best = a
    }
  }
  return best
}

function agentLabel(agentId) {
  return `agent:${agentId}`
}

function getExistingAgentLabel(labels) {
  return labels.find((l) => l.startsWith('agent:')) ?? null
}

async function replaceAgentLabel(owner, repo, issueNumber, fromLabel, toLabel) {
  if (fromLabel && fromLabel !== toLabel) {
    await removeLabel(owner, repo, issueNumber, fromLabel).catch(() => null)
  }
  await addLabels(owner, repo, issueNumber, [toLabel])
}

function toTask(issue, config) {
  const labels = (issue.labels ?? []).map((l) => (typeof l === 'string' ? l : l.name)).filter(Boolean)
  const priority = pickPriority(labels)
  const size = pickSize(labels)
  const points = config.sizePoints[size] ?? config.sizePoints['size:m']
  const skills = domainSkillsFromLabels(labels)
  const deps = depsFromBody(issue.body ?? '')
  const estimateHours = estimateHoursFromBody(issue.body ?? '')
  const agent = getExistingAgentLabel(labels)

  return {
    id: issue.number,
    title: issue.title,
    url: issue.html_url,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    closedAt: issue.closed_at ?? null,
    labels,
    priority,
    size,
    points,
    skills,
    deps,
    estimateHours,
    assignees: (issue.assignees ?? []).map((a) => a.login),
    agent,
  }
}

function buildDashboard(tasks, agents, loadPoints, config) {
  const rows = tasks
    .slice()
    .sort((a, b) => (config.priorityWeights[pickPriority(b.labels)] ?? 0) - (config.priorityWeights[pickPriority(a.labels)] ?? 0))

  const summary = {
    generatedAt: nowIso(),
    totals: {
      open: rows.length,
      p0: rows.filter((t) => t.priority === 'p0').length,
      p1: rows.filter((t) => t.priority === 'p1').length,
      p2: rows.filter((t) => t.priority === 'p2').length,
      unassigned: rows.filter((t) => t.assignees.length === 0).length,
      p0Unassigned: rows.filter((t) => t.priority === 'p0' && t.assignees.length === 0).length,
    },
    bottlenecks: {
      blocked: rows.filter((t) => t.labels.includes('blocked')).map((t) => ({ id: t.id, title: t.title, url: t.url })),
      needsAttention: rows.filter((t) => t.labels.includes('needs-attention')).map((t) => ({ id: t.id, title: t.title, url: t.url })),
      p0Unestimated: rows.filter((t) => t.priority === 'p0' && !t.estimateHours).map((t) => ({ id: t.id, title: t.title, url: t.url })),
      unassigned: rows.filter((t) => t.assignees.length === 0).map((t) => ({ id: t.id, title: t.title, url: t.url })),
    },
    agents: agents.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      capacityPoints: a.capacityPoints,
      loadPoints: loadPoints[a.id] ?? 0,
      skills: a.skills,
      githubUsername: a.githubUsername ?? null,
    })),
    tasks: rows,
  }

  return summary
}

function markdownDashboard(dash) {
  const lines = []
  lines.push(`# Agent Dashboard`)
  lines.push('')
  lines.push(`Generated: ${dash.generatedAt}`)
  lines.push('')
  lines.push(`- Open: ${dash.totals.open}`)
  lines.push(`- P0: ${dash.totals.p0} (unassigned: ${dash.totals.p0Unassigned})`)
  lines.push(`- P1: ${dash.totals.p1}`)
  lines.push(`- P2: ${dash.totals.p2}`)
  lines.push(`- Unassigned: ${dash.totals.unassigned}`)
  if (dash.metrics?.estimateAccuracy?.ratio !== null && dash.metrics?.estimateAccuracy?.ratio !== undefined) {
    lines.push(`- Estimate accuracy: ${(dash.metrics.estimateAccuracy.ratio * 100).toFixed(1)}% (sample: ${dash.metrics.estimateAccuracy.sample})`)
  } else {
    lines.push(`- Estimate accuracy: n/a (agrega "Estimate: Xh" en issues y cierra algunos para medir)`)
  }
  lines.push('')
  lines.push(`## Bottlenecks`)
  lines.push('')
  lines.push(`- Blocked: ${dash.bottlenecks.blocked.length}`)
  lines.push(`- Needs attention: ${dash.bottlenecks.needsAttention.length}`)
  lines.push(`- P0 without estimate: ${dash.bottlenecks.p0Unestimated.length}`)
  lines.push('')
  lines.push(`## Agents`)
  lines.push('')
  lines.push(`| Agent | Type | Load | Capacity | Skills |`)
  lines.push(`|---|---:|---:|---:|---|`)
  for (const a of dash.agents) {
    lines.push(`| ${a.name} | ${a.type} | ${a.loadPoints} | ${a.capacityPoints} | ${a.skills.join(', ')} |`)
  }
  lines.push('')
  lines.push(`## Tasks`)
  lines.push('')
  lines.push(`| Pri | Size | Pts | Agent | Assignee | Est | Deps | Title |`)
  lines.push(`|---:|---:|---:|---|---|---:|---:|---|`)
  for (const t of dash.tasks) {
    const assignee = t.assignees.length ? t.assignees.join(', ') : '—'
    const agent = t.agent ?? '—'
    const est = t.estimateHours ?? '—'
    const deps = t.deps?.length ?? 0
    lines.push(`| ${t.priority} | ${t.size} | ${t.points} | ${agent} | ${assignee} | ${est} | ${deps} | [#${t.id}](${t.url}) ${t.title} |`)
  }
  lines.push('')
  return lines.join('\n')
}

function htmlDashboard(dash) {
  const data = JSON.stringify(dash).replaceAll('<', '\\u003c')
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>TypingQuest Agent Dashboard</title>
  <style>
    :root { color-scheme: light dark; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 24px; }
    h1 { margin: 0 0 8px; }
    .meta { opacity: .75; margin-bottom: 16px; }
    .grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
    @media (min-width: 1100px) { .grid { grid-template-columns: 1fr 2fr; } }
    .card { border: 1px solid rgba(127,127,127,.25); border-radius: 12px; padding: 12px 14px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid rgba(127,127,127,.2); }
    th { position: sticky; top: 0; background: Canvas; }
    .pill { padding: 2px 8px; border-radius: 999px; border: 1px solid rgba(127,127,127,.25); display: inline-block; }
    .p0 { background: rgba(255,0,0,.08); }
    .p1 { background: rgba(255,140,0,.08); }
    .p2 { background: rgba(255,215,0,.10); }
    a { color: inherit; }
    input { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(127,127,127,.25); background: Canvas; color: CanvasText; }
  </style>
</head>
<body>
  <h1>Agent Dashboard</h1>
  <div class="meta">Generated: <span id="generated"></span></div>
  <div class="grid">
    <div class="card">
      <h2 style="margin:0 0 10px;">Summary</h2>
      <div id="summary"></div>
      <h2 style="margin:16px 0 10px;">Bottlenecks</h2>
      <div id="bottlenecks"></div>
      <h2 style="margin:16px 0 10px;">Agents</h2>
      <div style="overflow:auto; max-height: 60vh;">
        <table id="agents"></table>
      </div>
    </div>
    <div class="card">
      <div style="display:flex; gap:12px; align-items:center; justify-content:space-between;">
        <h2 style="margin:0;">Tasks</h2>
        <div style="width: 360px; max-width: 55vw;"><input id="q" placeholder="Filtrar por título / label / assignee…" /></div>
      </div>
      <div style="overflow:auto; max-height: 80vh; margin-top: 10px;">
        <table id="tasks"></table>
      </div>
    </div>
  </div>
  <script>
    const dash = ${data};
    document.getElementById('generated').textContent = dash.generatedAt;
    document.getElementById('summary').innerHTML =
      '<div>Open: <b>' + dash.totals.open + '</b></div>' +
      '<div>P0: <b>' + dash.totals.p0 + '</b> (unassigned: <b>' + dash.totals.p0Unassigned + '</b>)</div>' +
      '<div>P1: <b>' + dash.totals.p1 + '</b></div>' +
      '<div>P2: <b>' + dash.totals.p2 + '</b></div>' +
      '<div>Unassigned: <b>' + dash.totals.unassigned + '</b></div>' +
      '<div>Estimate accuracy: <b>' + (dash.metrics && dash.metrics.estimateAccuracy && dash.metrics.estimateAccuracy.ratio !== null ? Math.round(dash.metrics.estimateAccuracy.ratio * 1000) / 10 + '%' : 'n/a') + '</b></div>';

    document.getElementById('bottlenecks').innerHTML =
      '<div>Blocked: <b>' + (dash.bottlenecks.blocked || []).length + '</b></div>' +
      '<div>Needs attention: <b>' + (dash.bottlenecks.needsAttention || []).length + '</b></div>' +
      '<div>P0 without estimate: <b>' + (dash.bottlenecks.p0Unestimated || []).length + '</b></div>';

    const agentsTable = document.getElementById('agents');
    agentsTable.innerHTML =
      '<thead><tr><th>Agent</th><th>Type</th><th>Load</th><th>Capacity</th><th>Skills</th></tr></thead>' +
      '<tbody>' + dash.agents.map(a =>
        '<tr>' +
          '<td>' + a.name + '</td>' +
          '<td>' + a.type + '</td>' +
          '<td>' + a.loadPoints + '</td>' +
          '<td>' + a.capacityPoints + '</td>' +
          '<td>' + a.skills.join(', ') + '</td>' +
        '</tr>'
      ).join('') + '</tbody>';

    function renderTasks(query) {
      const q = (query || '').toLowerCase().trim();
      const rows = dash.tasks.filter(t => {
        if (!q) return true;
        const hay = [
          t.title,
          (t.labels || []).join(' '),
          (t.assignees || []).join(' '),
          (t.agent || '')
        ].join(' ').toLowerCase();
        return hay.includes(q);
      });

      const tasksTable = document.getElementById('tasks');
      tasksTable.innerHTML =
        '<thead><tr><th>Pri</th><th>Size</th><th>Pts</th><th>Agent</th><th>Assignee</th><th>Est</th><th>Deps</th><th>Title</th></tr></thead>' +
        '<tbody>' + rows.map(t => {
          const cls = t.priority === 'p0' ? 'p0' : t.priority === 'p1' ? 'p1' : 'p2';
          const ass = (t.assignees && t.assignees.length) ? t.assignees.join(', ') : '—';
          const agent = t.agent || '—';
          const est = (t.estimateHours !== null && t.estimateHours !== undefined) ? (t.estimateHours + 'h') : '—';
          const deps = (t.deps && t.deps.length) ? t.deps.length : 0;
          return '<tr>' +
            '<td><span class="pill ' + cls + '">' + t.priority + '</span></td>' +
            '<td>' + t.size + '</td>' +
            '<td>' + t.points + '</td>' +
            '<td>' + agent + '</td>' +
            '<td>' + ass + '</td>' +
            '<td>' + est + '</td>' +
            '<td>' + deps + '</td>' +
            '<td><a href="' + t.url + '" target="_blank" rel="noreferrer">#' + t.id + '</a> ' + t.title + '</td>' +
          '</tr>';
        }).join('') + '</tbody>';
    }

    renderTasks('');
    document.getElementById('q').addEventListener('input', (e) => renderTasks(e.target.value));
  </script>
</body>
</html>`
}

async function main() {
  const raw = await fs.readFile(configPath, 'utf8')
  const config = JSON.parse(raw)
  const { owner, repo, milestoneTitle, milestoneDueDaysFromNow } = config.project

  const milestone = await ensureMilestone(owner, repo, milestoneTitle)
  if (!milestone.due_on && Number.isFinite(milestoneDueDaysFromNow)) {
    await updateMilestone(owner, repo, milestone.number, { due_on: addDaysIso(milestoneDueDaysFromNow) })
  }

  const issues = await listIssues(owner, repo, 'open')
  const closedIssues = await listIssues(owner, repo, 'closed')

  for (const a of config.agents) {
    const name = agentLabel(a.id)
    await ensureLabel(owner, repo, name, '8A2BE2', `Routing de tareas para ${a.name}`)
  }
  await ensureLabel(owner, repo, 'blocked', '6A737D', 'Bloqueado por dependencias')
  await ensureLabel(owner, repo, 'needs-attention', 'D4C5F9', 'Requiere atención (stale/bloqueo/límite)')

  const v1Issues = issues.filter((i) => (i.labels ?? []).some((l) => (typeof l === 'string' ? l : l.name) === 'v1.0'))
  const tasks = v1Issues.map((i) => toTask(i, config))

  const issueByNumber = new Map(tasks.map((t) => [t.id, t]))

  const loadPoints = {}
  for (const a of config.agents) loadPoints[a.id] = 0

  for (const t of tasks) {
    if (t.assignees.length === 0) continue
    const ass = t.assignees[0]
    const agent = config.agents.find((a) => a.githubUsername === ass) ?? config.agents.find((a) => a.type === 'ai')
    if (agent) loadPoints[agent.id] = (loadPoints[agent.id] ?? 0) + t.points
  }

  const now = new Date()
  for (const t of tasks) {
    const labels = t.labels
    const existingAgent = getExistingAgentLabel(labels)
    if (!existingAgent) {
      const picked = pickAssignee(t, config.agents, config, loadPoints)
      if (picked) {
        await addLabels(owner, repo, t.id, [agentLabel(picked.id)])
        await comment(owner, repo, t.id, `Routing: asignado a **${picked.name}** (${agentLabel(picked.id)}).`)
      }
    }
  }

  const p0Unassigned = tasks.filter((t) => t.priority === 'p0' && t.assignees.length === 0)
  for (const t of p0Unassigned) {
    const updatedAt = new Date(t.updatedAt)
    const idleMinutes = minutesBetween(updatedAt, now)
    if (idleMinutes < config.slo.p0UnassignedMaxMinutes) continue
    const ownerAgent = config.agents.find((a) => a.type === 'human' && a.githubUsername)
    if (ownerAgent?.githubUsername) {
      await assignIssue(owner, repo, t.id, [ownerAgent.githubUsername])
      await addLabels(owner, repo, t.id, ['needs-attention'])
      await comment(owner, repo, t.id, `Auto-asignado a @${ownerAgent.githubUsername} por política: P0 sin asignar > ${config.slo.p0UnassignedMaxMinutes} min.`)
    } else {
      await addLabels(owner, repo, t.id, ['needs-attention'])
      await comment(owner, repo, t.id, `Alerta: P0 sin asignación y sin agente humano configurado.`)
    }
  }

  for (const t of tasks) {
    if (!t.deps.length) continue
    const depsOpen = t.deps.filter((n) => issueByNumber.has(n))
    const shouldBlock = depsOpen.length > 0
    const isBlocked = t.labels.includes('blocked')
    if (shouldBlock && !isBlocked) {
      await addLabels(owner, repo, t.id, ['blocked'])
      await comment(owner, repo, t.id, `Marcado como blocked. Dependencias abiertas: ${depsOpen.map((n) => `#${n}`).join(', ')}.`)
    }
    if (!shouldBlock && isBlocked) {
      await removeLabel(owner, repo, t.id, 'blocked').catch(() => null)
      await comment(owner, repo, t.id, `Desbloqueado: todas las dependencias referenciadas están cerradas.`)
    }
  }

  for (const t of tasks) {
    const issue = v1Issues.find((x) => x.number === t.id)
    if (!issue) continue
    if (issue.milestone?.number === milestone.number) continue
    await setIssueMilestone(owner, repo, t.id, milestone.number)
  }

  const refreshedIssues = await listIssues(owner, repo, 'open')
  const refreshedV1 = refreshedIssues.filter((i) => (i.labels ?? []).some((l) => (typeof l === 'string' ? l : l.name) === 'v1.0'))
  const refreshedTasks = refreshedV1.map((i) => toTask(i, config))

  const refreshedLoad = {}
  for (const a of config.agents) refreshedLoad[a.id] = 0
  for (const t of refreshedTasks) {
    if (t.assignees.length === 0) continue
    const ass = t.assignees[0]
    const agent = config.agents.find((a) => a.githubUsername === ass) ?? config.agents.find((a) => a.type === 'ai')
    if (agent) refreshedLoad[agent.id] = (refreshedLoad[agent.id] ?? 0) + t.points
  }

  const staleDays = config.slo.staleNoUpdateDays ?? 3
  for (const t of refreshedTasks) {
    const age = daysBetween(new Date(t.updatedAt), now)
    if (age < staleDays) continue
    if (t.labels.includes('needs-attention')) continue
    await addLabels(owner, repo, t.id, ['needs-attention'])
    await comment(owner, repo, t.id, `Marcado como needs-attention: sin updates por ${age} días.`)
  }

  for (const t of refreshedTasks) {
    if (t.priority !== 'p0') continue
    if (t.estimateHours) continue
    if (t.labels.includes('needs-attention')) continue
    await addLabels(owner, repo, t.id, ['needs-attention'])
    await comment(owner, repo, t.id, `Falta estimación. Agrega una línea "Estimate: Xh" para medir el SLO 90%.`)
  }

  for (const t of refreshedTasks) {
    const age = daysBetween(new Date(t.updatedAt), now)
    if (age < staleDays) continue
    if (!t.labels.includes('blocked')) continue
    const fallback = agentLabel('ai-generalist')
    if (t.agent !== fallback) {
      await replaceAgentLabel(owner, repo, t.id, t.agent, fallback)
      await addLabels(owner, repo, t.id, ['needs-attention'])
      await comment(owner, repo, t.id, `Reasignación automática de routing: ${fallback} (blocked + stale).`)
    }
  }

  const v1Closed = closedIssues.filter((i) => (i.labels ?? []).some((l) => (typeof l === 'string' ? l : l.name) === 'v1.0'))
  const closedTasks = v1Closed.map((i) => toTask(i, config)).filter((t) => t.closedAt && t.estimateHours)
  const estimateStats = (() => {
    if (!closedTasks.length) return { sample: 0, within: 0, ratio: null }
    let within = 0
    for (const t of closedTasks) {
      const actualHours = (new Date(t.closedAt).getTime() - new Date(t.createdAt).getTime()) / 3600000
      if (actualHours <= t.estimateHours) within += 1
    }
    return { sample: closedTasks.length, within, ratio: within / closedTasks.length }
  })()

  const dash = buildDashboard(refreshedTasks, config.agents, refreshedLoad, config)
  dash.slo = {
    p0UnassignedMaxMinutes: config.slo.p0UnassignedMaxMinutes,
    completionWithinEstimateTarget: config.slo.completionWithinEstimateTarget,
    staleNoUpdateDays: config.slo.staleNoUpdateDays,
  }
  dash.metrics = {
    estimateAccuracy: estimateStats,
  }

  const epic = refreshedTasks.find((t) => t.title.startsWith('V1.0 EPIC:'))
  if (epic && estimateStats.ratio !== null && estimateStats.sample >= 5) {
    const target = config.slo.completionWithinEstimateTarget ?? 0.9
    if (estimateStats.ratio < target) {
      const marker = '<!-- agent-orchestrator:slo -->'
      const comments = await listComments(owner, repo, epic.id)
      const recent = comments
        .filter((c) => typeof c.body === 'string' && c.body.includes(marker))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
      const shouldPost = !recent || daysBetween(new Date(recent.created_at), now) >= 1
      if (shouldPost) {
        await comment(
          owner,
          repo,
          epic.id,
          `${marker}\nSLO en riesgo: estimate accuracy ${(estimateStats.ratio * 100).toFixed(1)}% < ${(target * 100).toFixed(0)}% (muestra ${estimateStats.sample}).\n\nAcciones sugeridas:\n- Exigir \"Estimate: Xh\" en todos los issues v1.0.\n- Ajustar sizes/estimates por histórico.\n- Dividir issues XL/L en subtareas.\n`
        )
      }
    }
  }

  const outDir = path.join(rootDir, 'agent-system')
  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(path.join(outDir, 'dashboard.json'), JSON.stringify(dash, null, 2))
  await fs.writeFile(path.join(outDir, 'dashboard.md'), markdownDashboard(dash))
  await fs.writeFile(path.join(outDir, 'dashboard.html'), htmlDashboard(dash))

  process.stdout.write(`ok ${dash.generatedAt}\n`)
}

main().catch((e) => {
  process.stderr.write(`${e?.stack ?? e}\n`)
  process.exitCode = 1
})
