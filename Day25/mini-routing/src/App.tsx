import { BrowserRouter,Route,Routes } from 'react-router'
import './App.css'
import LayoutPage from './pages/LayoutPage'
import HomePage from './pages/HomePage'
import ServicePage from './pages/ServicePage'
import IssuePage from './pages/IssuePage'
import NotFound from './pages/NotFound'
import IssueDetail from './pages/IssueDetail'

function App() {
  

  return (
   <BrowserRouter>
    <Routes>
      <Route path='/' element={<LayoutPage/>}>
      <Route index element={<HomePage/>}/>
      <Route path='/service' element={<ServicePage/>}/>
      <Route path='/issues/:id' element={<IssueDetail/>}/>
      <Route path='/issues' element={<IssuePage/>} />
      </Route>
      <Route path='*' element={<NotFound/>}/>
    </Routes>
   </BrowserRouter>
  )
}

export default App;
