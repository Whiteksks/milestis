"use client";

import React from "react";

export const ImageBlock: React.FC = () => {
  return (
    <div className="p-2 bg-gray-100 rounded-lg shadow">
      <img
        src="https://placekitten.com/400/200"
        alt="demo"
        className="rounded-lg w-full h-auto object-cover"
      />
    </div>
  );
};
