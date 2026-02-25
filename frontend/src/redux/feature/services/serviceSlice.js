import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyServices, editService, deleteService, addService } from "../../../api/auth";

export const AddMyServices = createAsyncThunk(
    "services/addMyServices",
    async (serviceData) => {
        const response = await addService(serviceData);
        return response; // Return full response { success, message, service }
    }
);

export const fetchMyServices = createAsyncThunk(
    "services/fetchMyServices",
    async () => {
        const response = await getMyServices();
        return response; // Return full response { success, services }
    }
);

export const updateService = createAsyncThunk(
    "services/updateService",
    async ({ serviceId, serviceData }) => {
        const response = await editService(serviceId, serviceData);
        return { serviceId, ...response }; // Include serviceId for state lookup
    }
);

export const removeService = createAsyncThunk(
    "services/removeService",
    async (serviceId) => {
        await deleteService(serviceId);
        return serviceId;
    }
);

const serviceSlice = createSlice({
    name: "services",
    initialState: {
        services: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(AddMyServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AddMyServices.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.service) {
                    state.services.push(action.payload.service);
                }
            })
            .addCase(AddMyServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchMyServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchMyServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(updateService.fulfilled, (state, action) => {
                const { serviceId, service } = action.payload;
                state.services = state.services.map(s =>
                    s._id === serviceId
                        ? { ...s, ...service }
                        : s
                );
            })
            .addCase(removeService.fulfilled, (state, action) => {
                state.services = state.services.filter(
                    service => service._id !== action.payload
                );
            });
    },
});

export default serviceSlice.reducer;