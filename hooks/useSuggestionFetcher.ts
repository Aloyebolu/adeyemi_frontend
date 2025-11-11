// hooks/useSuggestionFetcher.ts
// import { useDataFetcher } from "../dataFetcher";
import { AppPath, useDataFetcher } from "@/lib/dataFetcher";
import { fetchSuggestions as fetchSuggestionsUtil } from "@/lib/utils/suggestionFetcher";

export const useSuggestionFetcher = () => {
  const { fetchData } = useDataFetcher();

  const fetchSuggestions = async (type: any, input: string) => {
    // Wrap fetchData to match the expected signature
    const fetchDataWrapper = (endpoint: string, method: string, body: any) => {
      return fetchData(endpoint as
        AppPath,
        method as "GET" | "POST" | "DELETE" | "PUT" | "PATCH",
        body
      );
    };
    return fetchSuggestionsUtil(type, input, fetchDataWrapper);
  };

  return { fetchSuggestions };
};
