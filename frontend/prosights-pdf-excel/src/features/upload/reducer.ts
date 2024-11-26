import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

interface UploadState {
  uploads: {
    id: string; // Unique identifier for each upload
    file: File;
    results: { [key: string]: any }[]; // API results for the file
    loading: boolean; // Loading state for this specific file
    error?: string; // Error message if the upload fails
    columnDefs: any;
  }[];
}

const initialState: UploadState = {
  uploads: [],
};
const uploadSlice = createSlice({
    name: "upload",
    initialState,
    reducers: {
      startUpload(state, action: PayloadAction<{ id: string; file: File; columnDefs: any; fields: string[] }>) {
        state.uploads.push({
          id: action.payload.id, // Use the provided ID
          file: action.payload.file,
          results: [],
          loading: true,
          columnDefs: action.payload.columnDefs,
        });
      },
      uploadSuccess(
        state,
        action: PayloadAction<{ id: string; results: { [key: string]: any }[] }>
      ) {
        const upload = state.uploads.find((u) => u.id === action.payload.id);
        if (upload) {
          upload.loading = false;
          upload.results = action.payload.results;
        }
      },
      uploadFailure(
        state,
        action: PayloadAction<{ id: string; error: string }>
      ) {
        const upload = state.uploads.find((u) => u.id === action.payload.id);
        if (upload) {
          upload.loading = false;
          upload.error = action.payload.error;
        }
      },
    },
  });

export const { startUpload, uploadSuccess, uploadFailure } = uploadSlice.actions;
export default uploadSlice.reducer;
