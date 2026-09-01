import Card from "components/card";
import React from 'react';

const Widget = (props: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => {
  const { icon, title, subtitle } = props;
  return (
    <Card extra="flex-row flex-grow items-center p-4">
      <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-background">
        <span className="flex items-center text-accent text-2xl">
          {icon}
        </span>
      </div>

      <div className="ms-4 flex flex-col justify-center">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <h4 className="text-xl font-bold text-text-primary">
          {subtitle}
        </h4>
      </div>
    </Card>
  );
};

export default Widget;
