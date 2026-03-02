import React from 'react';
import CategorySection from '../CategorySection';

const PaintingContent = ({ services }) => {
    return (
        <CategorySection
            title="Painting & Waterproofing"
            subtitle="Give your home a fresh new look"
            category="Painting & Waterproofing"
            services={services}
        />
    );
};

export default PaintingContent;
