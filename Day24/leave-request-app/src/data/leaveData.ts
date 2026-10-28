import type { leaveRequest } from "../types/LeaveRequest";

export const sampleRequests:leaveRequest[]=[
  {id:1, leaveType:"annual", reason:"Family trip", startDate:"2026-09-01", endDate:"2026-09-03", status:"Approved"},
  {id:2, leaveType:"sick", reason:"Fever", startDate:"2026-10-05", endDate:"2026-10-05", status:"Approved"},
  {id:3, leaveType:"casual", reason:"Personal work", startDate:"2026-10-28", endDate:"2026-10-28", status:"Pending"},
  {id:4, leaveType:"annual", reason:"Wedding", startDate:"2026-08-10", endDate:"2026-08-12", status:"Rejected"},
];
