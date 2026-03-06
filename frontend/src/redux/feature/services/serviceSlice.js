import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyServices, editService, deleteService, addService, toggleStatus } from "../../../api/auth";

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

export const toggleServiceStatus = createAsyncThunk(
    "services/toggleStatus",
    async (serviceId) => {
        const response = await toggleStatus(serviceId);
        return { serviceId, ...response };
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
                    (s.service_id === serviceId || s._id === serviceId)
                        ? { ...s, ...service }
                        : s
                );
            })
            .addCase(removeService.fulfilled, (state, action) => {
                state.services = state.services.filter(
                    service => (service.service_id !== action.payload && service._id !== action.payload)
                );
            })
            .addCase(toggleServiceStatus.fulfilled, (state, action) => {
                const { serviceId, new_status } = action.payload;
                state.services = state.services.map(s =>
                    (s.service_id === serviceId || s._id === serviceId)
                        ? { ...s, status: new_status }
                        : s
                );
            });
    },
});

export default serviceSlice.reducer;