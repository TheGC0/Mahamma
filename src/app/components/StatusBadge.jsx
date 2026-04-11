import { Badge } from "./ui/badge";

export function StatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return { 
          label: "Open", 
          className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50" 
        };
      case "in_progress":
        return { 
          label: "In Progress", 
          className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50" 
        };
      case "delivered":
        return { 
          label: "Delivered", 
          className: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50" 
        };
      case "completed":
        return { 
          label: "Completed", 
          className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50" 
        };
      case "cancelled":
        return { 
          label: "Cancelled", 
          className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50" 
        };
      case "pending":
        return { 
          label: "Pending", 
          className: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50" 
        };
      default:
        return { 
          label: status || "Unknown", 
          className: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50" 
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
