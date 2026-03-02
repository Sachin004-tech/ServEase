import React from 'react';
import CategorySection from '../CategorySection';

const PlumbingContent = ({ services }) => {
    return (
        <CategorySection
            title="Plumbing"
            subtitle="Expert plumbing solutions at your doorstep"
            category="Plumbing"
            services={services}
        />
    );
};

export default PlumbingContent;
