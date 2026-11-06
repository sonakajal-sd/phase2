import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loggedInAs, mockApi, normalUser, sampleIssues } from "../test/mockApi";
import { renderApp } from "../test/renderWithProviders";

// Small helper: the titles of the issues the user can currently see.
function visibleIssueTitles() {
    const list = screen.getByRole("list", { name: "Issue list" });
    return within(list)
        .getAllByRole("listitem")
        .map((item) => item.firstChild?.textContent?.trim());
}

describe("Issues page", () => {
    it("shows a loading message, then the issues from the API", async () => {
        mockApi({ ...loggedInAs(normalUser), "GET /api/issues": { body: sampleIssues } });
        renderApp("/issues");

        expect(await screen.findByRole("status")).toHaveTextContent("Loading issues...");
        expect(await screen.findByRole("list", { name: "Issue list" })).toBeInTheDocument();
        expect(visibleIssueTitles()).toEqual(["Login button is too small", "Add dark mode", "Fix typo on dashboard"]);
    });

    it("filters issues by status", async () => {
        mockApi({ ...loggedInAs(normalUser), "GET /api/issues": { body: sampleIssues } });
        const { user } = renderApp("/issues");
        await screen.findByRole("list", { name: "Issue list" });

        await user.selectOptions(screen.getByLabelText("Filter by status"), "Closed");
        expect(visibleIssueTitles()).toEqual(["Fix typo on dashboard"]);

        await user.selectOptions(screen.getByLabelText("Filter by status"), "All");
        expect(visibleIssueTitles()).toHaveLength(3);
    });

    it("filters issues by search text and says when nothing matches", async () => {
        mockApi({ ...loggedInAs(normalUser), "GET /api/issues": { body: sampleIssues } });
        const { user } = renderApp("/issues");
        await screen.findByRole("list", { name: "Issue list" });

        await user.type(screen.getByRole("searchbox", { name: "Search" }), "DARK");
        expect(visibleIssueTitles()).toEqual(["Add dark mode"]); // search ignores upper/lower case

        await user.clear(screen.getByRole("searchbox", { name: "Search" }));
        await user.type(screen.getByRole("searchbox", { name: "Search" }), "nothing like this");
        expect(screen.getByText("No issues match your filters.")).toBeInTheDocument();
        expect(screen.queryByRole("list", { name: "Issue list" })).not.toBeInTheDocument();
    });

    it("shows an empty state when there are no issues", async () => {
        mockApi({ ...loggedInAs(normalUser), "GET /api/issues": { body: [] } });
        renderApp("/issues");

        expect(await screen.findByText("No issues yet. Create the first one above.")).toBeInTheDocument();
    });

    it("shows an error and loads again when the user clicks Try again", async () => {
        // First the server is broken...
        mockApi({ ...loggedInAs(normalUser), "GET /api/issues": { status: 500 } });
        const { user } = renderApp("/issues");

        const alert = await screen.findByRole("alert");
        expect(alert).toHaveTextContent("Could not load issues.");

        // ...then it is fixed, and the user retries.
        mockApi({ ...loggedInAs(normalUser), "GET /api/issues": { body: sampleIssues } });
        await user.click(within(alert).getByRole("button", { name: "Try again" }));

        expect(await screen.findByRole("list", { name: "Issue list" })).toBeInTheDocument();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("adds a newly created issue to the top of the list", async () => {
        const newIssue = { id: 4, title: "Page crashes on refresh", status: "open", authorId: 1, createdAt: "2026-11-02" };
        mockApi({
            ...loggedInAs(normalUser),
            "GET /api/issues": { body: sampleIssues },
            "POST /api/issues": { status: 201, body: newIssue },
        });
        const { user } = renderApp("/issues");
        await screen.findByRole("list", { name: "Issue list" });

        await user.type(screen.getByLabelText("Title"), "Page crashes on refresh");
        await user.click(screen.getByRole("button", { name: "Create issue" }));

        expect(await screen.findByText("Page crashes on refresh")).toBeInTheDocument();
        expect(visibleIssueTitles()[0]).toBe("Page crashes on refresh");
    });

    it("sends the user to login when the session has expired", async () => {
        mockApi({ ...loggedInAs(normalUser), "GET /api/issues": { status: 401 } });
        renderApp("/issues");

        expect(await screen.findByRole("heading", { name: "Login" })).toBeInTheDocument();
        expect(screen.getByText("Your session expired. Please log in again.")).toBeInTheDocument();
    });
});
