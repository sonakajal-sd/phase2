export type Status= "Pending"|"Approved"|"Rejected";

export type LeaveType= "annual"|"sick"|"casual";

export type leaveRequest={
  id:number,
  leaveType:LeaveType,
  reason:string,
  startDate:string,
  endDate:string
  status:Status
}

// number of days from start to end, counting both days
export function countDays(startDate:string, endDate:string){
  const oneDay= 1000*60*60*24;
  const difference= new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.round(difference/oneDay) + 1;
}
