# 🎯 GitHub Projects v2 - Setup Configuration

**Project URL**: https://github.com/users/DonGeeo87/projects/3

**Project ID**: `PVT_kwHODHtzss4BTBZG`

**Status**: ✅ Created with 26 issues added (#34-#59)

---

## 📋 Recommended Field Configuration

### 1. **Status** (Built-in)
GitHub Projects v2 includes a built-in Status field. Configure with:
- **Backlog** (default)
- **Ready for Development**  
- **In Progress** (work started)
- **In Review** (PR/testing)
- **Done** (merged and deployed)

### 2. **Priority** (Custom - Single Select)
Add a custom field for prioritization:
- 🔴 **Critical** (blocker, must have for MVP)
- 🟠 **High** (major feature, impacts core engagement)
- 🟡 **Medium** (nice to have, polish/UX)
- 🟢 **Low** (optional, future consideration)

**Field Configuration:**
```
Name: Priority
Type: Single select
Options: Critical, High, Medium, Low
```

### 3. **Sprint** (Custom - Single Select)
Track which sprint/phase each issue belongs to:
- **Sprint 1** (Weeks 1-8: Campaign, Achievements, Challenges, Friends)
- **Sprint 2** (Weeks 9-12: Polish, Guilds, Tournaments, Tutorial)
- **Sprint 3** (Weeks 13-15: Monetization, Cosmetics, Offline mode)
- **Backlog** (Future phases, not scheduled)

**Field Configuration:**
```
Name: Sprint
Type: Single select
Options: Sprint 1, Sprint 2, Sprint 3, Backlog
```

### 4. **Estimate** (Custom - Number)
Store story points for capacity planning:

**Field Configuration:**
```
Name: Estimate
Type: Number
```

### 5. **Category** (Custom - Single Select)
Group by feature domain:
- 🎮 Gameplay
- 🏆 Rewards & Progression
- 👥 Social & Competition
- 📊 Analytics
- 🎨 Polish & Presentation
- 🔧 Infrastructure
- 💰 Monetization

**Field Configuration:**
```
Name: Category
Type: Single select
Options: Gameplay, Rewards, Social, Analytics, Polish, Infrastructure, Monetization
```

---

## 📊 Recommended Views

### View 1: **Board** (Kanban)
**Display**: Status column layout
- **Group by**: Status
- **Sort by**: Priority (Critical first)
- **Filter**: Sprint === "Sprint 1"
- **Purpose**: Sprint planning & daily standup

### View 2: **Table** (Full Overview)
**Display**: All fields in table format
- **Columns**: Title, Status, Priority, Sprint, Category, Estimate, Assignee
- **Sort by**: Sprint, then Priority
- **Filter**: None (show all)
- **Purpose**: Roadmap review & capacity planning

### View 3: **Sprint 1 Focus** (Board)
**Display**: Status kanban for current sprint only
- **Group by**: Status
- **Filter**: Sprint === "Sprint 1" AND Status !== "Done"
- **Sort by**: Priority
- **Purpose**: Active development board

### View 4: **Backlog** (Table)
**Display**: Unscheduled and future work
- **Filter**: Sprint === "Backlog"
- **Sort by**: Priority
- **Columns**: Title, Priority, Category, Estimate
- **Purpose**: Future sprint planning

### View 5: **By Category** (Table)
**Display**: Grouped by feature category
- **Group by**: Category
- **Sort by**: Priority
- **Filter**: None
- **Purpose**: Feature area tracking

---

## 🚀 Quick Start Steps

### Step 1: Configure Custom Fields (3 min)
1. Open https://github.com/users/DonGeeo87/projects/3
2. Click **⚙️ Settings** → **Custom fields**
3. Add fields: Priority, Sprint, Estimate, Category (use configs above)

### Step 2: Create Views (5 min)
1. Click **+ Add view**
2. Create each view listed above:
   - Board (Sprint 1): Kanban by Status
   - Table: Overview with all fields
   - Sprint 1 Focus: Kanban filtered to Sprint 1
   - Backlog: Table with unscheduled issues
   - By Category: Table grouped by Category

### Step 3: Populate Field Values (10 min)
1. Go to **Board** view
2. Bulk edit or individual click each issue
3. Set: Sprint, Priority, Category, Estimate (from ROADMAP_v2.md)

### Step 4: Configure Automation (5 min)
1. **Settings** → **Automation**
2. Enable auto-add: "When issues are opened, auto-add to project"
3. Enable status updates: "Auto-move to 'Done' when PR merges"

---

## 📌 Mapping: Issues → Fields

Based on ROADMAP_v2.md, quick reference:

| Issue | Title | Priority | Sprint | Category | Estimate |
|-------|-------|----------|--------|----------|----------|
| #34 | Campaign System | 🔴 Critical | Sprint 1 | Gameplay | 8 |
| #35 | Time Attack Mode | 🔴 Critical | Sprint 1 | Gameplay | 5 |
| #36 | Pattern Match | 🟠 High | Sprint 1 | Gameplay | 3 |
| #37 | TapTap Integration | 🟠 High | Sprint 1 | Gameplay | 3 |
| #38 | Sprint Challenge | 🔴 Critical | Sprint 1 | Gameplay | 5 |
| #39 | Achievements | 🔴 Critical | Sprint 1 | Rewards | 8 |
| #40 | Daily Challenges | 🔴 Critical | Sprint 1 | Rewards | 5 |
| #41 | Weekly Quests | 🟠 High | Sprint 1 | Rewards | 3 |
| #42 | Friend System | 🟠 High | Sprint 1 | Social | 5 |
| #43 | Tournament System | 🟠 High | Sprint 2 | Social | 8 |
| ... | ... | ... | ... | ... | ... |

---

## 🔗 Integration Links

- **Quick Add Issues**: https://github.com/DonGeeo87/TypingQuest/issues/new
- **View All Issues**: https://github.com/DonGeeo87/TypingQuest/issues
- **Roadmap Details**: [ROADMAP_v2.md](./ROADMAP_v2.md)
- **Feature Specs**: [ISSUES_DETAILED.md](./ISSUES_DETAILED.md)

---

## ✅ Next Actions

1. ✨ **Configure custom fields** in project settings (5 min)
2. 📊 **Create 5 views** for different workflow needs (5 min)
3. 📌 **Bulk populate** field values from ROADMAP_v2.md (15 min)
4. 🚀 **Assign Sprint 1 issues** to team members
5. 📅 **Set milestone dates** for Sprint 1 (Weeks 1-8)

---

**Last Updated**: 2026-03-27  
**Created By**: GitHub Copilot  
**Maintenance**: Review weekly with dev team
