import './App.css';
import AppShell from './components/AppShell';
import Badge from './components/Badge';
import ProjectCard from './components/ProjectCard';
import IssueCard from './components/IssueCard';

function App() {
  const projects = [
    { id: 1, title: 'Marketing Dashboard' },
    { id: 2, title: 'Todo Application' },
    { id: 3, title: 'Issue Tracker' },
  ];

  const issues=[
    {
      id:1,
      title:'Fix login button',
      description:'The login button is not responding',
      status:'pending' as const,
    },
    {
      id:2,
      title:'resolve API error',
      description:'Dashboard API returns an unexpected error',
      status:'active' as const,
    },
    {
      id:3,
      title:'Update dashboard design',
      description:'Improve spacing and responsive layout',
      status:'completed' as const,
    },
  ];

  return (
    <AppShell>
      <section className="dashboard-heading">
        <h2>Project Dashboard</h2>
        <p>Manage your projects and issues in one place.</p>
      </section>

      <section className="dashboard-section">
        <h3>Project Status</h3>
        <div className="badge-list">
          <Badge label="Active" status="active" />
          <Badge label="Pending" status="pending" />
          <Badge label="Completed" status="completed" />
        </div>
      </section>

     

      <section className="dashboard-section">
        <h3>My Projects</h3>
        <div className="project-list">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
            />
          ))}
        </div>
      </section>

     <section className='dashboard-section'>
      <h3>Issues</h3>

      {issues.map((issue)=>(
        <IssueCard
        key={issue.id}
        title={issue.title}
        description={issue.description}
        status={issue.status}
        />
      ))}
     </section>
    </AppShell>
  );
}

export default App;