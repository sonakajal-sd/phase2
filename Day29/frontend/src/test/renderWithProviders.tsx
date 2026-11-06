import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router";
import App from "../App";
import { AuthProvider } from "../auth/AuthProvider";

type Options = {
    route?: string; // the URL the test starts on, e.g. "/issues"
};

// Renders something inside the same providers the real app uses (see main.tsx):
// a router + the AuthProvider.
// MemoryRouter keeps the URL in memory, so tests don't need a real browser address bar.
//
// It also returns `user`, which types and clicks like a real person.
export function renderWithProviders(ui: ReactElement, { route = "/" }: Options = {}) {
    const user = userEvent.setup();

    const result = render(
        <MemoryRouter initialEntries={[route]}>
            <AuthProvider>{ui}</AuthProvider>
        </MemoryRouter>,
    );

    return { user, ...result };
}

// Most tests want the whole app at a certain URL.
export function renderApp(route: string) {
    return renderWithProviders(<App />, { route });
}
