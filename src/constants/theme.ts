export const CBEColors = {
  // Pantone 1255 C - Gold
  gold: "#B38D32",
  gold50: "#fdf8ed",
  gold100: "#f9eccc",
  gold200: "#f4d793",
  gold300: "#eebd5b",
  gold400: "#b38d32",
  gold500: "#b38d32",

  // Pantone 513 C - Purple
  purple: "#95298E",
  purple50A: "#fbf6fd",
  purple50: "#fcf5fe",
  purple100A: "#efd4f8",
  purple100: "#f9eafd",
  purple200A: "#efb8f1",
  purple200: "#f2d4fa",
  purple300A: "#d39de7",
  purple300: "#ebb3f4",
  purple400A: "#d18fe3",
  purple400: "#e085ed",
  purple500A: "#ba64d1",
  purple500: "#ce57de",
  purple600A: "#9f44b5",
  purple600: "#b437c2",
  purple700A: "#7c328b",
  purple700: "#972aa1",
  purple800A: "#6f2e7a",
  purple800: "#95298e",
  purple900A: "#95298e",
  purple900: "#69236c",

  black: "#000000",
  white: "#FFFFFF",
  purpleTints: {
    tint1: "rgba(149, 41, 142, 0.9)",
    tint2: "rgba(149, 41, 142, 0.7)",
    tint3: "rgba(149, 41, 142, 0.5)",
    tint4: "rgba(149, 41, 142, 0.3)",
  }
} as const;

export const StatusColors = {
  Cancelled: "#e74c3c",      // Red
  OnQueue: "#f39c12",        // Orange
  OnProgress: "#3498db",      // Blue
  Completed: "#27ae60",       // Green
  OnHold: "#9b59b6",          // Purple
  Discrepancy: "#e67e22",     // Dark Orange
  Reapplied: "#16a085",       // Teal
} as const;

export const ButtonColors = {
  primary: CBEColors.purple,
  primaryHover: CBEColors.purpleTints.tint1,
  secondary: CBEColors.gold,
  secondaryHover: "#C49D42",
  success: "#27ae60",
  successHover: "#2ecc71",
  danger: "#e74c3c",
  dangerHover: "#c0392b",
  warning: "#f39c12",
  warningHover: "#e67e22",
  info: "#3498db",
  infoHover: "#2980b9",
} as const;
