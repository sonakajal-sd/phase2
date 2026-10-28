type ProjectcardProps={
    title:string;
}


function ProjectCard({title}:ProjectcardProps){
    return(
        <article className="project-card">
            <h3>{title}</h3>
            <p>Manage your project tasks here.</p>
        </article>
    );
}

export default ProjectCard;