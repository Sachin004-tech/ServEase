import { useState, useEffect } from "react";
import { Link } from "react-router";
import RoleSelection from "../components/RoleSelection";
import { useForm } from "react-hook-form";
import { AdminLogin } from "../api/auth";

const LoginPage = () => {
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data)
    try {
      const res = await AdminLogin(data);
      localStorage.setItem("adminToken", res.token);
      alert(res.message);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* LOGIN FORM SECTION */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col">
            {/* LOGO */}
            <div className="mb-6 flex items-center gap-2">
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500 tracking-wider">
                ServEase
              </span>
            </div>

            {/* ERROR MESSAGE EXAMPLE (static) */}
            {/* <div ref={errRef} className={`${errMsg ? "errmsg" : "offscreen"} mb-4 rounded-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3`}>
            {errMsg}
          </div> */}
            {/* <div ref={errRef} className={`${seerror ? "errmsg" : "offscreen"} mb-4 rounded-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3`}>Invalid Credential</div> */}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Welcome Back
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sign in to your account to continue your journey
                  </p>
                </div>

                {/* UserName */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    UserName
                  </label>
                  <input
                    type="text"
                    {...register("username")}
                    placeholder="Enter UserName"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.username && <p>{errors.username.message}</p>}
                </div>

                {/* PASSWORD */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  value={isSubmitting ? "Submitting" : "Something Wrong"}
                  className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                >
                  Sign In
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
                    {/* <Link to="/signup" className="text-indigo-600 hover:underline text-xl">
                    Create one
                  </Link> */}
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
                  alt="Language connection illustration"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-center space-y-3 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Connect with language partners worldwide
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Practice conversations, make friends, and improve your
                  language skills together
                </p>
              </div>
            </div>
          </div>
        </div>
        <RoleSelection show={showModal} onClose={() => setShowModal(false)} />
      </div>
    </>
  );
};

export default LoginPage;
