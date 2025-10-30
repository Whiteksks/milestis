"use client";

import React from "react";

export const TestComponentB: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={
        "p-4 bg-green-500 text-white rounded-md shadow-sm flex items-center justify-center " +
        (className ?? "")
      }
    >
      Test Component B
    </div>
  );
};

export default TestComponentB;
