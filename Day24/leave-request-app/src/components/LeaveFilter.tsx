type LeaveFilterProps={
  status:string,
  leaveType:string,
  onStatusChange:(value:string)=>void,
  onLeaveTypeChange:(value:string)=>void
}

const LeaveFilter = ({status, leaveType, onStatusChange, onLeaveTypeChange}:LeaveFilterProps) => {
  return (
    <div className="filters">
      <div className="field">
        <label htmlFor="filter">Status</label>
        <select id="filter" value={status} onChange={(e)=>onStatusChange(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="typefilter">Leave Type</label>
        <select id="typefilter" value={leaveType} onChange={(e)=>onLeaveTypeChange(e.target.value)}>
          <option value="All">All</option>
          <option value="annual">Annual</option>
          <option value="sick">Sick</option>
          <option value="casual">Casual</option>
        </select>
      </div>
    </div>
  )
}

export default LeaveFilter
