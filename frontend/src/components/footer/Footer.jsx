import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-200 border-t border-gray-100 pt-16 pb-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    {/* Company Section */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Company</h4>
                        <ul className="flex flex-col gap-3">
                            <li><a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">About us</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Terms & conditions</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Privacy policy</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Anti-discrimination policy</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">UC impact</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Careers</a></li>
                        </ul>
                    </div>

                    {/* For Customers Section */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">For customers</h4>
                        <ul className="flex flex-col gap-3">
                            <li><a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">UC reviews</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Categories near you</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Blog</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Contact us</a></li>
                        </ul>
                    </div>

                    {/* For Partners Section */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">For partners</h4>
                        <ul className="flex flex-col gap-3">
                            <li><a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Register as a professional</a></li>
                        </ul>
                    </div>

                    {/* Social Media Section */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Social links</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors">
                                <span className="text-gray-600 text-xs">𝕏</span>
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors">
                                <span className="text-gray-600 text-xs">📸</span>
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors">
                                <span className="text-gray-600 text-xs">🔗</span>
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors">
                                <span className="text-gray-600 text-xs">📘</span>
                            </a>
                        </div>
                    </div>

                    {/* App Store Section */}
                    <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                        <div className="flex flex-col gap-3">
                            <a href="#" className="h-10 border border-gray-200 rounded-lg flex items-center px-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <span className="text-xs font-bold text-gray-800">App Store</span>
                            </a>
                            <a href="#" className="h-10 border border-gray-200 rounded-lg flex items-center px-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <span className="text-xs font-bold text-gray-800">Google Play</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col items-center gap-6">
                    <p className="text-[10px] text-gray-600 font-medium">
                        * As on December 31, 2024
                    </p>
                    <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">S</div>
                            <span className="text-lg font-bold text-gray-900 tracking-tight">ServEase</span>
                        </div>
                        <p className="text-[10px] md:text-xs text-gray-600 font-medium text-center md:text-right max-w-3xl">
                            © Copyright 2026 ServEase Company Limited (formerly known as ServEase Technologies India Limited and ServEase Technologies India India Limited) All rights reserved. | CIN: L74140DL2014PLC274413
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
