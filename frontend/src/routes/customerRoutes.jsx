import HomePage from "../pages/HomePage";
import LoginPage from "../components/login/LoginPage";
import SignUpCustomer from "../pages/register/SignUpCustomer";

const customerRoutes = [
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/signupcustomer",
        element: <SignUpCustomer />,
    },
];

export default customerRoutes;
