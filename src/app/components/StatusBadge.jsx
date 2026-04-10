import { Badge } from "./ui/badge";

export function StatusBadge({ status }) {
  const config = {
    open: {
      label: "Open",
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    },
    delivered: {
      label: "Delivered",
      className: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    },
    completed: {
      label: "Completed",
      className: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-700 hover:bg-red-100",
    },
  };

  const { label, className } = config[status];

  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}
