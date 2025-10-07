import { subDays, format, subMinutes } from 'date-fns';
import { PlatformMetrics, TimeSeriesDataPoint, ChartData, Metric, Platform, RegionalMetric, TriggeredAlert } from '@shared/types';
const generateTimeSeriesData = (days: number, minY: number, maxY: number): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    data.push({
      time: format(date, 'MMM dd'),
      value: Math.random() * (maxY - minY) + minY,
    });
  }
  return data;
};
const generateChartData = (): ChartData => ({
  '24H': generateTimeSeriesData(24, 1000, 5000).map((d, i) => ({ ...d, time: `${i}:00` })),
  '7D': generateTimeSeriesData(7, 5000, 20000),
  '30D': generateTimeSeriesData(30, 20000, 100000),
});
const createMetric = (label: string, valuePrefix: string, valueSuffix: string, min: number, max: number, fractionDigits = 2): Metric => {
  const value = Math.random() * (max - min) + min;
  const change = (Math.random() * 10 - 5);
  return {
    label,
    value: `${valuePrefix}${value.toLocaleString('en-US', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}${valueSuffix}`,
    change: `${change.toFixed(2)}%`,
    changeType: change >= 0 ? 'increase' : 'decrease',
    data: generateTimeSeriesData(30, value * 0.8, value * 1.2),
  };
};
const platformDetails: Record<Platform, { symbol: string; speed: [number, number]; fee: [number, number]; etf: [number, number] }> = {
  Solana: { symbol: 'SOL', speed: [400, 800], fee: [0.0001, 0.0005], etf: [150, 250] },
  Ethereum: { symbol: 'ETH', speed: [12000, 15000], fee: [2.5, 5.0], etf: [3000, 4000] },
  BSC: { symbol: 'BNB', speed: [3000, 5000], fee: [0.1, 0.3], etf: [500, 700] },
};
export const generateMockMetrics = (platform: Platform): PlatformMetrics => {
  const details = platformDetails[platform];
  return {
    paymentVolume: createMetric('Cross-Border Volume', '$', 'B', 50, 150),
    transactionSpeed: createMetric('Avg. Txn Speed', '', 'ms', details.speed[0], details.speed[1], 0),
    gasFees: createMetric('Avg. Gas Fee', '$', '', details.fee[0], details.fee[1], 4),
    etfPrice: createMetric(`${details.symbol} ETF Price`, '$', '', details.etf[0], details.etf[1]),
    crossBorderVolume: generateChartData(),
    gasFeeTrend: generateChartData(),
  };
};
const countries = [
  { code: 'US', name: 'United States' }, { code: 'CA', name: 'Canada' }, { code: 'MX', name: 'Mexico' },
  { code: 'BR', name: 'Brazil' }, { code: 'AR', name: 'Argentina' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' }, { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' }, { code: 'JP', name: 'Japan' }, { code: 'AU', name: 'Australia' },
  { code: 'ZA', name: 'South Africa' }, { code: 'NG', name: 'Nigeria' }, { code: 'EG', name: 'Egypt' },
  { code: 'RU', name: 'Russia' }, { code: 'KR', name: 'South Korea' }, { code: 'SG', name: 'Singapore' }
];
export const generateRegionalMockData = (): RegionalMetric[] => {
  return countries.map(country => ({
    countryCode: country.code,
    countryName: country.name,
    paymentVolume: Math.random() * 1e9 + 5e7, // 50M to 1.05B
    transactionSpeed: Math.random() * 5000 + 400, // 400ms to 5400ms
    gasFee: Math.random() * 2 + 0.01, // $0.01 to $2.01
  }));
};
export const generateTriggeredAlerts = (): TriggeredAlert[] => {
  const now = new Date();
  return [
    {
      id: 't1',
      platform: 'Ethereum',
      metric: 'gasFees',
      message: 'Gas fees are above $5.00, currently at $5.12.',
      timestamp: subMinutes(now, 5).toISOString(),
    },
    {
      id: 't2',
      platform: 'Solana',
      metric: 'etfPrice',
      message: 'ETF price dropped below $150, currently at $148.76.',
      timestamp: subMinutes(now, 22).toISOString(),
    },
    {
      id: 't3',
      platform: 'BSC',
      metric: 'transactionSpeed',
      message: 'Transaction speed is above 5000ms, currently at 5123ms.',
      timestamp: subMinutes(now, 58).toISOString(),
    },
  ];
};