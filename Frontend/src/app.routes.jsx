import { createBrowserRouter } from "react-router";
import Register from "./feature/auth/pages/Register"
import Login from "./feature/auth/pages/Login"
import Protected from "./feature/auth/components/Protected";
import Home from "./feature/Home/Pages/Home";

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Protected><Home/></Protected>
    },
    {
        path:'/register',
        element:<Register/>
    },
    {
        path:'/login',
        element:<Login/>
    }   

])