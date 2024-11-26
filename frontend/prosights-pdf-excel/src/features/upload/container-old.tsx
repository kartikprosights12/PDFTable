import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { startUpload } from "./reducer";

const UploadContainer: React.FC = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = value;
    setFields(updatedFields);
  };

  const addField = () => setFields([...fields, ""]);
  const removeField = (index: number) => setFields(fields.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!file) {
      alert("Please upload a file before submitting.");
      return;
    }
    setIsSubmitting(true);
    dispatch(startUpload({ file, fields }));
    setIsSubmitting(false);
  };

  const getFilePreview = () => {
    if (!file) return null;

    const fileType = file.type.split("/")[0];
    const fileURL = URL.createObjectURL(file);

    if (fileType === "image") {
      return <img src={fileURL} alt="Preview" className="w-full h-auto rounded-md" />;
    }

    if (fileType === "application" && file.type === "application/pdf") {
      return (
        <iframe
          src={fileURL}
          title="PDF Preview"
          className="w-full h-[400px] rounded-md"
          frameBorder="0"
        ></iframe>
      );
    }

    return <p className="text-gray-500">Preview Not Available</p>;
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">Scalable PDF Uploader</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {/* Upload Box */}
        <div className="bg-white p-6 shadow-md rounded-md w-[400px]">
          <h3 className="text-lg font-semibold mb-4">Upload Your File</h3>
          <div className="mb-4">
            <input
              type="file"
              accept=".csv, .xlsx, .pdf, .png, .jpg, .jpeg, .xls, .docx, .doc, .txt"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${
                isSubmitting
                  ? "file:bg-gray-300 file:text-gray-500"
                  : "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              }`}
            />
          </div>
          <h4 className="text-md font-semibold mb-2">Fields to Extract</h4>
          {fields.map((field, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={field}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                placeholder={`Field ${index + 1}`}
                className="border rounded-md p-2 text-sm w-full mr-2"
              />
              <button
                onClick={() => removeField(index)}
                className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addField}
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm mb-4"
          >
            Add Field
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || isSubmitting}
            className={`w-full bg-green-500 text-white px-4 py-2 rounded-md text-sm ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* File Preview Box */}
        <div className="bg-white p-6 shadow-md rounded-md w-[400px]">
          <h3 className="text-lg font-semibold mb-4">File Preview</h3>
          <div className="border rounded-md p-2 bg-gray-50 h-[400px] flex items-center justify-center">
            {getFilePreview() || <p className="text-gray-500">No file selected</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadContainer;
