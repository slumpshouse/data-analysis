import dynamic from "next/dynamic";
import React from "react";

const DataVisualizations = dynamic(() => import("../components/DataVisualizations"), { ssr: false });

export default function DataVisualizationsWrapper() {
  return <DataVisualizations />;
}
