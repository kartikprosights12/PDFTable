import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UploadState {
  uploads: {
    id: string; // Unique identifier for each upload
    file: File;
    results: { [key: string]: any }[]; // API results for the file
    loading: boolean; // Loading state for this specific file
    error?: string; // Error message if the upload fails
    columnDefs: any;
    userId: string;
    documentId?: string;
    document_url?: string;
  }[];
}

const initialState: UploadState = {
  uploads: [],
};
const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    startUpload(
      state,
      action: PayloadAction<{
        id: string;
        documentId?: string;
        file: File;
        columnDefs: any;
        fields: string[];
        userId: string;
      }>
    ) {
      const existingUpload = state.uploads.find(
        (u) => u.file.name === action.payload.file.name
      );

      if (existingUpload) {
        // Update the columnDefs for the existing file instead of adding a duplicate
        existingUpload.columnDefs = action.payload.columnDefs;
      } else {
        // Add a new upload if it doesn't exist already
        state.uploads.push({
          id: action.payload.id, // Use the provided ID
          file: action.payload.file,
          results: [],
          loading: true,
          columnDefs: action.payload.columnDefs,
          userId: action.payload.userId,
        });
      }
    },
    uploadSuccess(
      state,
      action: PayloadAction<{ id: string; document_url: string; results: { [key: string]: any }[] }>
    ) {
      const upload = state.uploads.find((u) => u.id === action.payload.id);
      if (upload) {
        upload.loading = false;
        upload.results = action.payload.results;
        if (action.payload.document_url) {
          upload.document_url = action.payload.document_url;
        }
      }
    },
    uploadFailure(state, action: PayloadAction<{ id: string; error: string }>) {
      const upload = state.uploads.find((u) => u.id === action.payload.id);
      if (upload) {
        upload.loading = false;
        upload.error = action.payload.error;
      }
    },
    updateDocumentId(
        state,
        action: PayloadAction<{ tempId: string; documentId: string }>
      ) {
        const upload = state.uploads.find((u) => u.id === action.payload.tempId);
        if (upload) {
          upload.documentId = action.payload.documentId;
        }
      }
  },
});

export const { startUpload, uploadSuccess, uploadFailure, updateDocumentId } =
  uploadSlice.actions;
export default uploadSlice.reducer;
