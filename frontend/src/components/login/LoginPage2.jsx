import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "../modal/Modal";
import RoleSelection from "../RoleSelection";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ProfessionalUserLogin } from "../../redux/feature/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../utils/schema/loginSchema";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PasswordResetFlow2 from "../auth/PasswordResetFlow2";
import { CustomerLogin } from "../../api/auth";

const LoginPage2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedRole = "professional";
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const { loading, error, professionalUser } = useSelector((state) => state.auth);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        console.log(data);
        debugger;
        try {
            const resultAction = await dispatch(
                ProfessionalUserLogin({ email: data.email, password: data.password, role: selectedRole })
            );
            console.log(resultAction);
            const res = unwrapResult(resultAction);
            localStorage.setItem("token", res.token);
            console.log(res);
            toast.success(res.message);
        } catch (err) {
            toast.error(err.message || "Login failed");
        }
    };

    useEffect(() => {
        if (professionalUser) {
            navigate("/professionaldashboard");
        }
    }, [professionalUser]);

    return (
        <>
            <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50">
                <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* LOGIN FORM SECTION */}
                    <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col">
                        {/* LOGO */}
                        <div className="mb-6 flex items-center gap-2">
                            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500 tracking-wider">
                                ServEase
                            </span>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Professional Login
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Sign in to your professional account
                                    </p>
                                </div>

                                {/* EMAIL */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        placeholder="Enter Email"
                                        className={`w-full px-4 py-2 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
                                            } dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* PASSWORD */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Password
                                    </label>
                                    <div className="relative flex items-center">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            {...register("password")}
                                            placeholder="••••••••"
                                            className={`w-full px-4 py-2 pr-10 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"
                                                } dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                        />
                                        <span
                                            className="absolute right-3 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                        </span>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.password.message}
                                        </p>
                                    )}
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setShowResetModal(true)}
                                            className="text-xs text-indigo-600 hover:text-indigo-500 hover:underline transition-colors mt-1"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                </div>

                                {/* BUTTON */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Signing In..." : "Sign In"}
                                </button>

                                {/* SIGNUP LINK */}
                                <div className="text-center mt-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Don&apos;t have an account?{" "}
                                        <span
                                            onClick={() => setShowModal(true)}
                                            className="text-indigo-600 hover:underline cursor-pointer text-xl"
                                        >
                                            Create one
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* IMAGE SECTION */}
                    <div className="hidden lg:flex w-full lg:w-1/2 bg-indigo-50 dark:bg-gray-700 items-center justify-center">
                        <div className="max-w-md p-8">
                            {/* Illustration */}
                            <div className="relative aspect-square max-w-sm mx-auto">
                                <img
                                    src="/login_img.jpg"
                                    alt="Professional connection illustration"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="text-center space-y-3 mt-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Grow your service business
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Connect with local customers and manage your bookings effortlessly with ServEase.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title="Select Your Role"
                    size="md"
                >
                    <RoleSelection onClose={() => setShowModal(false)} />
                </Modal>

                {/* FORGOT PASSWORD MODAL */}
                <Modal
                    isOpen={showResetModal}
                    onClose={() => setShowResetModal(false)}
                    title="Reset Your Password"
                    size="md"
                >
                    <PasswordResetFlow2 onComplete={() => setShowResetModal(false)} />
                </Modal>
            </div>
        </>
    );
};

export default LoginPage2;
