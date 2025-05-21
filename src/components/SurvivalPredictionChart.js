import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SurvivalPredictionChart = ({ survivalYears, severityScore, chartRef }) => {
  const data = [
    { name: 'Survival Years', value: survivalYears },
    { name: 'Severity Score (%)', value: severityScore },
  ];

  return (
    <div ref={chartRef}>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#f7ce5d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SurvivalPredictionChart;
