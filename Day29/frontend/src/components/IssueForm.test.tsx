import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { mockApi } from "../test/mockApi";
import IssueForm from "./IssueForm";

// IssueForm does not use the router or auth, so a plain render() is enough here.

describe("IssueForm", () => {
    it("shows a title field, a status field and a submit button", () => {
        render(<IssueForm onCreated={vi.fn()} />);

        expect(screen.getByRole("form", { name: "New issue" })).toBeInTheDocument();
        expect(screen.getByLabelText("Title")).toBeInTheDocument();
        expect(screen.getByLabelText("Status")).toHaveValue("open"); // default status
        expect(screen.getByRole("button", { name: "Create issue" })).toBeEnabled();
    });

    it("shows an error and sends nothing when the title is empty", async () => {
        const user = userEvent.setup();
        const fetchMock = mockApi({});
        const onCreated = vi.fn();
        render(<IssueForm onCreated={onCreated} />);

        await user.click(screen.getByRole("button", { name: "Create issue" }));

        expect(screen.getByRole("alert")).toHaveTextContent("Title is required.");
        expect(fetchMock).not.toHaveBeenCalled();
        expect(onCreated).not.toHaveBeenCalled();
    });

    it("sends the issue to the API and clears the form", async () => {
        const user = userEvent.setup();
        const savedIssue = { id: 10, title: "New bug", status: "closed", authorId: 1, createdAt: "2026-11-02" };
        const fetchMock = mockApi({ "POST /api/issues": { status: 201, body: savedIssue } });
        const onCreated = vi.fn();
        render(<IssueForm onCreated={onCreated} />);

        await user.type(screen.getByLabelText("Title"), "New bug");
        await user.selectOptions(screen.getByLabelText("Status"), "Closed");
        await user.click(screen.getByRole("button", { name: "Create issue" }));

        // The right request went over the network...
        expect(fetchMock).toHaveBeenCalledWith(
            "/api/issues",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({ title: "New bug", status: "closed" }),
            }),
        );
        // ...the parent was told about the new issue...
        expect(onCreated).toHaveBeenCalledWith(savedIssue);
        // ...and the form is ready for the next one.
        expect(screen.getByLabelText("Title")).toHaveValue("");
    });

    it("shows an error when the server fails", async () => {
        const user = userEvent.setup();
        mockApi({ "POST /api/issues": { status: 500 } });
        render(<IssueForm onCreated={vi.fn()} />);

        await user.type(screen.getByLabelText("Title"), "New bug");
        await user.click(screen.getByRole("button", { name: "Create issue" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Could not create the issue");
        expect(screen.getByLabelText("Title")).toHaveValue("New bug"); // the user's text is kept
    });
});
