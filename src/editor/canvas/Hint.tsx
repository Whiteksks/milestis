'use client';

import React from 'react';

export const Hint: React.FC = () => (
  <div
    className="
      absolute -top-3 left-0 right-0 flex justify-center
      pointer-events-none
    "
    aria-hidden
  >
    <div className="w-3/4 h-0.5 bg-accent rounded-full shadow-sm transition-all" />
  </div>
);
