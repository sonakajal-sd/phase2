import './App.css'
import IssueDashboard from './components/IssueDashboard';

function App() {
  return (
    <main className="issue-board">
      <h1 className="board-title">Issue Tracker</h1>
      <IssueDashboard />
    </main>
  )
}

export default App
