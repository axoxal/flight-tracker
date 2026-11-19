# 🤝 Contributing to Flight Tracker

Thank you for your interest in contributing! This guide will help you get started.

## 🎯 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Fix issues
- ✨ Add new features
- 🎨 Improve UI/UX

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/flight-tracker.git
cd flight-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
# Copy environment template
cp .env.local.example .env.local

# Add your credentials (see QUICKSTART.md)
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## 📝 Coding Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types
- Use strict mode

### Code Style
- Follow existing code style
- Use ESLint and Prettier
- Run `npm run lint` before committing
- Write descriptive variable names

### Components
- One component per file
- Use functional components with hooks
- Keep components small and focused
- Add JSDoc comments for complex logic

### Example:
```typescript
/**
 * FlightCard component displays flight information
 * @param flight - Flight object with route and price data
 */
export function FlightCard({ flight }: { flight: Flight }) {
  // Component code
}
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Build to check for errors
npm run build
```

## 📤 Submitting Changes

### 1. Commit Your Changes

```bash
git add .
git commit -m "feat: add amazing feature"
```

### Commit Message Format
Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Build process or tools

### 2. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template
5. Submit for review

## 📋 Pull Request Guidelines

### PR Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)

### PR Description Should Include
- What changes were made
- Why these changes were needed
- How to test the changes
- Screenshots (for UI changes)
- Related issue numbers

### Example PR:
```markdown
## 🎯 Changes
- Added email notification feature
- Updated alert creation flow
- Added SendGrid integration

## 🔗 Related Issue
Closes #42

## 🧪 Testing
1. Create a price alert
2. Trigger the cron job
3. Check email for notification

## 📸 Screenshots
[Add screenshots here]
```

## 🐛 Reporting Bugs

### Before Reporting
- Check if bug already reported
- Test on latest version
- Gather reproduction steps

### Bug Report Should Include
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs
- Possible solution (optional)

## 💡 Suggesting Features

### Feature Request Should Include
- Clear description
- Problem it solves
- Proposed solution
- Alternative approaches
- Mockups (if applicable)

## 🏗️ Project Structure

```
flight-tracker/
├── src/
│   ├── app/              # Next.js pages and API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   │   ├── scrapers/    # Flight data scrapers
│   │   └── supabase/    # Database client
│   └── types/            # TypeScript types
├── supabase/             # Database schema
├── scripts/              # Utility scripts
└── public/               # Static assets
```

## 🔑 Key Technologies

- **Next.js 15**: App Router, API Routes
- **TypeScript**: Type safety
- **Supabase**: PostgreSQL with PostGIS
- **Tailwind CSS**: Styling
- **Vercel**: Hosting and cron jobs

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ❓ Questions?

- Open an issue for questions
- Check existing issues first
- Be respectful and patient

## 📜 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## 🎉 Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in commits

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Flight Tracker! 🚀✈️
