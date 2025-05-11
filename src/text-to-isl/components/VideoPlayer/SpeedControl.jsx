import React from "react";

const SpeedControl = ({ currentSpeed, onChange }) => {
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-700">Speed:</span>
      <select
        value={currentSpeed}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        {speeds.map((speedOption) => (
          <option key={speedOption} value={speedOption}>
            {speedOption}x
          </option>
        ))}
      </select>
    </div>
  );
};

export default SpeedControl;
