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
    const response = await axiosInstance.post(
      "/professional/signup",
      signupData
    );
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};
