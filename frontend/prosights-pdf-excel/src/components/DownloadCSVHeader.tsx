import React from 'react';

const DownloadCSVHeader = () => {
  const handleDownload = () => {
    // Assuming `rowData` is the data you want to download as CSV.
    // Convert `rowData` to CSV here.
    // In a real-world scenario, you could use a library like `json2csv` or create a function to format CSV properly.
    console.log("Download CSV button clicked");
    // Add your CSV download logic here.
  };

  return (
    <div className="flex items-center justify-end">
      <button
        onClick={handleDownload}
        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Download CSV
      </button>
    </div>
  );
};

export default DownloadCSVHeader;
