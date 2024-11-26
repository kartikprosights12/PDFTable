// ButtonComponent.jsx
import React from 'react';

const ButtonComponent = ({ label, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 text-sm font-medium text-gray-700"
    >
      {icon && (
        <span className="mr-2">
          {icon}
        </span>
      )}
      {label}
    </button>
  );
};

export default ButtonComponent;
