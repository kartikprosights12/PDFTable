import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ContentLoader from "react-content-loader";
import { RootState } from "../redux/Store";

const DataTable: React.FC = () => {
  const results = useSelector((state: RootState) => state.upload.results);
  const isFetching = useSelector((state: RootState) => state.upload.loading);
  const capitalizeHeader = (key: string): string =>
    key
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const columnDefs = useMemo(() => {
    const excludedFields = ["completion_time", "file_name", "input_tokens", "output_tokens", "page_content", "content_length"];
    console.log('results', results);
    if (!Array.isArray(results) || results.length === 0) return [];
    return Object.keys(results[0])
      .filter((key) => !excludedFields.includes(key)) // Exclude specific fields
      .map((key) => ({
        headerName: capitalizeHeader(key),
        field: key,
        sortable: true,
        filter: true,
      }));
  }, [results]);

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      {isFetching ? (
        <ContentLoader
          speed={2}
          width="100%"
          height={500}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="5" ry="5" width="100%" height="20" />
          <rect x="0" y="30" rx="5" ry="5" width="100%" height="20" />
          <rect x="0" y="60" rx="5" ry="5" width="100%" height="20" />
          <rect x="0" y="90" rx="5" ry="5" width="100%" height="20" />
          <rect x="0" y="120" rx="5" ry="5" width="100%" height="20" />
        </ContentLoader>
      ) : results.length === 0 ? (
        <p>No data to display. Upload a file to see results.</p>
      ) : (
        <AgGridReact
          rowData={results}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
        />
      )}
    </div>
  );
};

export default DataTable;
