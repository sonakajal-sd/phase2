import Avatar from "./Avatar"
import Badge from "./Badge"
import EmptyState from "./EmptyState"
import IssueCard from "./IssueCard"
import ProjectCard from "./ProjectCard"


function ComponentGallery(){
    return(
        <div className="component-gallery">
            <h2>Component Gallery</h2>
            <p>Preview and test our reusable components.</p>

            <section>
                <h3>Badges</h3>
                <Badge label="Active" status="active"/>
                <Badge label="Pending" status="pending"/>
                <Badge label="Completed" status="completed"/>
            </section>

            <section>
                <h3>Avatars</h3>
                <div className="gallery-row">
                    <Avatar name="Sona Kajal"/>
                    <Avatar name="Akshay Kumar"/>
                    <Avatar name="Rahul"/>
                </div>
            </section>

            <section>
                <h3>Project Cards</h3>
                <ProjectCard title="Marketing Dashboard"/>
                <ProjectCard title= "todo Application"/>
            </section>

            <section>
                <h3>Issue card</h3>
                <IssueCard
                title="Fix Login Button"
                description="The login button is not responding"
                status="pending"
                />

                <IssueCard
                title="Fix Login Button"
                description="The login button is not responding"
                status="pending"
                />
            </section>

            <section>
                <h3>Empty State</h3>
                <EmptyState
                title="No issues yet"
                message="Issues will appear here when they are created."
                />
            </section>
        </div> 
    );
}

export default ComponentGallery;