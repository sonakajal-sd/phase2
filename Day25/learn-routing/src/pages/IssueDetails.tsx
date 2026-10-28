import { useParams } from "react-router";
import { issues } from "../data/issues";
const IssueDetails = () => {
    const {id}= useParams();
    const dynamic= issues.find((issue)=> issue.id === Number(id));
  return (
    <div>
       {dynamic ? (
        <h1>{dynamic.title}</h1>
       ) :(
        <h1>Issues not found</h1>
       )} 
    </div>
  )
}

export default IssueDetails