import type { Issue } from '../types/issue';

const IssueCard = ({issue}:{issue:Issue}) => {

    const isOverdue= 
    new Date(issue.dueDate) < new Date() && issue.status !== "Done";
  return (
    <div className='issue-card'>

    <h3 className='issue-title'>{issue.title}</h3>
    <p className='issue-description'>{issue.description}</p>

    <span className='issue-status'>Status: {issue.status ==="Done"? "Completed": issue.status}</span>

    <span className='issue-priority'>Priority: {issue.priority}</span>

    {issue.priority ==="High" && (<p className='badge badge-high'>High Priority</p>)}

    <p className='issue-due-date'>Due Date: {issue.dueDate}</p>
    {isOverdue && <p className='badge badge-overdue'>Overdue!</p>}

    </div>
  )
}

export default IssueCard;