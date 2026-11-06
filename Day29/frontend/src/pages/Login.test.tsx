import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loggedOut, mockApi, normalUser } from "../test/mockApi";
import { renderApp } from "../test/renderWithProviders";

describe("Login page", () => {
    it("logs the user in and opens the dashboard", async () => {
        const fetchMock = mockApi({
            ...loggedOut,
            "POST /api/auth/login": { body: normalUser },
            "GET /api/dashboard": { body: { message: "Welcome back, Normal User!" } },
        });
        const { user } = renderApp("/login");

        await user.type(await screen.findByLabelText("Email"), "user@example.com");
        await user.type(screen.getByLabelText("Password"), "password123");
        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
        expect(await screen.findByText("Welcome back, Normal User!")).toBeInTheDocument();
        expect(screen.getByText("Normal User (user)")).toBeInTheDocument(); // navbar

        expect(fetchMock).toHaveBeenCalledWith(
            "/api/auth/login",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({ email: "user@example.com", password: "password123" }),
            }),
        );
    });

    it("shows an error when the password is wrong", async () => {
        mockApi({
            ...loggedOut,
            "POST /api/auth/login": { status: 401, body: { message: "Wrong email or password" } },
        });
        const { user } = renderApp("/login");

        await user.type(await screen.findByLabelText("Email"), "user@example.com");
        await user.type(screen.getByLabelText("Password"), "wrong");
        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Login failed. Check your email and password.");
        expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument(); // still on login
    });
});
