// lib/dataFetcher.ts
// Utility to fetch mock or live API data seamlessly

export const USE_API = false; //  Change to true when backend is ready

export async function fetchData<T>(path: string): Promise<T> {
  try {
    if (USE_API) {
      // 🚀 Live API (e.g., from your Express or Next.js backend)
      const response = await fetch(`/api/${path}`);
      if (!response.ok) throw new Error("Failed to fetch data from API");
      return await response.json();
    } else {
      // 📦 Local Mock Data (for development phase)
      const response = await fetch(`/data/${path}.json`);
      if (!response.ok) throw new Error("Failed to fetch mock data");
      return await response.json();
    }
  } catch (error) {
    console.error(`❌ Error fetching ${path}:`, error);
    throw error;
  }
}
