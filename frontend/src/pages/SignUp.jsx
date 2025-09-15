// import React from "react";
// import { Link } from "react-router-dom";

// const SignUp = () => {
//   return (
//     <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
//       <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
//         {/* LEFT SIDE FORM */}
//         <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
//           {/* LOGO */}
//           <div className="mb-4 flex items-center justify-start gap-2">
//             <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
//               ServEase
//             </span>
//           </div>

//           <form>
//             <div className="space-y-4">
//               <div>
//                 <h2 className="text-xl font-semibold">Create an Account</h2>
//                 <p className="text-sm opacity-70">
//                   Join Streamify and start your language learning adventure!
//                 </p>
//               </div>

//               <div className="space-y-3">
//                 <div className="form-control w-full">
//                   <label className="label">
//                     <span className="label-text">Full Name</span>
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="John Doe"
//                     className="input input-bordered w-full"
//                   />
//                 </div>

//                 <div className="form-control w-full">
//                   <label className="label">
//                     <span className="label-text">Email</span>
//                   </label>
//                   <input
//                     type="email"
//                     placeholder="john@gmail.com"
//                     className="input input-bordered w-full"
//                   />
//                 </div>

//                 <div className="form-control w-full">
//                   <label className="label">
//                     <span className="label-text">Password</span>
//                   </label>
//                   <input
//                     type="password"
//                     placeholder="********"
//                     className="input input-bordered w-full"
//                   />
//                   <p className="text-xs opacity-70 mt-1">
//                     Password must be at least 6 characters long
//                   </p>
//                 </div>

//                 <div className="form-control">
//                   <label className="label cursor-pointer justify-start gap-2">
//                     <input type="checkbox" className="checkbox checkbox-sm" />
//                     <span className="text-xs leading-tight">
//                       I agree to the{" "}
//                       <span className="text-primary hover:underline">terms of service</span> and{" "}
//                       <span className="text-primary hover:underline">privacy policy</span>
//                     </span>
//                   </label>
//                 </div>
//               </div>

//               <button className="btn btn-primary w-full" type="button">
//                 Create Account
//               </button>

//               <div className="text-center mt-4">
//                 <p className="text-sm">
//                   Already have an account?{" "}
//                   <Link href="/login" className="text-primary hover:underline">
//                     Sign in
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* RIGHT SIDE ILLUSTRATION */}
//         <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
//           <div className="max-w-md p-8">
//             <div className="relative aspect-square max-w-sm mx-auto">
//               <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
//             </div>

//             <div className="text-center space-y-3 mt-6">
//               <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
//               <p className="opacity-70">
//                 Practice conversations, make friends, and improve your language skills together
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;






















import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
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

          <form className="w-full">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create an Account</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join ServEase and start your journey
                </p>
              </div>

              {/* FULL NAME */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs opacity-70 mt-1">Password must be at least 6 characters long</p>
              </div>

              {/* TERMS CHECKBOX */}
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the <span className="text-indigo-600 hover:underline">terms of service</span> and <span className="text-indigo-600 hover:underline">privacy policy</span>
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
                  <Link to="/login" className="text-indigo-600 hover:underline text-xl">
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
              <img src="/i.png" alt="Signup illustration" className="w-full h-full object-contain" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Connect with language partners worldwide
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
