import { useState } from "react"
import type { leaveRequest, LeaveType } from "../types/LeaveRequest";

type LeaveFormProps={
  onSubmit:(request:leaveRequest)=>void
}

const LeaveForm = ({onSubmit}:LeaveFormProps) => {

    
    const [reason, setReason]=useState("");
    const [leaveType, setLeaveType]=useState<LeaveType>("annual");
    const [startDate, setStartDate]=useState("");
    const[endDate, setEndDate]=useState("");


    //success
    const[message, setMessage]=useState("");


    //error messages
    const [reasonError, setReasonError]=useState("");
    const[startDateError, setStartDateError]=useState("");
    const[endDateError, setEndDateError]=useState("");








    ///handle Submit

    function handleSubmit(event:React.SubmitEvent<HTMLFormElement>){
      event.preventDefault();
      setMessage("");

      if(!reason.trim()){
        setReasonError("Please enter a reason");
        return
      }
      setReasonError("");

      if(!startDate){
        setStartDateError("Please Enter the Start Date");
        return
      }
      setStartDateError('');

      if(!endDate){
        setEndDateError("Please Set End Date");
        return
      }
      setEndDateError("");


      if(endDate < startDate){
        setEndDateError("End Date should not be before start date");
        return;
      }

      const newRequest:leaveRequest={
        id:Date.now(),
        leaveType,
        reason,
        startDate,endDate,
        status:"Pending"
      }
      onSubmit(newRequest);
      setReason("");
      setStartDate("");
      setEndDate("");

      setMessage("Leave Request Submitted Successfully");
    }






  return (
   <section className="card" aria-labelledby="form-heading">
    <h2 id="form-heading">Apply for Leave</h2>

    <form className="leave-form" onSubmit={handleSubmit} noValidate>

    <label htmlFor="leavetype">Leave Type</label>
      <select id="leavetype" value={leaveType} onChange={(e)=>setLeaveType(e.target.value as LeaveType)}>
        <option value="annual">Annual Leave</option>
        <option value="sick">Sick Leave</option>
        <option value="casual">Casual Leave</option>
      </select>


    <label htmlFor="reason">Reason for Leave</label>
    <input type="text"
     id="reason"
     value={reason}
    
     onChange={(e)=>{setReason(e.target.value); setReasonError("")}}/>
     {reasonError && <p id="reason-error" className="error" role="alert">{reasonError}</p>}

    <div className="date-row">
      <div className="field">
        <label htmlFor="startdate">Start Date</label>
        <input type="date" id="startdate" value={startDate}
       
         onChange={(e)=>{setStartDate(e.target.value); setStartDateError("")} } />
        {startDateError && <p id="startdate-error" className="error" role="alert">{startDateError}</p>}
      </div>

      <div className="field">
        <label htmlFor="enddate">End Date</label>
        <input type="date" id="enddate"  value={endDate}
        
         onChange={(e)=>{setEndDate(e.target.value); setEndDateError("")}}/>
        {endDateError && <p id="enddate-error" className="error" role="alert">{endDateError}</p>}
      </div>
    </div>


    <button type="submit" className="btn">Submit Request</button>

    <p className="success" role="status">{message}</p>

    </form>
   </section>
  )
}

export default LeaveForm
