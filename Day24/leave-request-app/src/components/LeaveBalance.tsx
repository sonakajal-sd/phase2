import type { leaveRequest } from "../types/LeaveRequest";

type LeaveBalanceProps={
  requests:leaveRequest[]
}

const LeaveBalance = ({requests}:LeaveBalanceProps) => {
  const balance= {
    annual:12,
    sick:6,
    casual:4,
  }

  const pending= requests.filter((request)=>request.status === "Pending").length;
  const approved= requests.filter((request)=>request.status === "Approved").length;
  const rejected= requests.filter((request)=>request.status === "Rejected").length;

  return (
    <section className="card" aria-labelledby="balance-heading">
        <h2 id="balance-heading">Leave Balance</h2>

        <ul className="balance-list">
          <li className="balance-item">
            <span className="balance-label">Annual Leave</span>
            <span className="balance-value">{balance.annual}</span>
            <span className="balance-total">days</span>
          </li>
          <li className="balance-item">
            <span className="balance-label">Sick Leave</span>
            <span className="balance-value">{balance.sick}</span>
            <span className="balance-total">days</span>
          </li>
          <li className="balance-item">
            <span className="balance-label">Casual Leave</span>
            <span className="balance-value">{balance.casual}</span>
            <span className="balance-total">days</span>
          </li>
        </ul>

        <p className="summary">
          Pending: {pending} | Approved: {approved} | Rejected: {rejected}
        </p>
    </section>
  )
}

export default LeaveBalance
