import React from 'react';

const HomeRightContent = () => {
    return (
        <div className="w-full md:w-5/12 h-64 md:h-[85vh] sticky top-4 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
            <img
                src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1696852847761-574450.jpeg"
                alt="Home services banner"
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default HomeRightContent;
