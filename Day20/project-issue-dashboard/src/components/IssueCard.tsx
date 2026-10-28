import Badge from "./Badge";

type IssueCardProps={
    title:string;
    description:string;
    status:'active'|'pending'|'completed';

};

function IssueCard({
    title,
    description,
    status,
}:IssueCardProps){
    return(
        <article className="issue-card">
            <div className="issue-card-header">
                <h3>{title}</h3>
                <Badge label={status} status={status}/>
            </div>

            <p>{description}</p>
        </article>
    );
}

export default IssueCard;