import axiosInstance from "./axios";

export const AdminLogin = async (loginData) => {
    try {
        const response = await axiosInstance.post("/admin/login", loginData);
        return response.data;
    } catch (error) {
        console.error("Admin login error:", error.response?.data || error.message);
        throw error;
    }
};