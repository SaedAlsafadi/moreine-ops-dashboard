import Card from "components/card";

const General = () => {
  return (
    <Card extra={"w-full h-full p-3"}>
      {/* Header */}
      <div className="mt-2 mb-8 w-full">
        <h4 className="px-2 text-xl font-bold text-text-primary">
          General Information
        </h4>
        <p className="mt-2 px-2 text-base text-text-secondary">
          As we live, our hearts turn colder. Cause pain is what we go through
          as we become older. We get insulted by others, lose trust for those
          others. We get back stabbed by friends. It becomes harder for us to
          give others a hand. We get our heart broken by people we love, even
          that we give them all...
        </p>
      </div>
      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="flex flex-col items-start justify-center rounded-2xl bg-surface bg-clip-border px-3 py-4">
          <p className="text-sm text-text-secondary">Education</p>
          <p className="text-base font-medium text-text-primary">
            Stanford University
          </p>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-surface bg-clip-border px-3 py-4">
          <p className="text-sm text-text-secondary">Languages</p>
          <p className="text-base font-medium text-text-primary">
            English, Spanish, Italian
          </p>
        </div>

        <div className="flex flex-col items-start justify-center rounded-2xl bg-surface bg-clip-border px-3 py-4">
          <p className="text-sm text-text-secondary">Department</p>
          <p className="text-base font-medium text-text-primary">
            Product Design
          </p>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-surface bg-clip-border px-3 py-4 shadow-card">
          <p className="text-sm text-text-secondary">Work History</p>
          <p className="text-base font-medium text-text-primary">
            English, Spanish, Italian
          </p>
        </div>

        <div className="flex flex-col items-start justify-center rounded-2xl bg-surface bg-clip-border px-3 py-4 shadow-card">
          <p className="text-sm text-text-secondary">Organization</p>
          <p className="text-base font-medium text-text-primary">
            Simmmple Web LLC
          </p>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-surface bg-clip-border px-3 py-4 shadow-card">
          <p className="text-sm text-text-secondary">Birthday</p>
          <p className="text-base font-medium text-text-primary">
            20 July 1986
          </p>
        </div>
      </div>
    </Card>
  );
};

export default General;
