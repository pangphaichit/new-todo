import type { TaskType } from "./task-types";

export const TASK_TYPE_CONFIG: Record<
  TaskType,
  {
    label: string;
    icon: string;
    background: string;
    textColor: string;
  }
> = {
  deep: {
    label: "Deep Tasks",
    icon: "brain",
    background: "#EDE9FE", // soft purple
    textColor: "#5B21B6",
  },
  easy: {
    label: "Easy Tasks",
    icon: "sparkles",
    background: "#ECFEFF", // soft cyan
    textColor: "#0F766E",
  },
};
