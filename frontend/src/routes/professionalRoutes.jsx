import SignUpProfessional from "../pages/register/SignUpProfessional";
import ProfessionalDashboard from "../pages/professional/professionalDashboard";
import LoginPage2 from "../components/login/LoginPage2";

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
];

export default professionalRoutes;
