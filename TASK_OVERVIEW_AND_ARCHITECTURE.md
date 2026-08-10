# Take-Home Task: Headless Media SDK + Component Library Ecosystem

## Executive Summary

This task involves designing and implementing a modern, multi-package **Headless Media SDK & Component Library Ecosystem** powered by the [Pexels API](https://www.pexels.com/api/). 

Rather than constructing a monolithic application, the goal is to demonstrate clean architectural decoupling by separating core SDK logic, platform adapters, pure UI components, and a consuming application.

---

## 🏛 Architecture & Layer Boundaries

The ecosystem strictly enforces a clean unidirectional dependency hierarchy and separation of concerns:

```
                            ┌───────────────────────────┐
                            │   4. UI Web App (React)   │
                            └─────────────┬─────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
            ┌─────────────────────────┐       ┌───────────────────────────┐
            │  2. Platform Wrapper    │       │ 3. Headless UI Component  │
            │     (media-react)       │       │     (media-ui-react)      │
            └────────────┬────────────┘       └─────────────────────────┘
                         │                         (Pure UI, No SDK imports,
                         ▼                          Unstyled / Headless)
            ┌─────────────────────────┐
            │  1. Core SDK            │
            │     (media-core)        │
            └─────────────────────────┘
             (Pure TS, No UI/React/DOM)
```

### Dependency Rules:
1. **Unidirectional Data & Import Flow:** `App → Wrappers → Core SDK` and separately `App → UI Components`.
2. **Zero Horizontal Leakage:** `media-react` (wrapper) and `media-ui-react` (UI library) **must NEVER import each other**.
3. **Zero Upstream Leakage:** `media-ui-react` **must NEVER import `media-core`** or Pexels types. It receives data and callbacks purely via React props.
4. **Environment Portability:** `media-core` is pure TypeScript without React, DOM, or React Native imports. It can run in Node.js, CLI scripts, or web environments.

---

## 📦 Deliverables Breakdown

### 1. Core SDK — `media-core`
- **Framework-Agnostic & Zero UI:** Written in pure TypeScript with zero DOM/React dependencies.
- **Pexels API Client:**
  - Search photos and videos.
  - Fetch curated/trending items.
  - Pagination support.
  - Fetch single photo/video item.
- **Auth Management:** Secure API key configuration; API key is strictly scoped and not exposed to unnecessary logic.
- **Event Emitter Pattern:** Emits activity events (`view`, `download`) via a subscribe/unsubscribe pattern. Includes a default console logging listener.
- **Performance & Reliability:** Request de-duplication, basic in-memory caching, typed error handling, and structured response types.

### 2. Platform Wrappers — `media-react` & `media-native`
- **Idiomatic Adaptation:** React wrappers (`Provider` + custom hooks like `useMediaSearch`, `useMediaList`, `useMediaEvents`).
- **Zero Business Logic:** Acts strictly as a glue layer translating `media-core` functionality to React state & lifecycle patterns.
- **Controlled Access:** Wrappers are the *only* layer allowed to import `media-core`.

### 3. Component Libraries — `media-ui-react` & `media-ui-native`
- **Pure UI Headless Components:**
  - **Grid:** Responsive layout with infinite scroll / load-more capability.
  - **Lightbox:** Image & video preview modal, keyboard navigation, focus management, and accessibility (a11y).
  - **Reel Swiper:** Vertical snap-paging container with active-item index detection.
- **Headless Pattern:** Custom hooks + prop-getters. Zero baked-in CSS styles; consumer provides styling/markup structure.
- **Decoupled:** Takes generic props and callbacks. Completely unaware of Pexels or `media-core`.

### 4. UI Web Application — React
- **Integration Layer:** The only location where `media-react` and `media-ui-react` are wired together.
- **User Experience Flow:** Search bar → Media Grid → Lightbox modal → Reels video view.
- **Focus:** Clean functionality and wiring demonstration.

### 5. AI Coding Tool Skills — `skills/`
Two structured `SKILL.md` documents guiding AI agents (e.g., Claude Code, Cursor, Antigravity) to properly use the libraries:
- **Skill 1 (`media-react-data-wiring`):** Teaches how to set up `MediaProvider`, call hooks, pass API keys, and handle event subscriptions.
- **Skill 2 (`media-ui-react-components`):** Teaches how to use headless component hooks/prop-getters, apply custom CSS, and manage accessibility.

---

## 📐 Suggested Monorepo Directory Layout

```
footowlsolution/
├── packages/
│   ├── media-core/             # Pure TS SDK (Pexels Client + Events + Cache)
│   ├── media-react/            # React Provider & Hooks adapter
│   ├── media-native/           # React Native Provider & Hooks adapter (optional/stub)
│   ├── media-ui-react/         # Pure Headless UI Components (Grid, Lightbox, Reel)
│   └── media-ui-native/        # Pure Headless UI Components for RN (optional/stub)
├── apps/
│   └── web/                    # Demo React Web Application
├── skills/
│   ├── media-react-data-wiring/
│   │   └── SKILL.md            # Skill doc for SDK integration
│   └── media-ui-react-components/
│       └── SKILL.md            # Skill doc for Headless UI integration
├── package.json
└── pnpm-workspace.yaml / turbo.json
```

---

## 📋 Evaluation Metrics

| Area | Key Expectations |
|---|---|
| **Architecture** | Clear boundaries across core, wrapper, UI library, and app with zero boundary leaks. |
| **SDK Design** | Secure auth, typed APIs, robust error handling, event emitter pattern, caching. |
| **Headless Pattern** | True headless components via prop-getters/hooks without hardcoded styling. |
| **AI Skills Quality** | Concrete, context-rich skill documents that directly improve AI code generation. |
| **Pragmatic Scope** | Documented design decisions, trade-offs, and clear repository structure. |
