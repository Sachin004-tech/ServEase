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
export const ProfessionalLogin = async (loginData) => {
  try {
    const response = await axiosInstance.post("/professional/login", loginData);
    return response.data;
  } catch (error) {
    console.error("Professional login error:", error.response?.data || error.message);
    throw error;  // Re-throw for Redux thunk to handle
  }
};

export const forgotPassword = async (payload) => {
  try {
    const response = await axiosInstance.post("/customer/forgot-password", payload);
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error.response?.data || error.message);
    throw error;  // Re-throw for Redux thunk to handle
  }
};

export const verifyOTP = async (payload) => {
  try {
    const response = await axiosInstance.post("/customer/verify-otp", payload);
    return response.data;
  } catch (error) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error;  // Re-throw for Redux thunk to handle
  }
};

export const resetPassword = async (payload) => {
  try {
    const response = await axiosInstance.post("/customer/reset-password", payload);
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error.response?.data || error.message);
    throw error;  // Re-throw for Redux thunk to handle
  }
};

export const forgotPassword2 = async (payload) => {
  try {
    const response = await axiosInstance.post("/professional/forgot-password", payload);
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error.response?.data || error.message);
    throw error;  // Re-throw for Redux thunk to handle
  }
};

export const verifyOTP2 = async (payload) => {
  try {
    const response = await axiosInstance.post("/professional/verify-otp", payload);
    return response.data;
  } catch (error) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error;  // Re-throw for Redux thunk to handle
  }
};

export const resetPassword2 = async (payload) => {
  try {
    const response = await axiosInstance.post("/professional/reset-password", payload);
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error.response?.data || error.message);
    throw error;  // Re-throw for Redux thunk to handle
  }
};

