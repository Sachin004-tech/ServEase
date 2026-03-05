import HomePage from "../pages/HomePage";
import LoginPage from "../components/login/LoginPage";
import SignUpCustomer from "../pages/register/SignUpCustomer";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import CustomerBookings from "../pages/CustomerBookings";

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
    {
        path: "/products",
        element: <Products />,
    },
    {
        path: "/cart",
        element: <Cart />,
    },
    {
        path: "/customer-bookings",
        element: <CustomerBookings />,
    },
];

export default customerRoutes;
