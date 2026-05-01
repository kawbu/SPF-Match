# SPFMatch Mobile — Documentation Plan

This plan explains who our users are, what documentation they need, and how we will provide it.

## 1) User Documentation

User documentation is for people using the app. Because not all users are the same, we split it into sections by user type.

### User types and skill levels

1. **Primary user (everyday app user)**
   - Skill level: basic phone use
   - Needs: clear steps, short wording, almost no jargon

2. **Secondary user (curious user)**
   - Skill level: basic phone use, willing to read more
   - Needs: short explanations of “why” (for example, reminder timing)

3. **Teacher/reviewer-style reader**
   - Skill level: adult reader explaining app behavior to others
   - Needs: simple wording that can be read out loud and understood quickly

### How user documentation will be provided

- **Intro screens** for first-time use
- **Text on screens** for each step (quiz, reminders, check-ins)
- **Tooltips/helper text** for “why this result” and “why this interval”
- **Help/FAQ screen** for common questions
- **User manual (`docs/USER.md`)** for full reference

### Why this is appropriate

Most users do not read long manuals. So essential information appears first and directly in the app. Extra detail is still available in drill-down sections (FAQ and USER.md) for special cases.

---

## 2) Administrator Documentation

Administrator documentation is for the person setting up and operating the system.

### Administrator profile and skill level

- Intended administrator: adult with basic technical skills
- Assumed skills: can follow step-by-step setup instructions, run terminal commands, and edit environment variables

### What admin documentation will include

- **Hardware/software dependencies**
- **Download/install instructions**
- **Configuration instructions** (including IDs/passwords/keys if needed before deployment)
- **Tested systems and compatibility expectations**
- **Known incompatibilities**
- **New deployment instructions**
- **Redeployment/refresh instructions** (for restart/reset)
- **Troubleshooting section**

### How admin documentation will be provided

- **README.md** for quick start
- **Administrator manual (`docs/ADMIN.md`)** for full setup and operations

### Why this is appropriate

Admins need one reliable place with complete setup and recovery steps. Keeping quick steps in README and full details in ADMIN.md makes it easier to use and maintain.

---

## 3) Documentation Mechanisms We Will Use

- Manuals (markdown docs in repo)
- README files
- Help screens/subsystems
- Intro screens
- Mouseovers/tooltips/helper text
- On-screen text
- FAQs
- Light guided flow (quiz/reminder setup)

This list is not exhaustive; we may add small support content if needed.

---

## 4) Scope Note

This is the plan only. The full documentation artifacts will be submitted with the final code deliverable.
