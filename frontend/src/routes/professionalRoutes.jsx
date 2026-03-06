import SignUpProfessional from "../pages/register/SignUpProfessional";
import ProfessionalDashboard from "../pages/professional/professionalDashboard";
import LoginPage2 from "../components/login/LoginPage2";
import ServicesForm from "../components/services/ServicesForm";
import Kyc from "../components/kyc/kyc";
import ProfessionalBookings from "../pages/professional/ProfessionalBooking";
import ManageServices from "../components/services/Manage-Services";

const professionalRoutes = [
    {
        path: "/signupprofessional",
        element: <SignUpProfessional />,
    },
    {
        path: "/loginprofessional",
        element: <LoginPage2 />,
    },
    {
        path: "/professionaldashboard",
        element: <ProfessionalDashboard />,
    },
    {
        path: "/professionaldashboard/services",
        element: <ServicesForm />,
    },
    {
        path: "/professionaldashboard/kyc",
        element: <Kyc />,
    },
    {
        path: "/professionaldashboard/professional-bookings",
        element: <ProfessionalBookings />,
    },
    {
        path: "/professionaldashboard/manage-services",
        element: <ManageServices />,
    },
];

export default professionalRoutes;
