import Seo from "../../components/common/Seo";
import LoginPage from "../../components/LoginPage";

const index = () => {
    return (
        <>
            <Seo pageTitle="Register" />
            <LoginPage />
        </>
    );
};

export const getStaticProps = async () => {
    return {
        props: {},
    };
};
export default index;
