import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const CancerResultChart = ({ probability }) => {
  const benignProb = 1 - probability;
  const data = [
    { name: 'Malignant', value: probability },
    { name: 'Benign', value: benignProb },
  ];

  const COLORS = ['#FF4C4C', '#4CAF50']; // red for malignant, green for benign

  return (
    <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    textAlign: 'center',
  }}
>
  <h4>Probability Breakdown of Cancer Diagnosis</h4>
  <p><em>The chart below shows the probability of the cancer being benign or malignant.</em></p>

  <PieChart width={650} height={500}>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      innerRadius={50}
      outerRadius={90}
      fill="#8884d8"
      paddingAngle={2}
      dataKey="value"
      label={({ name, percent }) =>
        `${name}: ${(percent * 100).toFixed(1)}%`
      }
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
