import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { adminUser, loggedInAs, loggedOut, mockApi, normalUser, sampleIssues } from "./test/mockApi";
import { renderApp } from "./test/renderWithProviders";

describe("Protected routes", () => {
    it("sends a logged-out visitor to the login page", async () => {
        mockApi(loggedOut);
        renderApp("/issues");

        expect(await screen.findByRole("heading", { name: "Login" })).toBeInTheDocument();
        expect(screen.queryByRole("heading", { name: "Issues" })).not.toBeInTheDocument();
    });

    it("blocks a normal user from the admin page", async () => {
        mockApi(loggedInAs(normalUser));
        renderApp("/admin");

        expect(await screen.findByRole("heading", { name: "Access denied" })).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "Admin" })).not.toBeInTheDocument();
    });

    it("lets an admin open the admin page", async () => {
        mockApi({ ...loggedInAs(adminUser), "GET /api/admin/users": { body: [adminUser, normalUser] } });
        renderApp("/admin");

        expect(await screen.findByRole("heading", { name: "Admin" })).toBeInTheDocument();
        expect(await screen.findByText(/user@example.com/)).toBeInTheDocument();
    });
});

describe("Navigation", () => {
    it("moves between pages using the navbar links", async () => {
        mockApi({
            ...loggedInAs(adminUser),
            "GET /api/dashboard": { body: { message: "Hi" } },
            "GET /api/issues": { body: sampleIssues },
            "GET /api/admin/users": { body: [] },
        });
        const { user } = renderApp("/dashboard");
        expect(await screen.findByRole("heading", { name: "Dashboard" })).toBeInTheDocument();

        await user.click(screen.getByRole("link", { name: "Issues" }));
        expect(await screen.findByRole("heading", { name: "Issues" })).toBeInTheDocument();

        await user.click(screen.getByRole("link", { name: "Admin" }));
        expect(await screen.findByRole("heading", { name: "Admin" })).toBeInTheDocument();
    });

    it("sends unknown URLs to the dashboard", async () => {
        mockApi({ ...loggedInAs(normalUser), "GET /api/dashboard": { body: { message: "Hi" } } });
        renderApp("/this-page-does-not-exist");

        expect(await screen.findByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    });

    it("logs out and goes back to the login page", async () => {
        mockApi({
            ...loggedInAs(normalUser),
            "GET /api/dashboard": { body: { message: "Hi" } },
            "POST /api/auth/logout": { status: 204 },
        });
        const { user } = renderApp("/dashboard");

        await user.click(await screen.findByRole("button", { name: "Logout" }));

        expect(await screen.findByRole("heading", { name: "Login" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
    });
});
