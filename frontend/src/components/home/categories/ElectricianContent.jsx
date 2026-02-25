import React from 'react';
import CategorySection from '../CategorySection';

const ElectricianContent = ({ services }) => {
    return (
        <CategorySection
            title="Electrician"
            subtitle="Safe and reliable electrical services"
            category="Electrician"
            services={services}
        />
    );
};

export default ElectricianContent;
