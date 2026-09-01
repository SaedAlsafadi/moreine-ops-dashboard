import CardMenu from "components/card/CardMenu";
import Checkbox from "components/checkbox";
import { MdDragIndicator, MdCheckCircle } from "react-icons/md";
import Card from "components/card";

const TaskCard = () => {
  return (
    <Card extra="pb-7 p-[20px]">
      {/* task header */}
      <div className="relative flex flex-row justify-between">
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-100 dark:bg-surface/5">
            <MdCheckCircle className="h-6 w-6 text-accent" />
          </div>
          <h4 className="ml-4 text-xl font-bold text-text-primary">
            Tasks
          </h4>
        </div>
        <CardMenu />
      </div>

      {/* task content */}

      <div className="h-full w-full">
        <div className="mt-5 flex items-center justify-between p-2">
          <div className="flex items-center justify-center gap-2">
            <Checkbox />
            <p className="text-base font-bold text-text-primary">
              Landing Page Design
            </p>
          </div>
          <div>
            <MdDragIndicator className="h-6 w-6 text-text-primary" />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between p-2">
          <div className="flex items-center justify-center gap-2">
            <Checkbox />
            <p className="text-base font-bold text-text-primary">
              Mobile App Design
            </p>
          </div>
          <div>
            <MdDragIndicator className="h-6 w-6 text-text-primary" />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between p-2">
          <div className="flex items-center justify-center gap-2">
            <Checkbox />
            <p className="text-base font-bold text-text-primary">
              Dashboard Builder
            </p>
          </div>
          <div>
            <MdDragIndicator className="h-6 w-6 text-text-primary" />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between p-2">
          <div className="flex items-center justify-center gap-2">
            <Checkbox />
            <p className="text-base font-bold text-text-primary">
              Landing Page Design
            </p>
          </div>
          <div>
            <MdDragIndicator className="h-6 w-6 text-text-primary" />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between p-2">
          <div className="flex items-center justify-center gap-2">
            <Checkbox />
            <p className="text-base font-bold text-text-primary">
              Dashboard Builder
            </p>
          </div>
          <div>
            <MdDragIndicator className="h-6 w-6 text-text-primary" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
