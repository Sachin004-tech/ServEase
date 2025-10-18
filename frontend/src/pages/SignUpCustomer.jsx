import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
// import { CustomerSignup } from "../api/auth";
import { useDispatch, useSelector } from "react-redux";            //Redux se dispatch (action trigger karne ke liye) aur useSelector (state access karne ke liye)
import { customerUserSignup } from "../redux/feature/auth/authSlice"; //customerUserSignup – Redux thunk action jo signup request bhejta hai
import { unwrapResult } from "@reduxjs/toolkit"; //unwrapResult – Redux Toolkit helper, jo async thunk ka final result nikalta hai

const SignUpCustomer = () => {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth); //Redux store se authentication-related data nikal rahe hain (state.auth se)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {   //Redux thunk ko call kar rahe hain jo API ke through backend ko request bhejta hai
      const resultAction = await dispatch(
        customerUserSignup({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          address: data.address,
        })
      );
      //  unwrapResult() se thunk ka final response nikal rahe hain
      // agar thunk fail ho to ye error throw karega (try/catch ke andar)
      const res = unwrapResult(resultAction);
      console.log(res);

      if (res.success) {
        alert("Signup successful!");
      } else {
        alert(res.message || "Email is already registered!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(
        error.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* LEFT SIDE FORM */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col">
          {/* LOGO */}
          <div className="mb-8 flex items-center gap-2">
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500 tracking-wider">
              ServEase
            </span>
          </div>

          <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                Create an Account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Join ServEase and start your journey
              </p>
            </div>

            {/* FULL NAME */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                {...register("name", { required: true })}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="hello@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                {...register("password", { required: true })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.password && (
                <span style={{ color: "red" }}>*Password* is mandatory</span>
              )}
              {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Password must be at least 6 characters long
              </p> */}
            </div>

            {/* PHONE NUMBER */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phone", { required: true })}
                placeholder="Enter Your Number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* ADDRESS */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <input
                type="text"
                {...register("address", { required: true })}
                placeholder="Enter Your Address"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* TERMS CHECKBOX */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{" "}
                <span className="text-indigo-600 hover:underline cursor-pointer">
                  terms of service
                </span>{" "}
                and{" "}
                <span className="text-indigo-600 hover:underline cursor-pointer">
                  privacy policy
                </span>
              </span>
            </div>

            {/* SIGNUP BUTTON */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            >
              Sign Up
            </button>

            {/* LOGIN LINK */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:underline font-semibold"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT SIDE ILLUSTRATION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-indigo-50 dark:bg-gray-700 items-center justify-center p-8">
          <div className="max-w-md text-center">
            <img
              src="/i.png"
              alt="Signup illustration"
              className="w-full h-auto object-contain mb-6"
            />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Connect with language partners worldwide
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Practice conversations, make friends, and improve your language
              skills together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpCustomer;
