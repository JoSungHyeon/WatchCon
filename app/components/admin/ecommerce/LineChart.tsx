'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { FC } from 'react';
import { Line } from 'react-chartjs-2';
import {
  useGraphConnectionMonthQuery,
  useGraphConnectionWeekQuery,
} from '@/app/hooks/queries/admin/ecommerce/useEcommerceQuery';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface LineChartProps {
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

// 요일 순서 맵핑을 위한 상수 수정 (일요일부터 시작)
const DAY_ORDER = {
  일: 6,
  월: 0,
  화: 1,
  수: 2,
  목: 3,
  금: 4,
  토: 5,
};

// 날짜에서 월-일만 추출하는 함수
const extractMonthDay = (dateString: string): string => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1)
    .toString()
    .padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
};

const LineChart: FC<LineChartProps> = ({ type }) => {
  const { data: connectionMonthData } =
    useGraphConnectionMonthQuery();
  const { data: connectionWeekData } =
    useGraphConnectionWeekQuery();

  const sortedMonthData = connectionMonthData?.data?.list1
    ? [...connectionMonthData.data.list1]
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

  const sortedMonthDataPro = connectionMonthData?.data
    ?.list2
    ? [...connectionMonthData.data.list2]
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

  // 주간 데이터 정렬 로직 수정
  const sortedWeekData = connectionWeekData?.data?.list1
    ? [...connectionWeekData.data.list1]
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

  const sortedWeekDataPro = connectionWeekData?.data?.list2
    ? [...connectionWeekData.data.list2]
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

  // type에 따라 데이터 선택
  const currentData =
    type === 'Week'
      ? { normal: sortedWeekData, pro: sortedWeekDataPro }
      : {
          normal: sortedMonthData,
          pro: sortedMonthDataPro,
        };

  // combinedDays 정렬 로직 수정
  const combinedDays = Array.from(
    new Set([
      ...currentData.normal.days,
      ...currentData.pro.days,
    ]),
  ).sort((a, b) => {
    // a, b 순서로 되돌리고
    if (type === 'Week') {
      return DAY_ORDER[a] - DAY_ORDER[b];
    }

    const dateA = new Date(a);
    const dateB = new Date(b);

    // 연도와 월을 하나의 숫자로 변환 (YYYYMM)
    const yearMonthA =
      dateA.getFullYear() * 100 + (dateA.getMonth() + 1);
    const yearMonthB =
      dateB.getFullYear() * 100 + (dateB.getMonth() + 1);

    // 연도와 월이 다르면 그걸로 정렬
    if (yearMonthA !== yearMonthB) {
      return yearMonthB - yearMonthA; // 내림차순 (최근 연월이 앞으로)
    }

    // 같은 연월일 경우 일자는 오름차순
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
        borderColor: '#48BED9',
        backgroundColor: 'rgba(39, 242, 242, 0.4)',
        tension: 0,
        fill: 'start',
      },
      {
        label: 'Pro',
        data: combinedDays.map((day) => {
          const index = currentData.pro.days.indexOf(day);
          return index !== -1
            ? currentData.pro.counts[index]
            : null;
        }),
        borderColor: 'rgba(13, 104, 140, 0.8)',
        backgroundColor: 'rgba(84, 144, 181, 0.4)',
        tension: 0,
        fill: 'start',
      },
    ],
  };

  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
        align: 'end',
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
      filler: {
        propagate: true,
      },
    },
    elements: {
      line: {
        fill: true,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 300,
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

  return <Line data={chartData} options={mergedOptions} />;
};

export default LineChart;
