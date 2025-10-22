import { use } from "react";
import { suggestionConfig } from "./suggestionConfig";
import { useDataFetcher } from "../dataFetcher";

type SuggestionType = keyof typeof suggestionConfig;

export const fetchSuggestions = async (type: SuggestionType, input: string) => {
  const config = suggestionConfig[type];
  const {fetchData} = useDataFetcher()

  if (!config) throw new Error(`❌ Unknown suggestion type: ${type}`);

  // If it’s a static/predefined list (like rank)
  if ("predefined" in config && Array.isArray(config.predefined)) {
    return config.predefined.filter((item: any) =>
      item.toLowerCase().includes(input.toLowerCase())
    );
  }

  // Otherwise, fetch dynamically from backend
  if ("endpoint" in config && Array.isArray(config.fields)) {
    const { data } = await fetchData(config.endpoint, "POST", {
      fields: config.fields,
      search_term: input,
    });
    return data;
  }

  throw new Error(`❌ Invalid config for suggestion type: ${type}`);
};
