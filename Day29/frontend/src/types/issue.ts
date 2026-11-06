export type IssueStatus = "open" | "in_progress" | "closed";

export type Issue = {
    id: number;
    title: string;
    status: IssueStatus;
    authorId: number;
    createdAt: string;
};

// Friendly text to show for each status
export const STATUS_LABELS: Record<IssueStatus, string> = {
    open: "Open",
    in_progress: "In progress",
    closed: "Closed",
};
