import React from 'react';
import CategorySection from '../CategorySection';

const SalonMenContent = ({ services }) => {
    return (
        <CategorySection
            title="Salon for Men"
            subtitle="Expert grooming and hairstyles at home"
            category="Salon for Men"
            services={services}
        />
    );
};

export default SalonMenContent;
