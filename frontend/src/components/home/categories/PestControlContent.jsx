import React from 'react';
import CategorySection from '../CategorySection';

const PestControlContent = ({ services }) => {
    return (
        <CategorySection
            title="Pest Control"
            subtitle="Keep your home pest-free and healthy"
            category="Pest Control"
            services={services}
        />
    );
};

export default PestControlContent;
