# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Task Workflow

**1. Create task file in `tasks/` directory:**
```bash
# Create tasks/task-N.md
```
```markdown
### Task N: Task Title
- [ ] Subtask 1
- [ ] Subtask 2
- Location: `path/to/files`
```

**2. Before starting, verify work isn't already done:**
- Check codebase for task's changes
- Review files in Location field
- If complete but unmarked:
  - Mark subtasks `[x]` in tasks/task-N.md
  - Commit with `[Task-N]` tag
  - Push and skip to next task

**3. Complete subtasks, mark `[x]` in tasks/task-N.md**

**4. Commit:**
```bash
git add .
git commit -m "Task N: Task Title

- [x] Subtask 1
- [x] Subtask 2
- Location: \`path/to/files\`

[Task-N]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Requirements:**
- Each task gets its own file: `tasks/task-N.md`
- Complete task entry in commit message
- All subtasks with status
- `[Task-N]` tag for tracking
- One task per commit

**5. Push:** `git push`

## Project Overview

**Event Scheduler** - All your events, everywhere, in one beautiful place.

A tool that aggregates events from multiple platforms (Meetup, Facebook, websites) into one unified view.

### Core Features
- Parse event URLs from any platform
- Convert to standardized JSON format
- Store events locally
- View all events in a beautiful Next.js interface
- Filter by date, location, category
- Search across all events

### Standard Event Format
Every event stored as JSON with:
- Title, description, dates
- Location (physical or virtual)
- Organizer info
- Price/free status
- Tags and categories
- Source platform

## Development Commands

### Frontend (Next.js)
```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Lint code
npm run lint
```

## Architecture

### Application Structure
Next.js web application for event aggregation and visualization with local JSON storage.

**Data Flow**: Event URL → Parser → Standard JSON → Local Storage → Next.js UI

### Event Storage
- **Local JSON files**: Each event stored as a separate JSON file
- **Portable format**: Standard schema across all platforms
- **User-owned data**: All event data stored locally

### Frontend Architecture
- **Next.js 15**: App router with React 19
- **Modular components**: All UI components separated into individual files
- **Custom hooks**: Business logic extracted into reusable hooks
- **Shared types**: TypeScript interfaces for event data structures
- **Client-side React**: Uses `"use client"` with hooks for state management
- **No external state management**: Pure React useState for simplicity

### Event Parsers
- **Platform-specific parsers**: Custom parsing logic for each platform
  - Meetup
  - Facebook Events
  - Generic website scraper
- **Extensible design**: Easy to add new platform parsers

### Key Libraries
- **Next.js 15**: App router with React 19
- **Tailwind CSS**: Styling (latest version)
- **TypeScript**: Type safety across the application

### Development Notes
- Events stored as JSON files in local directory
- Each platform parser converts to standard event schema
- Frontend provides unified view across all platforms
- All data stays local - no external database required

## Code Standards

### Frontend Modularity
- **ALWAYS maintain modular component architecture**
- Break down large components into smaller, focused components
- Extract business logic into custom hooks
- Keep utility functions in separate files
- Use shared TypeScript interfaces across components
- Each component should have a single responsibility

### Data Schema
- **Consistent event format**: All parsers must output to the standard JSON schema
- **Required fields**: Title, description, dates must always be present
- **Optional fields**: Handle gracefully when data is unavailable
- **Source tracking**: Always track which platform the event came from

### Comment Policy
- **no comments** we don't use comments in this code