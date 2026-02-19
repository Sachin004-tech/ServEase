import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ProfessionalSignup } from "../../api/auth";
import { useDispatch, useSelector } from "react-redux";
import { professionalUserSignup } from "../../redux/feature/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { zodResolver } from "@hookform/resolvers/zod";
import { professionalSignupSchema } from "../../utils/schema/professionalSignupSchema";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUpProfessional = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(professionalSignupSchema),
  });

  console.log("ERRORS:", errors);

  const selectedFile = watch("file");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSubmit = async (data) => {
    console.log("FORM SUBMITTED");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("skill", data.skill);
      formData.append("experience", data.experience);
      formData.append("phone", data.phone);

      if (data.file && data.file[0]) {
        formData.append("document", data.file[0]);
      }

      const resultAction = await dispatch(professionalUserSignup(formData));
      const res = unwrapResult(resultAction);
      console.log(res);
      toast.success(res.message || "Signup successful!");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50">
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
                  {...register("name")}
                  placeholder="John Doe"
                  className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="hello@example.com"
                  className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
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
                    className={`w-full px-4 py-2 pr-10 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  <span
                    className="absolute right-3 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Skills
                </label>
                <input
                  type="text"
                  {...register("skill")}
                  placeholder="Enter your Skills"
                  className={`w-full px-4 py-2 rounded-lg border ${errors.skill ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.skill && (
                  <p className="text-xs text-red-500 mt-1">{errors.skill.message}</p>
                )}
              </div>
              {/* {PhoneNumber} */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="text"
                  {...register("phone")}
                  placeholder="Enter your Phone Number"
                  className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Experience */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Experience
                </label>
                <input
                  type="tel"
                  {...register("experience")}
                  placeholder="Enter your Experience"
                  className={`w-full px-4 py-2 rounded-lg border ${errors.experience ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.experience && (
                  <p className="text-xs text-red-500 mt-1">{errors.experience.message}</p>
                )}
              </div>

              {/* FILE UPLOAD */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upload Resume / CV
                </label>
                <div className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${errors.file ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'}`}>
                  <input
                    type="file"
                    {...register("file")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    <svg className={`w-8 h-8 mb-4 transition-colors ${selectedFile?.[0] ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    {selectedFile?.[0] ? (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <p className="mb-2 text-sm text-indigo-600 font-semibold truncate max-w-xs">
                          {selectedFile[0].name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(selectedFile[0].size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, DOCX, DOC (MAX. 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {errors.file && (
                  <p className="text-xs text-red-500 mt-1">{errors.file.message}</p>
                )}
              </div>


              {/* TERMS CHECKBOX */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("terms")}
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
              {errors.terms && (
                <p className="text-xs text-red-500 -mt-4">{errors.terms.message}</p>
              )}

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
