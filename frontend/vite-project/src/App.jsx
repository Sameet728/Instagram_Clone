

import './App.css'
import Signup from './components/Signup'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Profile from './components/Profile';
import AccountEdit from './components/AccountEdit';
import ResetPassword from './components/ResetPassword';
import ProtectedRoutes from './components/ProtectedRoutes';

const browserRouter=createBrowserRouter([
  {
    path:"/",
    element:<ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children:[
      {
        path:"/",
        element:<ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path:"/profile/:id",
        element: <ProtectedRoutes> <Profile /></ProtectedRoutes>
      },
      {
        path:"account/edit",
        element: <ProtectedRoutes><AccountEdit/></ProtectedRoutes>
      }
    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"forgot-password-reset",
    element:<ResetPassword/>
  }
])

function App() {
  

  return (
    <>
    <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
