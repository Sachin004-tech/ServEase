// import { useNavigate } from "react-router-dom";

// const RoleSelectionModal = ({ onClose }) => {
//   const navigate = useNavigate();

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       {/* Background overlay with blur */}
//       <div className="absolute inset-0 backdrop-blur-[2px]" onClick={onClose} />

//       {/* Modal content */}
//       <div className="relative w-140 h-[300px] bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-10">
//         <h2 className="text-xl flex items-center justify-center font-bold mb-4 text-gray-900 dark:text-white">
//           Select Your Role
//         </h2>
//         <div className="flex gap-3 ">
//           {/* Customer */}
//           <div className="">
//             <p className="text-xl text-white">Customer</p>
//             <img
//               onClick={() => navigate("/signupcustomer")}
//               className="h-40 w-40"
//               src="Customer.jpg"
//               alt=""
//             />
//           </div>

//           {/* Professional */}
//           <div className="">
//             <p className="text-xl text-white">Professional</p>
//             <img
//               onClick={() => navigate("/signupProfessional")}
//               className="h-40 w-40"
//               src="Customer.jpg"
//               alt=""
//             />
//           </div>
//         </div>
//         <button
//           onClick={onClose}
//           className="mt-4 text-gray-500 hover:underline"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RoleSelectionModal;













import { useNavigate } from "react-router-dom";

const RoleSelection = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">

      <div className="flex justify-center gap-6">
        {/* Customer */}
        <div
          onClick={() => navigate("/signupcustomer")}
          className="cursor-pointer text-center"
        >
          <p className="text-lg font-medium mb-2">Customer</p>
          <img
            className="h-40 w-40 mx-auto"
            src="/Customer.jpg"
            alt="Customer"
          />
        </div>

        {/* Professional */}
        <div
          onClick={() => navigate("/signupProfessional")}
          className="cursor-pointer text-center"
        >
          <p className="text-lg font-medium mb-2">Professional</p>
          <img
            className="h-40 w-40 mx-auto"
            src="/Customer.jpg"
            alt="Professional"
          />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="hover:underline text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
