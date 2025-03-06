'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  useGraphDownloadMonthQuery,
  useGraphDownloadWeekQuery,
} from '@/app/hooks/queries/admin/ecommerce/useEcommerceQuery';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface BarChartProps {
  type: 'Week' | 'Month';
}

interface MonthDataPoint {
  day: string;
  count: number;
}

interface WeekDataPoint {
  x_axis_day: string;
  count: number;
}

const DAY_ORDER = {
  일: 6,
  월: 0,
  화: 1,
  수: 2,
  목: 3,
  금: 4,
  토: 5,
};

const extractMonthDay = (dateString: string): string => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1)
    .toString()
    .padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
};

const BarChart: FC<BarChartProps> = ({ type }) => {
  const { data: graphDownloadMonthData } =
    useGraphDownloadMonthQuery();
  const { data: graphDownloadWeekData } =
    useGraphDownloadWeekQuery();

  const sortedMonthData = graphDownloadMonthData?.data
    ?.list1
    ? [...graphDownloadMonthData.data.list1]
        .map(
          (item: any): MonthDataPoint => ({
            day: item.day, // 원본 날짜 유지 (연도 포함)
            count: item.count,
          }),
        )
        .sort((a, b) => {
          const aDate = new Date(a.day);
          const bDate = new Date(b.day);
          return aDate.getTime() - bDate.getTime();
        })
        .reduce(
          (acc, item) => ({
            days: [...acc.days, extractMonthDay(item.day)], // 월-일만 표시
            counts: [...acc.counts, item.count],
          }),
          { days: [], counts: [] as number[] },
        )
    : { days: [], counts: [] };

  const sortedMonthDataPro = graphDownloadMonthData?.data
    ?.list2
    ? [...graphDownloadMonthData.data.list2]
        .map(
          (item: any): MonthDataPoint => ({
            day: item.day, // 원본 날짜 유지 (연도 포함)
            count: item.count,
          }),
        )
        .sort((a, b) => {
          const aDate = new Date(a.day);
          const bDate = new Date(b.day);
          return aDate.getTime() - bDate.getTime();
        })
        .reduce(
          (acc, item) => ({
            days: [...acc.days, extractMonthDay(item.day)], // 월-일만 표시
            counts: [...acc.counts, item.count],
          }),
          { days: [], counts: [] as number[] },
        )
    : { days: [], counts: [] };

  const sortedWeekData = graphDownloadWeekData?.data?.list1
    ? [...graphDownloadWeekData.data.list1]
        .map(
          (item: any): WeekDataPoint => ({
            x_axis_day: item.x_axis_day,
            count: item.count,
          }),
        )
        .sort((a, b) => {
          // 요일로 정렬
          return (
            DAY_ORDER[b.x_axis_day] -
            DAY_ORDER[a.x_axis_day]
          );
        })
        .reduce(
          (acc, item) => ({
            days: [...acc.days, item.x_axis_day],
            counts: [...acc.counts, item.count],
          }),
          { days: [], counts: [] as number[] },
        )
    : { days: [], counts: [] };

  const sortedWeekDataPro = graphDownloadWeekData?.data
    ?.list2
    ? [...graphDownloadWeekData.data.list2]
        .map(
          (item: any): WeekDataPoint => ({
            x_axis_day: item.x_axis_day,
            count: item.count,
          }),
        )
        .sort((a, b) => {
          // 요일로 정렬
          return (
            DAY_ORDER[b.x_axis_day] -
            DAY_ORDER[a.x_axis_day]
          );
        })
        .reduce(
          (acc, item) => ({
            days: [...acc.days, item.x_axis_day],
            counts: [...acc.counts, item.count],
          }),
          { days: [], counts: [] as number[] },
        )
    : { days: [], counts: [] };

  const currentData =
    type === 'Week'
      ? { normal: sortedWeekData, pro: sortedWeekDataPro }
      : {
          normal: sortedMonthData,
          pro: sortedMonthDataPro,
        };

  const combinedDays = Array.from(
    new Set([
      ...currentData.normal.days,
      ...currentData.pro.days,
    ]),
  ).sort((a, b) => {
    if (type === 'Week') {
      return DAY_ORDER[a] - DAY_ORDER[b];
    }

    const dateA = new Date(a);
    const dateB = new Date(b);

    const yearMonthA =
      dateA.getFullYear() * 100 + (dateA.getMonth() + 1);
    const yearMonthB =
      dateB.getFullYear() * 100 + (dateB.getMonth() + 1);

    if (yearMonthA !== yearMonthB) {
      return yearMonthB - yearMonthA;
    }

    return dateA.getDate() - dateB.getDate();
  });

  const chartData = {
    labels: combinedDays,
    datasets: [
      {
        label: 'Free',
        data: combinedDays.map((day) => {
          const index =
            currentData.normal.days.indexOf(day);
          return index !== -1
            ? currentData.normal.counts[index]
            : null;
        }),
        backgroundColor: '#48BED9',
        borderRadius: 0,
      },
      {
        label: 'Pro',
        data: combinedDays.map((day) => {
          const index = currentData.pro.days.indexOf(day);
          return index !== -1
            ? currentData.pro.counts[index]
            : null;
        }),
        backgroundColor: '#012840',
        borderRadius: 0,
      },
    ],
  };

  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 50,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          display: true,
        },
        ticks: {
          stepSize: 10,
          callback: (value: number) =>
            value.toLocaleString(),
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          display: true,
        },
      },
    },
  };

  const mergedOptions = {
    ...defaultOptions,
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={mergedOptions} />
    </div>
  );
};

export default BarChart;
