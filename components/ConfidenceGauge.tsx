import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ConfidenceGaugeProps {
  score: number;
}

const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getColor = (val: number) => {
    if (val >= 80) return '#00ff00'; // Green
    if (val >= 50) return '#ffff00'; // Yellow
    return '#ff0000'; // Red
  };

  return (
    <div className="relative h-28 w-28 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={50}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell key="cell-score" fill={getColor(score)} />
            <Cell key="cell-remaining" fill="#333" /> 
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-arcade text-lg text-white drop-shadow-[2px_2px_0px_black]">{score}%</span>
        <span className="font-arcade text-[8px] text-gray-400">POWER</span>
      </div>
    </div>
  );
};

export default ConfidenceGauge;