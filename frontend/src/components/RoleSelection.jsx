import { useNavigate } from "react-router-dom";

const RoleSelectionModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay with blur */}
      <div 
        className="absolute inset-0 backdrop-blur-[2px]" 
        onClick={onClose} 
      />

      {/* Modal content */}
      <div className="relative w-140 h-[300px] bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-10">
        <h2 className="text-xl flex items-center justify-center font-bold mb-4 text-gray-900 dark:text-white">Select Your Role</h2>
        <div className="flex gap-3 ">

            {/* Customer */}
            <div className="">
          <p className="text-xl text-white">Customer</p>
          <img onClick={()=> navigate("/signupcustomer")} className="h-40 w-40" src="Customer.jpg" alt="" />
          </div>

          {/* Professional */}
          <div className="">
          <p className="text-xl text-white">Professional</p>
          <img onClick={()=> navigate("/signupProfessional")} className="h-40 w-40" src="Customer.jpg" alt="" />
          </div>
          
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
