import { faClipboardList, faFolderOpen, faGaugeHigh, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Sidebar(){
    return(
        <aside className="sidebar">
            <nav aria-label="Main navigation">
                <ul>
                    <li className="active">
                        <div><FontAwesomeIcon icon={faGaugeHigh} className="icons"/></div>
                        <span>Dashboard</span>
                    </li>

                    <li>
                        <div><FontAwesomeIcon icon={faFolderOpen}  className="icons"/></div>
                        <span>Project</span>
                    </li>

                    <li>
                        <div><FontAwesomeIcon icon={faClipboardList}  className="icons"/></div>
                        <span>Issues</span>
                    </li>

                    <li>
                         <div><FontAwesomeIcon icon={faGear}  className="icons"/></div>
                        <span>Settings</span>
                    </li>

                </ul>
            </nav>
        </aside>
    );
}
export default Sidebar;