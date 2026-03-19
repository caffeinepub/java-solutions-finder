# Java Solutions Finder

## Current State
New project with empty Motoko backend and no frontend implemented.

## Requested Changes (Diff)

### Add
- Motoko backend with a catalog of Java Q&A entries (problem, explanation, code snippet, category, difficulty)
- Search functionality across problem titles, descriptions, error messages, and keywords
- Category browsing (Collections, Exceptions, Streams, OOP, Multithreading, I/O, Generics, Design Patterns)
- Difficulty filtering (beginner, intermediate, advanced)
- Solution detail view with formatted code snippet
- Sample Java Q&A content seeded in the backend (20+ entries)

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Define data types for JavaSolution (id, title, problem, explanation, codeSnippet, category, difficulty, tags)
2. Backend: Seed 20+ realistic sample Java Q&A entries across all categories and difficulty levels
3. Backend: Implement query functions: getAllSolutions, searchSolutions(query), getSolutionsByCategory(cat), getSolutionsByDifficulty(level), getSolutionById(id), getCategories
4. Frontend: Main layout with sidebar (categories + difficulty filters) and main content area
5. Frontend: Search bar with real-time filtering
6. Frontend: Solution card list with problem title, category badge, difficulty badge, truncated description
7. Frontend: Solution detail/expand view with full explanation and syntax-highlighted code snippet
8. Frontend: Responsive, developer-friendly design
