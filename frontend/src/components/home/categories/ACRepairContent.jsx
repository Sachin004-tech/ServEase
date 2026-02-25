import React from 'react';
import CategorySection from '../CategorySection';

const ACRepairContent = ({ services }) => {
    return (
        <CategorySection
            title="AC Repair & Service"
            subtitle="Stay cool with professional AC servicing"
            category="AC Repair & Service"
            services={services}
        />
    );
};

export default ACRepairContent;
