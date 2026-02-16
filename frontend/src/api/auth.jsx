import axiosInstance from "./axios";

export const CustomerSignup = async (signupData) => {
  try {
    const response = await axiosInstance.post("/customer/signup", signupData);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const ProfessionalSignup = async (signupData) => {
  try {
    const isFormData = signupData instanceof FormData;
    const response = await axiosInstance.post(
      "/professional/signup",
      signupData,
      {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      }
    );
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const CustomerLogin = async (loginData) => {
  try {
    const response = await axiosInstance.post("/customer/login", loginData);
    return response.data;
  } catch (error) {
    console.error("Customer login error:", error.response?.data || error.message);
    throw error;  // Re-throw for Redux thunk to handle
  }
};
