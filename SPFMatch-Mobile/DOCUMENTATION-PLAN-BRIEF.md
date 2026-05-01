# The Documentation Plan

This is a brief plan for how SPFMatch Mobile documentation will be handled.

## Who our users are

1. **Everyday app users**
   - People who want sunscreen guidance and reminders.
2. **Users who want extra detail**
   - People who want to understand why the app gives certain recommendations.
3. **Maintainers/reviewers**
   - Teammates, instructors, or anyone who needs to run and review the app.

## What documentation they need

### Everyday app users need:
- Quick start guidance
- Clear labels and short explanations on screens
- Simple help for permissions (location/notifications)
- Basic troubleshooting (for example, reminder not showing)

### Users who want extra detail need:
- Short FAQ answers (how skin type is calculated, why reminders change)
- A simple explanation of where UV data comes from

### Maintainers/reviewers need:
- Setup and install instructions
- Environment/configuration steps
- Run and build instructions
- Notes on what code/data is original vs adapted

## How we will provide documentation (and why)

- **README file**: First place to find setup and run steps.
- **User and admin manuals (markdown pages)**: Good for clear step-by-step reference.
- **Help text on screens**: Best for non-technical users because help appears at the exact moment they need it.
- **Intro screens**: Helps first-time users understand the app quickly.
- **Tooltips / helper text**: Gives extra context without cluttering the screen.
- **FAQ section**: Answers common questions in one place.
- **Light guided flow (quiz + reminders)**: Acts like a simple tutorial without making users read a long manual.

## Why this approach is appropriate

This app is mobile-first, so most users will not read long documents. The best approach is short, clear in-app help plus simple repo docs for technical setup. This keeps documentation useful for both everyday users and maintainers.

---

This plan describes what final documentation will look like. The final documentation artifacts will be submitted with the final code deliverable.
