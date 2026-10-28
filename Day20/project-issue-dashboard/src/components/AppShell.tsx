import type {ReactNode} from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

type AppShellProps={
    children:ReactNode;
}
function AppShell({children}:AppShellProps){
    return(
        <div className='app-shell'>
            <Header/>

            <div className='app-layout'>
                <Sidebar/>
                <main className='main-content'>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AppShell;