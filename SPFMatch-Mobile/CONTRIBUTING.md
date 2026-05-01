# Contributing to SPFMatch Mobile

## Coding Standards

### Consistency

- Match existing TypeScript and React Native conventions in the project.
- Prefer explicit, descriptive names over abbreviations.
- Keep component props and utility interfaces strongly typed.

### Comments

- Comment intent, trade-offs, and domain rules.
- Do not comment obvious control flow or JSX structure.
- Use short doc comments for non-trivial exported functions.

### Professionalism

- Assume all code and text may become public.
- Do not include sensitive values, jokes, or unprofessional test strings.
- Keep user-facing copy clear and respectful.

## Provenance and Legacy Code

If code is adapted from prior systems, templates, or external references:

1. Add a brief provenance note at the top of the file.
2. State what was adapted and what was newly authored.
3. Include the same note in pull request description.

Example header note:

```
// Provenance: Adapted from SPFMatch web utility (fitzpatrick scoring),
// then modified for mobile-specific types and storage behavior.
```

## Pull Request Checklist

- [ ] Build runs locally (`npm run start`)
- [ ] New code follows style rules above
- [ ] Non-obvious logic is documented
- [ ] Legacy/external-origin code is identified
- [ ] Install and usage docs remain accurate
