import BarChart from 'components/charts/BarChart';
import { barChartDataDailyTraffic } from 'variables/charts';
import { barChartOptionsDailyTraffic } from 'variables/charts';
import { MdArrowDropUp } from 'react-icons/md';
import Card from 'components/card';
const DailyTraffic = () => {
  return (
    <Card extra="pb-7 p-[20px]">
      <div className="flex flex-row justify-between">
        <div className="ms-1 pt-2">
          <p className="text-sm font-medium leading-4 text-text-secondary">
            Daily Traffic
          </p>
          <p className="text-[34px] font-bold text-text-primary">
            2.579{' '}
            <span className="text-sm font-medium leading-6 text-text-secondary">
              Visitors
            </span>
          </p>
        </div>
        <div className="mt-2 flex items-start">
          <div className="flex items-center text-sm text-green-500">
            <MdArrowDropUp className="h-5 w-5" />
            <p className="font-bold"> +2.45% </p>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full pb-0 pt-10">
        <BarChart
          chartData={barChartDataDailyTraffic}
          chartOptions={barChartOptionsDailyTraffic}
        />
      </div>
    </Card>
  );
};

export default DailyTraffic;
