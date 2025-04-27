import React from "react";

const Loading = () => {
  return (
    <div className="col-span-full min-h-[300px] flex flex-col gap-6 justify-center items-center h-64">
      <p>Fetching Data</p>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default Loading;
