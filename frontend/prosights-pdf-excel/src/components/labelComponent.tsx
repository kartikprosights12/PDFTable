import React from 'react';

const LabelWithIcon = ({ label, htmlFor, icon }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 text-sm font-medium text-gray-700 cursor-pointer"
    >
      {icon && (
        <span className="mr-2">
          {icon}
        </span>
      )}
      {label}
    </label>
  );
};

export default LabelWithIcon;
