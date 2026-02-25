import React from 'react';
import CategorySection from '../CategorySection';

const CleaningContent = ({ services }) => {
    return (
        <CategorySection
            title="Cleaning"
            subtitle="Sparkling clean homes, every time"
            category="Cleaning"
            services={services}
        />
    );
};

export default CleaningContent;
