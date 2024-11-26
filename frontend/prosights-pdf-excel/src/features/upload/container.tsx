import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startUpload } from "./reducer";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { RootState } from "@/redux/Store";
import ButtonComponent from "../../components/buttonComponent";
import { v4 as uuidv4 } from "uuid";
import { PiColumnsPlusRightFill } from "react-icons/pi";
import { LuUpload } from "react-icons/lu";
import LabelWithIcon from "@/components/labelComponent";
const UploadContainer: React.FC = () => {
  const dispatch = useDispatch();

  // Redux state
  const uploads = useSelector((state: RootState) => state.upload.uploads);

  // Local state
  const [rowData, setRowData] = useState<any[]>([]);
  const [fields, setFields] = useState<string[]>([""]); // Fields state
  const [columnDefs, setColumnDefs] = useState<any[]>([
    { headerName: "Document", field: "document", flex: 1 },
    { headerName: "Date", field: "date", flex: 1 },
    { headerName: "Document Type", field: "type", flex: 1 },
    { headerName: "Company Name", field: "companyName", flex: 1 },
    { headerName: "Company Description", field: "companyDescription", flex: 1 },
    {
      headerName: "Company Business Model",
      field: "companyBusinessModel",
      flex: 1,
    },
    { headerName: "Company Industry", field: "companyIndustry", flex: 1 },
    {
      headerName: "List of Management Team",
      field: "listOfManagementTeam",
      flex: 1,
    },
    { headerName: "Revenue", field: "revenue", flex: 1 },
    { headerName: "Revenue Growth", field: "revenueGrowth", flex: 1 },
    { headerName: "Gross Profit", field: "grossProfit", flex: 1 },
    { headerName: "EBITDA", field: "ebitda", flex: 1 },
    { headerName: "Capex", field: "capex", flex: 1 },
    
  ]);

  // const columnDefs = [
  //   { headerName: "Document", field: "document", flex: 1 },
  //   { headerName: "Date", field: "date", flex: 1 },
  //   { headerName: "Document Type", field: "type", flex: 1 },
  //   { headerName: "Company Name", field: "companyName", flex: 1 },
  //   { headerName: "Company Description", field: "companyDescription", flex: 1 },
  //   { headerName: "Company Business Model", field: "companyBusinessModel", flex: 1 },
  //   { headerName: "Company Industry", field: "companyIndustry", flex: 1 },
  //   { headerName: "List of Management Team", field: "listOfManagementTeam", flex: 1 },
  //   { headerName: "Revenue", field: "revenue", flex: 1 },
  //   { headerName: "Revenue Growth", field: "revenueGrowth", flex: 1 },
  //   { headerName: "Gross Profit", field: "grossProfit", flex: 1 },
  //   { headerName: "EBITDA", field: "ebitda", flex: 1 },
  //   { headerName: "Capex", field: "capex", flex: 1 },
  // ];

  useEffect(() => {
    if (uploads && uploads.length > 0) {
      const updatedRows = uploads.map((upload) => {
        // Create a placeholder row dynamically based on columnDefs
        const placeholderRow: { [key: string]: any } = {};
        console.log('upload', upload);

        columnDefs.forEach((colDef) => {
          const field = colDef.field;
          placeholderRow[field] = upload.loading
            ? "Reading..."
            : upload.results[0]?.[field] || "N/A"; // Use results if available, otherwise "N/A"
        });

        // Add static fields for document and date
        placeholderRow.document = upload.file.name;
        placeholderRow.date = new Date().toLocaleDateString();

        return placeholderRow;
      });

      setRowData(updatedRows);
    }
  }, [uploads, columnDefs]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 10) {
      alert("You can upload a maximum of 10 files.");
      return;
    }

    selectedFiles.forEach((file) => {
      const id = uuidv4();
      // Dispatch the upload action for each file
      dispatch(
        startUpload({
          id,
          file,
          fields,
          columnDefs,
        })
      );
    });
  };

  const handleAddColumn = () => {
    const newColumnName = prompt("Enter the name of the new column:");
    if (newColumnName) {
      const newColumnField = newColumnName.toLowerCase().replace(/ /g, "_"); // Convert to a valid field name
      setColumnDefs((prev) => [
        ...prev,
        {
          headerName: newColumnName,
          field: newColumnField,
          flex: 1,
        },
      ]);

      // Update all rows with an empty value for the new column
      setRowData((prev) =>
        prev.map((row) => ({
          ...row,
          [newColumnField]: "",
        }))
      );
    }
  };

  return (
    <div className="bg-gray-100 w-full p-6">
      <div className="flex justify-between items-center mb-4">
        {/* Logo on the left side */}
        <div className="flex items-center w-40">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 598 119"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M311.285 25.288V93H296.181V25.288H311.285ZM311.285 0.328003V15.048H296.181V0.328003H311.285ZM427.912 34.248C432.947 27.2507 439.901 23.752 448.776 23.752C452.957 23.752 456.797 24.648 460.296 26.44C463.88 28.1467 466.739 30.8773 468.872 34.632C471.091 38.3013 472.2 42.8667 472.2 48.328V93H457.224V52.424C457.224 46.6213 456.029 42.4827 453.64 40.008C451.336 37.448 447.837 36.168 443.144 36.168C440.499 36.168 437.939 37.0213 435.464 38.728C433.075 40.4347 431.112 42.8667 429.576 46.024C428.125 49.1813 427.4 52.8507 427.4 57.032V93H412.296V0.328003H427.4V34.248H427.912ZM525.226 80.584C524.031 80.6693 521.983 80.712 519.082 80.712C516.181 80.712 514.175 80.328 513.066 79.56C511.957 78.7067 511.402 76.8293 511.402 73.928V36.04H525.994V25.288H511.402V6.34399H496.426V25.288H485.418V36.04H496.426V77.896C496.426 81.992 497.066 85.1493 498.346 87.368C499.626 89.5867 501.589 91.1227 504.234 91.976C506.879 92.8293 510.421 93.256 514.858 93.256C519.893 93.256 523.349 93.1707 525.226 93V80.584ZM576.971 37.448C579.702 39.3253 581.494 42.056 582.347 45.64L596.043 43.2079C595.36 39.6239 593.696 36.3386 591.051 33.352C588.491 30.3653 585.163 28.0186 581.067 26.312C576.971 24.6053 572.448 23.752 567.499 23.752C562.294 23.752 557.6 24.6053 553.419 26.312C549.238 28.0186 545.952 30.4079 543.563 33.4799C541.174 36.552 539.979 40.0506 539.979 43.976C539.979 50.4613 541.942 55.1119 545.867 57.9279C549.878 60.7439 555.168 62.664 561.739 63.688L568.779 64.968C573.302 65.6506 576.672 66.632 578.891 67.912C581.195 69.192 582.347 71.1546 582.347 73.8C582.347 76.872 581.024 79.3466 578.379 81.224C575.819 83.016 572.448 83.912 568.267 83.912C563.574 83.912 559.734 82.8453 556.747 80.712C553.76 78.5786 551.798 75.2933 550.859 70.856L537.035 73.416C538.23 79.816 541.558 84.936 547.019 88.776C552.48 92.616 559.478 94.536 568.011 94.536C576.8 94.536 583.926 92.7013 589.387 89.032C594.848 85.3626 597.579 80.1146 597.579 73.2879C597.579 66.632 595.531 61.896 591.435 59.08C587.424 56.264 581.792 54.216 574.539 52.936L567.755 51.784C563.488 51.1013 560.288 50.2053 558.155 49.0959C556.107 47.9866 555.083 46.1946 555.083 43.72C555.083 40.8186 556.192 38.5999 558.411 37.0639C560.715 35.4426 563.744 34.632 567.499 34.632C571.083 34.632 574.24 35.5706 576.971 37.448ZM384.171 110.792C390.059 106.013 393.003 98.4613 393.003 88.136V25.2879H378.795V33.224H378.283C376.406 30.152 373.675 27.8053 370.091 26.184C366.592 24.5626 362.539 23.752 357.931 23.752C352.214 23.752 347.094 25.1173 342.571 27.848C338.048 30.5786 334.507 34.4613 331.947 39.496C329.387 44.4453 328.107 50.1626 328.107 56.6479C328.107 63.1333 329.387 68.8506 331.947 73.8C334.507 78.7493 338.006 82.5893 342.443 85.32C346.966 88.0506 352.086 89.416 357.803 89.416C362.326 89.416 366.251 88.6906 369.579 87.24C372.992 85.7039 375.638 83.6133 377.515 80.968H378.027V87.496C378.027 100.04 372.267 106.312 360.747 106.312C356.224 106.312 352.512 105.331 349.611 103.368C346.795 101.405 344.79 98.248 343.595 93.896L329.003 96.328C331.051 103.752 334.848 109.213 340.395 112.712C346.027 116.296 352.811 118.088 360.747 118.088C370.475 118.088 378.283 115.656 384.171 110.792ZM374.187 72.0079C370.944 75.9333 366.635 77.896 361.259 77.896C355.883 77.896 351.574 75.976 348.331 72.136C345.088 68.2106 343.467 63.048 343.467 56.6479C343.467 50.3333 345.088 45.256 348.331 41.416C351.574 37.576 355.883 35.656 361.259 35.656C366.635 35.656 370.944 37.576 374.187 41.416C377.43 45.256 379.051 50.3333 379.051 56.6479C379.051 62.9626 377.43 68.0826 374.187 72.0079ZM259.621 37.448C262.352 39.3253 264.143 42.056 264.997 45.64L278.693 43.2079C278.01 39.6239 276.346 36.3386 273.701 33.352C271.141 30.3653 267.813 28.0186 263.717 26.312C259.621 24.6053 255.098 23.752 250.149 23.752C244.943 23.752 240.25 24.6053 236.069 26.312C231.887 28.0186 228.602 30.4079 226.213 33.4799C223.823 36.552 222.629 40.0506 222.629 43.976C222.629 50.4613 224.591 55.1119 228.517 57.9279C232.527 60.7439 237.818 62.664 244.389 63.688L251.429 64.968C255.952 65.6506 259.322 66.632 261.541 67.912C263.845 69.192 264.997 71.1546 264.997 73.8C264.997 76.872 263.674 79.3466 261.029 81.224C258.469 83.016 255.098 83.912 250.917 83.912C246.223 83.912 242.383 82.8453 239.397 80.712C236.41 78.5786 234.447 75.2933 233.509 70.856L219.685 73.416C220.879 79.816 224.207 84.936 229.669 88.776C235.13 92.616 242.128 94.536 250.661 94.536C259.45 94.536 266.575 92.7013 272.037 89.032C277.498 85.3626 280.229 80.1146 280.229 73.2879C280.229 66.632 278.181 61.896 274.085 59.08C270.074 56.264 264.442 54.216 257.189 52.936L250.405 51.784C246.138 51.1013 242.938 50.2053 240.805 49.0959C238.757 47.9866 237.733 46.1946 237.733 43.72C237.733 40.8186 238.842 38.5999 241.061 37.0639C243.365 35.4426 246.394 34.632 250.149 34.632C253.733 34.632 256.89 35.5706 259.621 37.448ZM93.6619 35.528H94.1739C96.0513 32.0293 98.6966 29.2133 102.11 27.0799C105.609 24.8613 109.662 23.752 114.27 23.752C116.318 23.752 118.195 23.9653 119.902 24.392V38.728C117.513 38.3866 115.251 38.216 113.118 38.216C100.659 38.216 94.4299 44.7013 94.4299 57.672V93H79.3259V25.2879H93.6619V35.528ZM23.8479 92.104C27.3466 93.7253 31.4426 94.536 36.1359 94.536C41.9386 94.536 47.1012 93.0853 51.6239 90.184C56.2319 87.1973 59.8159 83.0586 62.3759 77.768C65.0212 72.392 66.3439 66.2053 66.3439 59.208C66.3439 52.1253 65.0212 45.9386 62.3759 40.6479C59.8159 35.2719 56.2319 31.1333 51.6239 28.2319C47.1012 25.2453 41.8959 23.752 36.0079 23.752C31.3146 23.752 27.1332 24.648 23.4639 26.4399C19.8799 28.1466 17.1066 30.664 15.1439 33.992H14.6319V25.2879H0.295898V116.552H15.3999V85.192H15.9119C17.7892 88.1786 20.4346 90.4826 23.8479 92.104ZM19.2399 41.9279C22.5679 37.7466 27.0479 35.656 32.6799 35.656C38.3972 35.656 42.8772 37.7466 46.1199 41.9279C49.4479 46.1093 51.1119 51.8693 51.1119 59.208C51.1119 66.5466 49.4479 72.3066 46.1199 76.488C42.8772 80.6693 38.3972 82.76 32.6799 82.76C27.0479 82.76 22.5679 80.6693 19.2399 76.488C15.9972 72.3066 14.3759 66.5466 14.3759 59.208C14.3759 51.8693 15.9972 46.1093 19.2399 41.9279Z"
              fill="currentColor"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M168.5 101C191.42 101 210 82.4198 210 59.5C210 36.5802 191.42 18 168.5 18C145.58 18 127 36.5802 127 59.5C127 72.3496 132.84 83.8353 142.011 91.4476L148.494 76.2202C144.751 71.7384 142.498 65.9685 142.498 59.6724C142.498 45.407 154.063 33.8425 168.328 33.8425C182.593 33.8425 194.158 45.407 194.158 59.6724C194.158 73.9379 182.593 85.5023 168.328 85.5023C165.307 85.5023 162.407 84.9836 159.712 84.0304L142.106 91.5266C149.279 97.4449 158.474 101 168.5 101Z"
              fill="url(#paint0_linear_1704_39)"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear_1704_39"
                x1="168.5"
                y1="18"
                x2="168.5"
                y2="101"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#64A8F0"></stop>
                <stop offset="1" stop-color="#007CFF"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Buttons on the right side */}
        <div className="flex space-x-4 items-center">
          <LabelWithIcon
            htmlFor="file-upload"
            icon={<LuUpload />}
            label="Add Documents"
          />
          <ButtonComponent
            label="Add Column"
            icon={<PiColumnsPlusRightFill />}
            onClick={handleAddColumn}
          />
        </div>

        {/* File Upload Input (hidden) */}
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* AG Grid Container */}
      <div
        className="ag-theme-alpine mt-8"
        style={{ height: 200, width: "100%", backgroundColor: "white" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
};

export default UploadContainer;
