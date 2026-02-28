import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComplexityChart = ({ data }) => {
  return (
    <div style={{ width: '100%', height: '300px', background: '#161b22', padding: '20px', borderRadius: '12px' }}>
      <h4 style={{ color: '#58a6ff', textAlign: 'center', margin: '0 0 10px 0' }}>Performance Analysis (ns)</h4>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="discs" stroke="#8b949e" label={{ value: 'Disks', position: 'insideBottom', offset: -5 }} />
          <YAxis stroke="#8b949e" />
          <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }} />
          <Legend verticalAlign="top" height={36}/>
          <Line type="monotone" dataKey="recursiveNanoseconds" stroke="#bc8cff" name="Recursive" strokeWidth={3} dot={{ r: 6 }} />
          <Line type="monotone" dataKey="iterativeNanoseconds" stroke="#7ee787" name="Iterative" strokeWidth={3} dot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComplexityChart;