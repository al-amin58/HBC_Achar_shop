import {createBrowserRouter, RouterProvider} from "react-router";
import Home from "./pages/website/Home.jsx";
// import Layout from "./pages/website/Layout.jsx";
// import About from "./pages/website/About.jsx";
// import Contact from "./pages/website/Contact.jsx";
import Login from "./pages/auth/customer/Login.jsx";
import Register from "./pages/auth/customer/Register.jsx";
import UserProtectedRoute from "./middleware/userAuthMiddleware.jsx";
import UserProfile from "./pages/customer/Profile.jsx";
import ForgetPassword from "./pages/auth/customer/ForgotPassword.jsx";
import UserPublicRoute from "./middleware/UserPublicRoute.jsx";


const router = createBrowserRouter ([
    {
        path: "/", element: <Home/>
        // {path: "/product/:id", element: <Product/>}
        // element: <Layout />,
        // children: [
        //     {
        //         index: true,
        //         element: <Home />
        //     },
        //     {
        //         path: "about",
        //         element: <About />
        //     },
        //     {
        //         path: "contact",
        //         element: <Contact />
        //     }
        // ]
    },

    {
        element: <UserPublicRoute/>,
        children: [
            {path: "/login", element: <Login/>},
            {path: "/register", element: <Register/>},
            {path: "/forgot-password", element: <ForgetPassword/>},
        ]
    },
   

    //user protected routes
     {
        element: <UserProtectedRoute/>,
        children: [
            {path: "/customer", element: <UserProfile /> }
        ]
    },
    
]);

export default function App(){
    return <RouterProvider router={router}/>
}