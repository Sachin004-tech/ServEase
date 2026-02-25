import React from 'react';
import CategorySection from '../CategorySection';

const SalonWomenContent = ({ services }) => {
    return (
        <CategorySection
            title="Salon for Women"
            subtitle="Salon-like grooming at the comfort of your home"
            category="Salon for Women"
            services={services}
        />
    );
};

export default SalonWomenContent;
