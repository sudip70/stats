import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  data: { year: number; share: number }[];
  currentYear: number;
  height?: number;
}

export function HistoryChart({ data, currentYear, height = 150 }: Props) {
  if (data.length < 2) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
        <XAxis
          dataKey="year"
          tick={{
            fill: 'rgba(226,232,240,0.55)',
            fontSize: 8,
            fontFamily: 'var(--font-mono)',
          }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{
            fill: 'rgba(226,232,240,0.55)',
            fontSize: 8,
            fontFamily: 'var(--font-mono)',
          }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => v.toFixed(1)}
        />
        <ReferenceLine
          x={currentYear}
          stroke="rgba(34,197,94,0.35)"
          strokeDasharray="3 3"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(6,12,20,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: '#e2e8f0',
          }}
          itemStyle={{ color: '#4ade80' }}
          labelStyle={{ color: 'rgba(226,232,240,0.55)' }}
          formatter={(value: number) => [`${value.toFixed(4)}%`, 'Share']}
        />
        <Line
          type="monotone"
          dataKey="share"
          stroke="#22c55e"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: '#4ade80' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
