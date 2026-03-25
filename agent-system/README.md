# Agent System (v1.0)

Este sistema automatiza la asignación de tareas (GitHub Issues) a agentes especializados, mantiene un dashboard y aplica reglas de bloqueo/desbloqueo por dependencias.

## Conceptos

- **Tareas**: Issues abiertos etiquetados con `v1.0` (y prioridad `p0/p1/p2`).
- **Agentes**: Perfiles declarados en [agents.json](file:///c:/GeeoDev/TypingQuest/agent-system/agents.json) con skills y capacidad.
- **Dependencias**: Se detectan desde el cuerpo del issue con `Depends on #123` o `Depende de #123`.
- **Routing**: cada tarea tiene un label `agent:<id>` que indica el agente “responsable” (aunque el assignee humano puede variar).
- **SLO**:
  - Ninguna tarea `p0` debe quedar sin asignación por más de 120 min.
  - Se monitorea la meta de “90% dentro del tiempo estimado” (requiere que los issues tengan `Estimate: Xh`).
  - Tareas sin updates por N días se marcan como `needs-attention`.

## Cómo se usa

### 1) Configurar agentes

Editar [agents.json](file:///c:/GeeoDev/TypingQuest/agent-system/agents.json):
- `agents[]`: skills y `capacityPoints`.
- Para asignación real de issues, al menos un agente humano debe tener `githubUsername`.

### 2) Etiquetar issues para que entren al sistema

Requisitos mínimos:
- `v1.0`
- `p0` o `p1` o `p2`

Recomendado:
- `size:xs|s|m|l|xl` (define puntos de carga)
- `Estimate: 6h` en el cuerpo (para métricas)
- `Depends on #NNN` si aplica

### 3) Ejecutar

Local:
- Setear `GITHUB_TOKEN` y ejecutar:

```bash
node scripts/agent-orchestrator.mjs
```

Automático:
- Workflow programado cada hora: `.github/workflows/agent-orchestrator.yml`

### 4) Dashboard

Salida generada:
- [dashboard.md](file:///c:/GeeoDev/TypingQuest/agent-system/dashboard.md)
- [dashboard.html](file:///c:/GeeoDev/TypingQuest/agent-system/dashboard.html) (visual)

En GitHub Actions, se publica como artifact “agent-dashboard”.

## Reglas de asignación (matching)

Se calcula un score por agente:
- Peso fuerte por prioridad (p0>p1>p2)
- Bonus por overlap de skills (labels del issue ↔ skills del agente)
- Penalización por carga/capacidad (points)

Auto-asignación:
- Solo se auto-asignan issues `p0` que lleven más de 120 min sin asignación.

Bloqueo por dependencias:
- Si un issue referencia dependencias abiertas, se agrega label `blocked` y se deja comentario.
- Si todas las dependencias cierran, se quita `blocked` y se comenta.

## Reasignación dinámica (protocolo)

- **Stale**: si no hay updates por `staleNoUpdateDays`, se agrega `needs-attention` y se comenta.
- **P0 sin estimación**: se marca `needs-attention` para forzar que exista `Estimate: Xh` (necesario para el SLO 90%).
- **Blocked + stale**: se reasigna el routing a `agent:ai-generalist` y se marca `needs-attention`.

## Comunicación entre agentes

- Se realiza en el propio issue:
  - Comentarios automáticos de routing, bloqueo/desbloqueo y reasignación.
  - Checklists y subtareas viven en el issue para mantener una sola fuente de verdad.

## Decisiones registradas

- La coordinación ocurre “en GitHub” (Issues/labels/milestone) para mantener una sola fuente de verdad.
- El dashboard se genera como artifact para que sea visual sin desplegar infraestructura extra.
