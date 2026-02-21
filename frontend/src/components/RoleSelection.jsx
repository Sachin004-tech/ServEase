import { useNavigate } from "react-router-dom";

const RoleSelection = ({ onClose, mode = "signup" }) => {
  const navigate = useNavigate();

  const handleSelection = (role, path) => {
    if (mode === "login") {
      if (role === "customer") {
        navigate("/login", { state: { role } });
      } else {
        navigate("/loginprofessional", { state: { role } });
      }
    } else {
      navigate(path);
    }
    onClose();
  };

  return (
    <div className="w-full">
      <div className="flex justify-center gap-6">
        {/* Customer */}
        <div
          onClick={() => handleSelection("customer", "/signupcustomer")}
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
          onClick={() => handleSelection("professional", "/signupProfessional")}
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
