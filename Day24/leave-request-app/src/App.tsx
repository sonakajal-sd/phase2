import { useState } from 'react'
import type { leaveRequest } from './types/LeaveRequest'
import './App.css'
import LeaveBalance from './components/LeaveBalance'
import LeaveForm from './components/LeaveForm'
import LeaveList from './components/LeaveList'
import LeaveFilter from './components/LeaveFilter'
import { sampleRequests } from './data/leaveData'

function App() {

  // the list of all leave requests (starts with the sample data)
  const [requests, setRequests] = useState<leaveRequest[]>(sampleRequests);

  // what the user picked in the two filter dropdowns
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // called by LeaveForm when a new request is submitted
  // puts the new request at the top of the list
  function addRequest(request: leaveRequest) {
    setRequests([request, ...requests]);
  }

  // only keep the requests that match both filters
  const filteredRequests = requests.filter((request) => {
    const statusMatch = statusFilter === "All" || request.status === statusFilter;
    const typeMatch = typeFilter === "All" || request.leaveType === typeFilter;
    return statusMatch && typeMatch;
  });

  return (
    <main className="app">
      <h1>Employee Leave Request</h1>

      <div className="layout">
        <div className="sidebar">
          <LeaveBalance requests={requests} />
          <LeaveForm onSubmit={addRequest} />
        </div>

        <section className="card">
          <h2>My Leave Requests</h2>

          <LeaveFilter
            status={statusFilter}
            leaveType={typeFilter}
            onStatusChange={setStatusFilter}
            onLeaveTypeChange={setTypeFilter}
          />

          <LeaveList requests={filteredRequests} />
        </section>
      </div>
    </main>
  )
}

export default App
