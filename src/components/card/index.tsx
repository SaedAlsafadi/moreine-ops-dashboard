function Card(props: {
  className?: string;
  extra?: string; // Keep extra for backwards compatibility with Horizon template usage
  children?: React.ReactNode;
  [x: string]: any;
}) {
  const { className, extra, children, ...rest } = props;
  return (
    <div
      className={`relative flex flex-col rounded-card bg-surface bg-clip-border shadow-card ${className || ''} ${extra || ''}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
