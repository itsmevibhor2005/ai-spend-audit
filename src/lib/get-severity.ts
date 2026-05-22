export function getSeverity(savings: number) {
  if (savings >= 200) {
    return {
      label: "High Savings",
      color: "bg-red-500",
    };
  }

  if (savings >= 50) {
    return {
      label: "Medium Savings",
      color: "bg-yellow-500",
    };
  }

  return {
    label: "Low Impact",
    color: "bg-green-500",
  };
}
