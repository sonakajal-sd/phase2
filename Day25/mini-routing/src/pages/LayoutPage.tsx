
import { NavLink , Outlet } from 'react-router'

const LayoutPage = () => {
  return (
    <div>
        <NavLink to="/">Home Page</NavLink> {"|"}
        <NavLink to="/issues">Issues Page</NavLink> {"|"}
        <NavLink to="/service">Service Page</NavLink>{"|"}
        <NavLink to="/issues/1">Issue Detail</NavLink>
        <Outlet/>
    </div>
  )
}

export default LayoutPage