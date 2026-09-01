import { Tooltip } from "@chakra-ui/tooltip";
const TooltipHorizon = (props: {
  extra: string;
  trigger: JSX.Element;
  content: JSX.Element;
  placement: "left" | "right" | "top" | "bottom";
}) => {
  const { extra, trigger, content, placement } = props;
  return (
    <Tooltip
      placement={placement}
      label={content}
      className={`w-max rounded-xl bg-surface py-3 px-4 text-sm shadow-xl ${extra}`}
    >
      {trigger}
    </Tooltip>
  );
};

export default TooltipHorizon;
