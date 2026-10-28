
import { NavLink, Outlet } from 'react-router'

const Layout = () => {
  return (
   <>

   <nav>
   <NavLink to="/">Home</NavLink> {"|"}
   <NavLink to="/issues">Issues</NavLink>{"|"}
   <NavLink to="/issues/1">IssueDetails</NavLink> {"|"}
   <NavLink to="/about">About</NavLink>
   </nav>
   <Outlet/>

   </>
  )
}

export default Layout