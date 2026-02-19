import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOTPSchema } from "../../utils/schema/passwordResetSchema";
import { useState, useEffect } from "react";
import { OTP_VALIDATION_TIMER_MILI } from "../../utils/constants/constants";

const VerifyOTPForm = ({ onSubmit, loading, email }) => {
    const [timer, setTimer] = useState(OTP_VALIDATION_TIMER_MILI.LIMIT);
    const [secRemaining, setSecRemaining] = useState(OTP_VALIDATION_TIMER_MILI.LIMIT % 60);
    const [minsRemaining, setMinsRemaining] = useState(Math.floor(OTP_VALIDATION_TIMER_MILI.LIMIT / 60));

    useEffect(() => {
        const id = setInterval(() => {
            setTimer((p) => p - 1);
        }, 1000);

        if (0 === timer) clearInterval(id)
        return () => clearInterval(id)
    }, [timer])

    useEffect(() => {
        setSecRemaining(timer % 60);
        setMinsRemaining(Math.floor(timer / 60));

        if (timer === 0) {
            toast.error("OTP has been expired!", 2000);
            setOTPModal(false)
        }
    }, [timer])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(verifyOTPSchema),
        defaultValues: { otp: "" },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-gray-400">
                Enter the 6-digit OTP sent to <span className="text-white font-medium">{email}</span>
            </p>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    OTP Code
                </label>
                <input
                    type="text"
                    {...register("otp")}
                    maxLength={6}
                    placeholder="000000"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors.otp ? "border-red-500" : "border-gray-600"
                        } text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.otp && (
                    <p className="text-red-500 text-xs mt-1 text-left">{errors.otp.message}</p>
                )}
            </div>
            <div className="otp-timer flex justify-center py-2 gap-1">
                <span className="mins text-white">{minsRemaining < 10 ? "0" + minsRemaining : minsRemaining}</span>
                <span className="div text-white">:</span>
                <span className="secs text-white">{secRemaining < 10 ? "0" + secRemaining : secRemaining}</span>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
                {loading ? "Verifying..." : "Verify OTP"}
            </button>
        </form>
    );
};

export default VerifyOTPForm;
