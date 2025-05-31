import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Cell
} from 'recharts';

const SurvivalPredictionChart = ({ survivalYears, severityScore, chartRef }) => {
  const data = [
    { name: 'Expected Survival (Years)', value: survivalYears },
    { name: 'Severity Score (%)', value: severityScore },
  ];

  const getBarColor = (name) => {
    if (name.includes('Survival')) return '#4caf50'; // green for survival
    if (name.includes('Severity')) return '#f44336'; // red for severity
    return '#1976d2'; // fallback blue
  };

  return (
    <div ref={chartRef} style={{ fontFamily: 'Segoe UI, sans-serif', padding: '1rem' }}>
      <h3 style={{ textAlign: 'center', color: '#0d47a1', marginBottom: '1rem' }}>
        Patient Survival & Severity Metrics
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 40, left: 140, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tick={{ fontSize: 14 }}
            label={{ value: 'Value', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 14, fontWeight: 'bold' }}
            width={140}
          />
          <Tooltip formatter={(value, name) => [`${value}`, name]} />
          <Legend />
          <Bar
            dataKey="value"
            barSize={40}
            fill="#8884d8" // fallback fill (not used because of fill prop below)
          >
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
              ))
            }
            <LabelList
              dataKey="value"
              position="right"
              style={{ fill: '#000', fontWeight: 'bold', fontSize: 14 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '1rem' }}>
        This graph summarizes predicted survival years and severity score based on patient data.
      </p>
    </div>
  );
};

export default SurvivalPredictionChart;
