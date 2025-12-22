/**
 * Academic semester name formatter
 *
 * FORMAT LOGIC:
 * 1AA → FIRST
 * 2AA → FIRST SEMESTER
 * 2Aa → First Semester (default)
 *
 * Optional session:
 * formatSemesterName("first", "2Aa", "2020/2023")
 * → "First Semester (2020/2023)"
 */

export type SemesterName = "first" | "second" | "summer";
export type SemesterFormat = "1AA" | "1Aa" | "2AA" | "2Aa";

export const formatSemesterName = (
  semester: SemesterName | string,
  format: SemesterFormat = "2Aa",
  session?: string
): string => {
  if (!semester || typeof semester !== "string") return "";

  const cleanSemester = semester.toLowerCase();

  let baseName: string;

  switch (cleanSemester) {
    case "first":
      baseName = "first";
      break;
    case "second":
      baseName = "second";
      break;
    case "summer":
      baseName = "summer";
      break;
    default:
      // Fail-safe for unexpected values
      return semester;
  }

  const level = format.charAt(0);
  const caseType = format.slice(1);

  let result = baseName;

  // LEVEL handling
  if (level === "2") {
    result = `${baseName} semester`;
  }

  // CASE handling
  if (caseType === "AA") {
    result = result.toUpperCase();
  } else if (caseType === "Aa") {
    result = result
      .split(" ")
      .map(
        word => word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  }

  // OPTIONAL SESSION (do nothing if not provided)
  if (session && typeof session === "string") {
    result = `${result} (${session})`;
  }

  return result;
};
