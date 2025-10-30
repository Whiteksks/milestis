"use client";

import React from "react";

export const TestComponentA: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={
        "p-4 bg-blue-500 text-white rounded-md shadow-sm flex items-center justify-center " +
        (className ?? "")
      }
    >
      Test Component A
    </div>
  );
};

export default TestComponentA;
