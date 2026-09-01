import {
  MdArrowDropUp,
  MdOutlineCalendarToday,
  MdBarChart,
} from 'react-icons/md';
import Card from 'components/card';
import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from 'variables/charts';
import LineChart from 'components/charts/LineChart';

const TotalSpent = () => {
  return (
    <Card extra="!p-[20px] text-center">
      <div className="flex justify-between">
        <button className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-background p-2 text-text-secondary transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-border dark:hover:opacity-90 dark:active:opacity-80">
          <MdOutlineCalendarToday />
          <span className="text-sm font-medium text-text-secondary">This month</span>
        </button>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-background p-2 text-accent !transition !duration-200 hover:bg-gray-100 active:bg-border dark:hover:bg-surface/20 dark:active:bg-surface/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="flex flex-col">
          <p className="mt-[20px] text-3xl font-bold text-text-primary">
            $37.5K
          </p>
          <div className="flex flex-col items-start">
            <p className="mt-2 text-sm text-text-secondary">Total Spent</p>
            <div className="flex flex-row items-center justify-center">
              <MdArrowDropUp className="font-medium text-green-500" />
              <p className="text-sm font-bold text-green-500"> +2.45% </p>
            </div>
          </div>
        </div>
        <div className="h-full w-full">
          <LineChart
            chartOptions={lineChartOptionsTotalSpent}
            chartData={lineChartDataTotalSpent}
          />
        </div>
      </div>
    </Card>
  );
};

export default TotalSpent;
