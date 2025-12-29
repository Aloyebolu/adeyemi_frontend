export const variantStyles = {
  default: {
    wrapper: "bg-surface",
    table: "border border-border",
    header: "bg-surfaceElevated",
    row: "hover:bg-surfaceElevated",
  },
  striped: {
    wrapper: "bg-white",
    table: "border border-gray-200",
    header: "bg-gray-100",
    row: "even:bg-gray-50 hover:bg-gray-100",
  },
  borderless: {
    wrapper: "bg-transparent",
    table: "border-0 shadow-none",
    header: "bg-transparent font-semibold",
    row: "hover:bg-gray-50",
  },
  compact: {
    wrapper: "bg-surface text-xs",
    table: "border border-border",
    header: "bg-surfaceElevated py-1",
    row: "py-1 hover:bg-surfaceElevated",
  },
  dark: {
    wrapper: "bg-gray-900 text-white",
    table: "border border-gray-700",
    header: "bg-gray-800 text-gray-100",
    row: "hover:bg-gray-800",
  },
  corporate: {
    wrapper: "bg-white",
    table: "border border-gray-300 shadow-sm rounded-lg",
    header: "bg-blue-50 text-blue-900",
    row: "hover:bg-blue-50",
  },
  // ... other variants (keep them static)
} as const;

export const NUMBERING_TYPES = {
  "1": (n: number) => n.toString(),
  "(1)": (n: number) => `(${n})`,
  "{1}": (n: number) => `{${n}}`,
  "a": (n: number) => String.fromCharCode(96 + n),
  "A": (n: number) => String.fromCharCode(64 + n),
  "i": (n: number) => toRoman(n).toLowerCase(),
  "I": (n: number) => toRoman(n),
};

const ROMAN_NUMERALS: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

export const toRoman = (num: number): string => {
  let result = "";
  let remaining = num;
  
  for (const [value, symbol] of ROMAN_NUMERALS) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
};