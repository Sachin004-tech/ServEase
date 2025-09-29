import axiosInstance from "./axios";

export const signup = async (signupData) => {
  try {
    const response = await axiosInstance.post("/customer/signup", signupData);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error; 
  }
};
