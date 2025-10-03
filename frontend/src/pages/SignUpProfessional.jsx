import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ProfessionalSignup } from "../api/auth";

const SignUpProfessional = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await ProfessionalSignup(data); // send data to backend
      if (result.success) {
        alert("Signup successful!");
      } else {
        alert(result.message || "Email is already registered!");
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* LEFT SIDE FORM */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col">
          {/* LOGO */}
          <div className="mb-6 flex items-center gap-2">
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500 tracking-wider">
              ServEase
            </span>
          </div>

          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.password && (
                  <span style={{ color: "red" }}>*Password* is mandatory</span>
                )}
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Skills
                </label>
                <input
                  type="text"
                  {...register("skill", { required: true })}
                  placeholder="Enter your Skills"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Experience */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Experience
                </label>
                <input
                  type="tel"
                  {...register("experience", { required: true })}
                  placeholder="Enter your Skills"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <span className="text-indigo-600 hover:underline">
                    terms of service
                  </span>{" "}
                  and{" "}
                  <span className="text-indigo-600 hover:underline">
                    privacy policy
                  </span>
                </span>
              </div>

              {/* SIGNUP BUTTON */}
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              >
                Sign Up
              </button>

              {/* LOGIN LINK */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:underline text-xl"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE ILLUSTRATION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-indigo-50 dark:bg-gray-700 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Signup illustration"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
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
    </div>
  );
};

export default SignUpProfessional;
