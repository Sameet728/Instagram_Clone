

import './App.css'
import Signup from './components/Signup'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Profile from './components/Profile';
import AccountEdit from './components/AccountEdit';
import ResetPassword from './components/ResetPassword';

const browserRouter=createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/profile/:id",
        element:<Profile/>
      },
      {
        path:"account/edit",
        element:<AccountEdit/>
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
