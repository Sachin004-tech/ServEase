import React from 'react';
import CategorySection from '../CategorySection';

const ApplianceRepairContent = ({ services }) => {
    return (
        <CategorySection
            title="Appliance Repair"
            subtitle="Get your appliances fixed by experts"
            category="Appliance Repair"
            services={services}
        />
    );
};

export default ApplianceRepairContent;
