import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../utils/schema/passwordResetSchema";

const ForgotPasswordForm = ({ onSubmit, loading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                </label>
                <input
                    type="email"
                    {...register("email")}
                    placeholder="Enter your registered email"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors.email ? "border-red-500" : "border-gray-600"
                        } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
                {loading ? "Sending..." : "Send OTP"}
            </button>
        </form>
    );
};

export default ForgotPasswordForm;
