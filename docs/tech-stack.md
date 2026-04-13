---
url: https://chatgpt.com/g/g-p-69db58392fb48191849a03dcc4483741-tetrisspeckitcopilotreacttypescriptnodejs/c/69db5996-0688-8393-b81b-5cf5a3a04812
---

# Technology Stack

> [!NOTE] Tech Stack
> 
> This is a browser-based Tetris project built with React + TypeScript on Vite, using `sql.js` for in-browser SQLite persistence, with ESLint for linting, Vitest + Testing Library for component/unit testing, and Playwright for E2E coverage 

Exact stack from `package.json`:

Frontend

* React 19
* React DOM 19
* TypeScript 6

Build and dev server

* Vite 8
* `@vitejs/plugin-react`

Runtime / architecture

* ESM project (`"type": "module"`)
* Browser app
* Client-side SQLite via `sql.js` rather than a server database 

Testing

* Vitest for unit/integration tests
* Testing Library:
    * `@testing-library/react`
    * `@testing-library/user-event`
    * `@testing-library/jest-dom`
* Playwright for end-to-end tests
* `jsdom` for DOM-like test environment 

Linting / quality

* ESLint 9
* `typescript-eslint`
* `eslint-plugin-react-hooks`
* `globals` 

Type support

* `@types/node`
* `@types/react`
* `@types/react-dom`
* `@types/sql.js` 

Scripts

* `dev`: Vite dev server
* `build`: TypeScript type-check via `tsc --noEmit` plus Vite production build
* `lint`: ESLint
* `preview`: Vite preview
* `test`: Vitest run
* `test:watch`: Vitest watch
* `test:e2e`: Playwright test 
