"use client";

import React from "react";

const ActivationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <main className="min-h-screen container mx-auto py-12 flex flex-col items-center">
        {children}
      </main>
    </div>
  );
};

export default ActivationLayout;
