import {createBrowserRouter, RouterProvider} from "react-router";

// website page imports
import Home from "./pages/website/Home.jsx";
import WebLayout  from "./pages/layout/MainLayout.jsx";
import Cart from "./pages/website/Cart.jsx";
import Checkout from "./pages/website/Checkout.jsx";
import Invoice from "./pages/website/Invoice.jsx";
import CategoryProducts from "./pages/website/CategoryProducts.jsx";
import ProductDetails from "./pages/website/ProductDetail.jsx";
import TrackOrder from "./pages/website/TrackOrder.jsx";

import ReturnPolicy from "./pages/website/ReturnPolicy.jsx";
import TermsAndConditions from "./pages/website/TermsAndConditions.jsx";
import PrivacyPolicy from "./pages/website/PrivacyPolicy.jsx";


// auth imports
import Login from "./pages/auth/customer/Login.jsx";
import Register from "./pages/auth/customer/Register.jsx";
import UserProtectedRoute from "./middleware/userAuthMiddleware.jsx";
import UserProfile from "./pages/customer/Profile.jsx";
import ForgetPassword from "./pages/auth/customer/ForgotPassword.jsx";
import UserPublicRoute from "./middleware/UserPublicRoute.jsx";
import AdminLogin from "./pages/auth/super_admin/Login.jsx";

// admin imports
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminProtectedRoute from "./middleware/AdminProtectedRoute.jsx"; 



const router = createBrowserRouter ([
    {
        path: "/",
        element: <WebLayout />,
        children: [
            {index: true, element: <Home />},
            // {path: "/product/:id", element: <Product/>}
            {
                path: "/return-policy",
                element: <ReturnPolicy />
            },
            {
                path: "/terms-and-conditions",
                element: <TermsAndConditions />
            },
            {
                path: "/privacy-policy",
                element: <PrivacyPolicy />
            },
            {
                path: "/cart",
                element: <Cart />
            },
            {
                path: "/checkout",
                element: <Checkout/>
            },
            {
                path: "/invoice",
                element: <Invoice/>
            },
            {
                path: "/category-products",
                element: <CategoryProducts/>
            },
            {
                path: "/product-details",
                element: <ProductDetails/>
            },
            {
                path: "/track-order",
                element: <TrackOrder/>
            },

            // user public routes
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
        ]
        
    },

   

    // admin routes will be added here later

    {path: "/admin/login", element: <AdminLogin/>},
    {
        element: <AdminProtectedRoute/>,
        children: [
            {path: "/admin/dashboard", element: <AdminDashboard /> }
            
        ]
    }
    
]);

export default function App(){
    return <RouterProvider router={router}/>
}