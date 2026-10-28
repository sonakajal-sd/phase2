import { useParams } from 'react-router'
import { issues } from '../data/issues';



const IssueDetail = () => {
    const {id}= useParams();
    const filterIssue= issues.find((issue)=>issue.id === Number(id));
  return (
    <div>
        {filterIssue ? ( 
            <div>
                <h1>{filterIssue.title}</h1>
                <h2>{filterIssue.date}</h2>
            </div>
            
        ) : (
            <p>Page not found</p>
        )}
       
    </div>
  )
}

export default IssueDetail;