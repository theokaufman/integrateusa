import React from "react";

interface Props {
  children: React.ReactNode[];
}

export default function Info({ children }: Props) {
  return (
    <div className="bg-white p-3 border border-solid border-black rounded-sm z-50 mb-10 w-full md:w-1/2 lg:w-1/3">
      {children}
    </div>
  );
}
