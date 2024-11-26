import { urls } from "@/config/urls";

export const uploadPDF = async (file: File, fields: string[], columnDefs: any): Promise<any[]> => {
    const formData = new FormData();
    console.log("columnDefs", columnDefs);
    formData.append("file", file);
    formData.append("columnDefs", JSON.stringify(columnDefs));
    formData.append("keys", fields.filter((field) => field.trim() !== "").join(",")); // Add fields as comma-separated values
    const apiUrl = urls.apiBaseUrl + '/api/v1/process';
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Failed to upload the file");
    }

    const result = await response.json();
    return result;
  };
  