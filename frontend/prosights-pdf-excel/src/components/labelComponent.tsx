import React from 'react';

interface LabelWithIconProps {
  label: string; // Label is a string
  htmlFor: string; // HTML element ID this label is associated with
  icon?: React.ReactNode; // Optional icon prop for a React element
}
const LabelWithIcon: React.FC<LabelWithIconProps> = ({ label, htmlFor, icon }) => {
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
