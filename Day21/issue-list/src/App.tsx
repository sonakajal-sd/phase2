
import './App.css'
import { issues } from './data/issues'
import IssueCard from './components/IssueCard'

function App() {
  if (issues.length === 0) {
    return <p>No issues Found</p>
  }

  const openIssues = issues.filter((issue) => {
    if (issue.status === "Open") {
      return true
    }
    return false
  })

  const inProgress= issues.filter((issue)=>{
    if(issue.status === "In Progress"){
      return true;
    }
    return false;
  })

  const done= issues.filter((issue)=>{
    if(issue.status ==="Done"){
      return true;
    }
    return false;
  })

  return (
    <main className="issue-board">
      <h1 className="board-title">Issue Tracker</h1>

      <div className="board-columns">
        <section className="issue-column issue-column-open">
          <h2 className="column-title">Open Issues</h2>
          {openIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
            />
          ))}
        </section>

        <section className="issue-column issue-column-progress">
          <h2 className="column-title">In Progress Issues</h2>
          {inProgress.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
            />
          ))}
        </section>

        <section className="issue-column issue-column-done">
          <h2 className="column-title">Completed Issues</h2>
          {done.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
            />
          ))}
        </section>
      </div>
    </main>
  )
}

export default App
