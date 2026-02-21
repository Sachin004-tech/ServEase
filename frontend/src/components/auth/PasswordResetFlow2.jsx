import React, { useState } from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import VerifyOTPForm from "./VerifyOTPForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { forgotPassword2, verifyOTP2, resetPassword2 } from "../../api/auth";
import { toast } from "react-toastify";

const PasswordResetFlow2 = ({ onComplete }) => {
    const [step, setStep] = useState(1); // 1: Forgot, 2: OTP, 3: Reset
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleForgotPassword = async (data) => {
        setLoading(true);
        try {
            const res = await forgotPassword2({ email: data.email });
            setEmail(data.email);
            toast.success(res.message || "OTP sent successfully!");
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (data) => {
        setLoading(true);
        try {
            // Assuming backend needs { email, otp }
            const res = await verifyOTP2({ email, otp: data.otp });
            toast.success(res.message || "OTP verified!");
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (data) => {
        setLoading(true);
        try {
            // Assuming backend needs { email, password } 
            const res = await resetPassword2({ email, password: data.password });
            toast.success(res.message || "Password reset successful!");
            onComplete(); // Close modal or redirect
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-2">
            {step === 1 && (
                <ForgotPasswordForm onSubmit={handleForgotPassword} loading={loading} />
            )}
            {step === 2 && (
                <VerifyOTPForm
                    onSubmit={handleVerifyOTP}
                    loading={loading}
                    email={email}
                />
            )}
            {step === 3 && (
                <ResetPasswordForm onSubmit={handleResetPassword} loading={loading} />
            )}

            {/* Step Indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`h-1.5 w-8 rounded-full transition-colors ${s === step ? "bg-indigo-600" : "bg-gray-700"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default PasswordResetFlow2;
