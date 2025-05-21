// CancerResultChart.js
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';


const CancerResultChart = ({ probability, chartRef }) => {
  const benignProb = 1 - probability;
  const data = [
    { name: 'Malignant', value: probability },
    { name: 'Benign', value: benignProb },
  ];
  const COLORS = ['#FF4C4C', '#4CAF50'];

  return (
    <div ref={chartRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <h4 style={{ fontSize: '28px', marginBottom: '10px' }}>Probability Breakdown of Cancer Diagnosis</h4>
      <p style={{ fontSize: '18px', color: '#555' }}>
        <em>The chart below shows the probability of the cancer being benign or malignant.</em>
      </p>
      <PieChart width={800} height={600}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={150}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};


export default CancerResultChart;
