import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CustomerLogin,
  ProfessionalLogin,
  CustomerSignup,
  ProfessionalSignup,
} from "../../../api/auth";              // Importing API functions that make real HTTP requests

//Login
export const CustomerUserLogin = createAsyncThunk(
  "auth/CustomerUserLogin",
  async (userData, { rejectWithValue }) => { // userData → { email, password } (from frontend)

    try {
      const res = await CustomerLogin(userData);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login Failed");
    }
  }
);

export const ProfessionalUserLogin = createAsyncThunk(
  "auth/ProfessionalUserLogin",
  async (userData, { rejectWithValue }) => { // userData → { email, password } (from frontend)

    try {
      const res = await ProfessionalLogin(userData);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login Failed");
    }
  }
);

// Signup - Customer
export const customerUserSignup = createAsyncThunk(
  "auth/customerUserSignup",
  async (userData, { rejectWithValue }) => {     // userData → { name, email, password, phone, address }
    try {
      const res = await CustomerSignup(userData);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Customer signup failed");
    }
  }
);

//Signup - Professional
export const professionalUserSignup = createAsyncThunk(
  "auth/professionalUserSignup",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await ProfessionalSignup(userData);          //  Calling backend API function
      return res;                                            //  Return backend response to reducer (fulfilled)
    } catch (error) {
      return rejectWithValue(error.response?.data || "Professional signup failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    customerUser: JSON.parse(localStorage.getItem("customerUser")) || null,
    professionalUser: JSON.parse(localStorage.getItem("professionalUser")) || null,
    loading: false,
    error: null,
  },
  reducers: {                // Logout → clears all user info
    logout: (state) => {
      state.customerUser = null;
      state.professionalUser = null;
      state.error = null;
      localStorage.removeItem("customerUser");
      localStorage.removeItem("professionalUser");
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    //CustomerLogin
    builder.addCase(CustomerUserLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(CustomerUserLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.customerUser = action.payload;
      localStorage.setItem("customerUser", JSON.stringify(action.payload));
    });

    builder.addCase(CustomerUserLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //professional login

    builder.addCase(ProfessionalUserLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(ProfessionalUserLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.professionalUser = action.payload;
      localStorage.setItem("professionalUser", JSON.stringify(action.payload));
    });

    builder.addCase(ProfessionalUserLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // signup Customer
    builder.addCase(customerUserSignup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(customerUserSignup.fulfilled, (state, action) => {
      state.loading = false;
      state.customerUser = action.payload;
    });

    builder.addCase(customerUserSignup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // signup Professional
    builder.addCase(professionalUserSignup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(professionalUserSignup.fulfilled, (state, action) => {
      state.loading = false;
      state.professionalUser = action.payload;
    });

    builder.addCase(professionalUserSignup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;        // Exporting the logout function for use in components
export default authSlice.reducer;                  // Exporting reducer for Redux store
