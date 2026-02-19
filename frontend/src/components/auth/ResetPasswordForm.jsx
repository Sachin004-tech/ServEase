import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../utils/schema/passwordResetSchema";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordForm = ({ onSubmit, loading }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password */}
            <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    New Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="••••••••"
                        className={`w-full px-4 py-2 pr-10 rounded-lg bg-gray-700 border ${errors.password ? "border-red-500" : "border-gray-600"
                            } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="••••••••"
                        className={`w-full px-4 py-2 pr-10 rounded-lg bg-gray-700 border ${errors.confirmPassword ? "border-red-500" : "border-gray-600"
                            } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );
};

export default ResetPasswordForm;
