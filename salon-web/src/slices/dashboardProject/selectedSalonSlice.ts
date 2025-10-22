import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Salon data interface
interface SalonData {
  salon_id: number;
  salon_name: string;
  address: string;
  is_like: boolean;
}


// Barber data interface
interface Barber {
  id: number;
  name: string;
  occupation: string;
  userImage: string | null;
}


// Service data interface
type Service = {
  id: number;
  name: string;
  duration: string;
  price: number;
  count: number; // Add count field for each service
};

// Selected Salon State interface
interface SelectedSalonState {
  selectedSalon: SalonData | null;
  selectedSalonId: string | null;
  selectedSalonName: string | null;
  selectedAddress: string | null;
  selectedPhotos: string | null;
  selectedBarber: Barber | null;
  selectedSlotId: number | null;
  totalPrice: number | null;
}

// Selected Service State interface
interface SelectedServicesState {
  selectedServices: Service[]; // Now storing an array of services with count
}

// Initial state for selected salon
const initialSalonState: SelectedSalonState = {
  selectedSalon: null,
  selectedBarber: null,
  selectedSlotId: null,
  selectedSalonId: null,
  selectedSalonName: null,
  selectedAddress: null,
  selectedPhotos: null,
  totalPrice:null,
};

// Initial state for selected services
const initialServiceState: SelectedServicesState = {
  selectedServices: [], // Initializing with an empty array
};

// Slice for managing selected salon data
const selectedSalonSlice = createSlice({
  name: "selectedSalon",
  initialState: initialSalonState,
  reducers: {
    setSelectedSalon(state, action: PayloadAction<SalonData>) {
      state.selectedSalon = action.payload; // Set the selected salon data
    },
    clearSelectedSalon(state) {
      state.selectedSalon = null; // Clear the selected salon data
    },
    setSelectedSalonId(state, action: PayloadAction<string | null>) { // New action
      state.selectedSalonId = action.payload;
    },
    setSelectedSalonName(state, action: PayloadAction<string | null>) {
      state.selectedSalonName = action.payload; // Store salon names
    },
    setSelectedSalonAddress(state, action: PayloadAction<string | null>) {
      state.selectedAddress = action.payload; // Store salon address
    },

    setSelectedSalonPhotos(state, action: PayloadAction<string | null>) {
      state.selectedPhotos = action.payload; 
    },

    setTotalPrice(state, action: PayloadAction<number | null>) {
      state.totalPrice = action.payload;
    },

    clearTotalPrice(state) { // New action to clear the total price
      state.totalPrice = null; // Reset to the default value
    },

    clearSelectedSalonId(state) { // New action
      state.selectedSalonId = null;
    },
    clearSelectedSalonName(state) {
      state.selectedSalonName = null; // Clear salon name
    },
    clearSelectedSalonAddress(state) {
      state.selectedAddress = null; // Clear salon address
    },
    clearSelectedSalonPhotos(state) {
      state.selectedPhotos = null; // Clear salon address
    },

    setSelectedBarber(state, action: PayloadAction<Barber | null>) {
      state.selectedBarber = action.payload;  // Set the selected barber data
    },
    clearSelectedBarber(state) {
      state.selectedBarber = null;  // Clear the selected barber data
    },
    setSelectedSlotId(state, action: PayloadAction<number | null>) { // New action
      state.selectedSlotId = action.payload;
    },
    clearSelectedSlotId(state) { // New action
      state.selectedSlotId = null;
    },

  },
});

const selectedServiceSlice = createSlice({
  name: "selectedService",
  initialState: initialServiceState,
  reducers: {
    setSelectedService(state, action: PayloadAction<Service>) {
    
      // Check if the service already exists in the array
      const existingService = state.selectedServices.find(
        (service) => service.id === action.payload.id
      );

      if (existingService) {
        // If the service already exists, update the count based on the incoming payload
        existingService.count = action.payload.count;
      } else {
        // If the service is not in the array, add it with the count
        state.selectedServices.push({ ...action.payload });
      }
    },
    clearSelectedService(state, action: PayloadAction<number>) {
      // Remove a service from the array by its id
      state.selectedServices = state.selectedServices.filter(
        (service) => service.id !== action.payload
      );
    },
    clearAllSelectedServices(state) {
      // Clear all selected services
      state.selectedServices = [];
    },
  },
});


// Exporting actions from both slices
export const {
  setSelectedSalon,
  clearSelectedSalon,
  setSelectedSalonId, // Export the new action
  clearSelectedSalonId,
  setSelectedSalonName,
  setSelectedSalonAddress,
  clearSelectedSalonName,
  clearSelectedSalonAddress,
  setSelectedBarber,
  clearSelectedBarber,
  setSelectedSlotId, // Export new action
  clearSelectedSlotId,
  setSelectedSalonPhotos,
  clearSelectedSalonPhotos,
  setTotalPrice,
  clearTotalPrice,
} = selectedSalonSlice.actions;

export const {
  setSelectedService,
  clearSelectedService,
  clearAllSelectedServices,
} = selectedServiceSlice.actions;

// Export reducers from both slices
export const selectedSalonReducer = selectedSalonSlice.reducer;
export const selectedServiceReducer = selectedServiceSlice.reducer;
