import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const PriceChart = ({ flights }) => {
  const chartData = useMemo(() => {
    if (!flights || flights.length === 0) return [];

    
    const ranges = [
      { min: 0, max: 200, label: '$0-200' },
      { min: 200, max: 400, label: '$200-400' },
      { min: 400, max: 600, label: '$400-600' },
      { min: 600, max: 800, label: '$600-800' },
      { min: 800, max: 1000, label: '$800-1000' },
      { min: 1000, max: Infinity, label: '$1000+' },
    ];

    const data = ranges.map(range => {
      const count = flights.filter(flight => {
        const price = parseFloat(flight.price.total);
        return price >= range.min && price < range.max;
      }).length;

      return {
        range: range.label,
        count: count,
        price: range.min,
      };
    });

    return data.filter(d => d.count > 0);
  }, [flights]);

  if (chartData.length === 0) {
    return null;
  }

  const maxCount = Math.max(...chartData.map(d => d.count));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-card p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {payload[0].payload.range}
          </p>
          <p className="text-sm text-primary-600 font-medium">
            {payload[0].value} flight{payload[0].value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
          <TrendingUp className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-gray-100">
            Price Distribution
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Number of flights in each price range
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis 
            dataKey="range" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {chartData.map((entry, index) => {
              const intensity = (entry.count / maxCount);
              const colors = [
                'rgba(14, 165, 233, 0.3)',
                'rgba(14, 165, 233, 0.5)',
                'rgba(14, 165, 233, 0.7)',
                'rgba(14, 165, 233, 0.9)',
                'rgba(14, 165, 233, 1)',
              ];
              const colorIndex = Math.min(Math.floor(intensity * colors.length), colors.length - 1);
              return <Cell key={`cell-${index}`} fill={colors[colorIndex]} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-primary-600">
            {flights.length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Flights</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600">
            ${Math.min(...flights.map(f => parseFloat(f.price.total))).toFixed(0)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Lowest Price</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-600">
            ${(flights.reduce((sum, f) => sum + parseFloat(f.price.total), 0) / flights.length).toFixed(0)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Average Price</p>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;