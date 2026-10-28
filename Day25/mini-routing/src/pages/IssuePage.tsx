import { issues } from "../data/issues";

const IssuePage = () => {
    
  return (
    <div>
       <ul>
        {issues.map((issue)=>(
            <li key={issue.id}>
                {issue.title}
            </li>
        ))}
       </ul>
    </div>
  )
}

export default IssuePage