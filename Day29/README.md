# Day 29 – React testing

Testing the app **the way a user uses it**: find things by their role or label, click and type like a real person, and fake only the network.

Day 29 starts from the Day 28 auth app and adds an **Issues** page (list, filter, search, create form, empty / error / retry states) so there is something real to test.

## Run the tests

```bash
cd frontend
npm install
npm test             # run all tests once
npm run test:watch   # re-run when files change
```

No backend or database is needed for the tests: `fetch` is faked.

## Tools

| Tool | What it does |
| --- | --- |
| **Vitest** | Runs the tests (`describe`, `it`, `expect`, `vi`) |
| **jsdom** | A fake browser inside Node, so React can render |
| **@testing-library/react** | `render`, `screen`, `within` – find things like a user would |
| **@testing-library/user-event** | `user.type`, `user.click`, `user.selectOptions` – realistic actions |
| **@testing-library/jest-dom** | Extra matchers: `toBeInTheDocument()`, `toHaveValue()`, ... |

## Test files

```
frontend/src/
  test/
    setup.ts                 runs before every test file (cleanup, matchers)
    mockApi.ts               fake backend + fake users/issues
    renderWithProviders.tsx  render with MemoryRouter + AuthProvider (stretch task)
  components/IssueForm.test.tsx   simple component test (no router, no auth)
  pages/Login.test.tsx            login success + wrong password
  pages/Issues.test.tsx           loading, filters, empty, error + retry, create, session expired
  App.test.tsx                    protected routes, role check, navbar navigation, logout
```

19 tests in total.

## The rules we followed

1. **Query priority** – use what a user (or a screen reader) sees:
   `getByRole` → `getByLabelText` → `getByText`. No CSS classes, no test ids.
   ```ts
   screen.getByRole("button", { name: "Create issue" });
   screen.getByLabelText("Title");
   ```
2. **`getBy` / `queryBy` / `findBy`**
   - `getBy...` – must be there right now (throws if missing)
   - `queryBy...` – may be missing (returns `null`), use it to check something is **not** shown
   - `findBy...` – waits for it to appear (use with `await`, for anything after a fetch)
3. **Real user actions** – `const user = userEvent.setup()` then `await user.type(...)`, `await user.click(...)`.
4. **Mock only the network** – `mockApi({...})` replaces `fetch`. The components, `AuthProvider`, `ProtectedRoute` and router all run for real.
   ```ts
   mockApi({
       "GET /api/auth/me": { body: normalUser },   // logged in
       "GET /api/issues": { status: 500 },         // server is broken
   });
   ```
5. **No implementation details** – we never read `useState` values or call component functions. We check what is on the screen, and what request was sent over the network.

## A bug the tests found

The "session expired" test failed at first: the user was sent to `/login`, but the message *"Your session expired"* was missing.

Why: React Router changes the URL in a low-priority `startTransition`, but `setUser(null)` happened right away. So `ProtectedRoute` saw "no user" on the old page and did its own redirect to `/login` **without** the message.

Fix (in `src/auth/AuthProvider.tsx`): clear the user inside `startTransition` too, so both updates happen together. This bug is also in Day 28. It was fixed only here.

## Run the app

```bash
# backend
cd backend
cp .env.example .env   # then set your DATABASE_URL
npm install
npm run db:migrate     # creates User, Session and Issue tables
npm run seed           # admin@example.com / user@example.com, password: password123 + demo issues
npm run dev            # http://localhost:3000

# frontend (new terminal)
cd frontend
npm run dev            # http://localhost:5173
```

New backend endpoints (both need you to be logged in):

- `GET /api/issues` – all issues, newest first
- `POST /api/issues` – body `{ "title": "...", "status": "open" | "in_progress" | "closed" }`
