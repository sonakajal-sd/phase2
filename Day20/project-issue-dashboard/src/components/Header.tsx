function Header(){
    return(
        <header className="header">
            <div className="header-brand">
                <h1>ProjectHub</h1>
            </div>

            <div className="header-actions">
                <button type="button">+ Create Project</button>

                <div className="user-avatar"  aria-hidden="true"> SK </div>
            </div>

        </header>
    );
}

export default Header;