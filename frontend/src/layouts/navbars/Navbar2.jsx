import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar2 = () => {
    const navigate = useNavigate();

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between py-3 px-4 md:px-8 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
            {/* Logo */}
            <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => navigate("/")}
            >
                <div className="p-1.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <img src="/ServEase.png" alt="ServEase" className="w-8 h-8" />
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                    ServEase
                </h1>
            </div>
        </nav>
    );
};

export default Navbar2;
