import { countDays, type leaveRequest } from "../types/LeaveRequest";

type leaveListProps={
  requests:leaveRequest[]
}
const LeaveList = ({requests}: leaveListProps) => {

  //empty state
  if(requests.length === 0){
    return <p className="state">No leave requests found.</p>
  }

  return (
    <ul className="request-list">
        {requests.map((request) => (
           <li key={request.id} className="request-item">
            <div className="request-head">
              <h3>
                {request.leaveType} Leave
              </h3>
              <span className={`badge badge-${request.status.toLowerCase()}`}>{request.status}</span>
            </div>

            <p>
              <strong>Reason: </strong>{request.reason}
            </p>

            <p>
              <strong>Dates: </strong>{request.startDate} to {request.endDate}
              {" "}({countDays(request.startDate, request.endDate)} days)
            </p>
           </li>
        ))}
    </ul>
  )
}

export default LeaveList;
