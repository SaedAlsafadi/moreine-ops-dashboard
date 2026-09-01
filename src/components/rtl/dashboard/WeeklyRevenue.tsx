import Card from 'components/card';
import BarChart from 'components/charts/BarChart';
import {
  barChartDataWeeklyRevenue,
  barChartOptionsWeeklyRevenue,
} from 'variables/charts';
import { MdBarChart } from 'react-icons/md';

const WeeklyRevenue = () => {
  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-text-primary">
          Weekly Revenue
        </h2>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-background p-2 text-accent !transition !duration-200 hover:bg-gray-100 active:bg-border dark:hover:bg-surface/20 dark:active:bg-surface/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="md:mt-16 lg:mt-0">
        <div className="h-[250px] w-full xl:h-[350px]">
          <BarChart
            chartData={barChartDataWeeklyRevenue}
            chartOptions={barChartOptionsWeeklyRevenue}
          />
        </div>
      </div>
    </Card>
  );
};

export default WeeklyRevenue;
