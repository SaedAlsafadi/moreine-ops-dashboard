import { MdFileUpload } from "react-icons/md";
import Card from "components/card";

const Upload = () => {
  return (
    <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-surface bg-clip-border p-3 font-dm shadow-card 2xl:grid-cols-11">
      <div className="col-span-5 h-full w-full rounded-xl bg-background 2xl:col-span-6">
        <button className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-border py-3 dark:!border-navy-700 lg:pb-0">
          <MdFileUpload className="text-[80px] text-accent" />
          <h4 className="text-xl font-bold text-accent">
            Upload Files
          </h4>
          <p className="mt-2 text-sm font-medium text-text-secondary">
            PNG, JPG and GIF files are allowed
          </p>
        </button>
      </div>

      <div className="col-span-5 flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-surface pl-3 pb-4">
        <h4 className="text-left text-xl font-bold leading-9 text-text-primary">
          Complete Your Profile
        </h4>
        <p className="leading-1 mt-2 text-base font-normal text-text-secondary">
          Stay on the pulse of distributed projects with an anline whiteboard to
          plan, coordinate and discuss
        </p>
        <button className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-2 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200">
          Publish now
        </button>
      </div>
    </Card>
  );
};

export default Upload;
