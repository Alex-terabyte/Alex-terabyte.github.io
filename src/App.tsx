import { FC } from 'react';
import {
  CartesianGrid,
  DotProps,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './App.css';
import { data, TData } from './data';

type TProcessedData = {
  zScore: number;
  name: string;
  value: number;
}

const calculateMean = (data: TData[]) => {
  const mean = data.reduce((acc, cur) => acc + cur.value, 0) / data.length;
  return mean;
};

const mean = calculateMean(data)

const calculateStd = (data: TData[]) => {
  const variance =
    data.reduce((acc, cur) => acc + Math.pow(cur.value - mean, 2), 0) / data.length;
  const std = Math.sqrt(variance);
  return std;
};

const std = calculateStd(data);

const processedData = data.map((item) => ({
  ...item,
  zScore: Math.abs((item.value - mean) / std),
}));
console.log(processedData);

const CustomDot: FC<DotProps & { payload: TProcessedData }> = ({ cx, cy, payload }) => {
  const fill = payload.zScore > 1 ? 'red' : 'blue';
  return <circle cx={cx} cy={cy} r={4} fill={fill} stroke={fill} />;
};

const generateStops = (data: TProcessedData[]) => {
  const stops = [];
  for (let i = 0; i < data.length; i++) {
    const color = data[i].zScore > 1 ? 'red' : 'blue';
    const offset = (i / (data.length - 1)) * 100;
    if (i > 0) {
      const prevColor = data[i - 1].zScore > 1 ? 'red' : 'blue';
      if (prevColor !== color) {
        stops.push({ offset: `${offset}%`, color: prevColor });
      }
    }
    stops.push({ offset: `${offset}%`, color });
  }
  return stops;
};

const stops = generateStops(processedData);

export const App = () => {
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '200px' }}>
      <ResponsiveContainer width="100%" height={800}>
        <LineChart data={processedData}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              {stops.map((stop, index) => (
                <stop
                  key={index}
                  offset={stop.offset}
                  stopColor={stop.color}
                />
              ))}
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            dot={({ cx, cy, payload }) => <CustomDot cx={cx} cy={cy} payload={payload} />}
            stroke="url(#lineGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
