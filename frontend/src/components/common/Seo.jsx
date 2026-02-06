import { Helmet } from "react-helmet";

const Seo = ({ pageTitle }) => (
    <>
        <Helmet>
            <title>{pageTitle && `${pageTitle} | ServEase`}</title>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
        </Helmet>
    </>
);

export default Seo;
