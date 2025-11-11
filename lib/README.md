🔥 Alright Breakthrough! Here’s a **professional, clean, and developer-friendly documentation** for your `useDataFetcher` hook — formatted like a real API utility doc you'd find in a top-tier React project.

---

# 📘 `useDataFetcher` Hook Documentation

## 🧩 Overview

`useDataFetcher` is a **universal data-fetching hook** designed for React (and Next.js) client components.
It provides a **consistent API layer** for all HTTP requests — handling:

* ✅ Authorization headers automatically
* ✅ Error messages and network handling
* ✅ Optional mock mode for local testing
* ✅ Flexible response formats (`JSON` or full `Response`)
* ✅ Automatic URL normalization

---

## ⚙️ Import

```ts
import { useDataFetcher } from "@/hooks/useDataFetcher";
```

---

## 🧠 Usage Example

```ts
"use client";
import { useEffect } from "react";
import { useDataFetcher } from "@/hooks/useDataFetcher";

export default function ExamplePage() {
  const { fetchData } = useDataFetcher();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData("user/profile", "GET");
        console.log(result.data);
      } catch (err) {
        console.error("Error:", err.message);
      }
    };
    loadData();
  }, []);

  return <div>Check console for user profile data</div>;
}
```

---

## 🧾 Hook Signature

```ts
function useDataFetcher(): {
  fetchData: (
    path: string,
    method?: "GET" | "POST" | "DELETE" | "PUT" | "PATCH",
    body?: any,
    options?: {
      returnFullResponse?: boolean;
      params?: string;
    }
  ) => Promise<any>;
};
```

---

## 🧭 Parameters

| Parameter                    | Type                                              | Default     | Description                                                           |
| ---------------------------- | ------------------------------------------------- | ----------- | --------------------------------------------------------------------- |
| `path`                       | `string`                                          | —           | The relative API path (e.g., `"user/profile"`).                       |
| `method`                     | `"GET" \| "POST" \| "DELETE" \| "PUT" \| "PATCH"` | `"GET"`     | The HTTP request method.                                              |
| `body`                       | `any`                                             | `undefined` | The payload to send in the request (ignored for `GET`).               |
| `options.returnFullResponse` | `boolean`                                         | `false`     | If `true`, returns the full `Response` object instead of parsed JSON. |
| `options.params`             | `string`                                          | `undefined` | Optional route parameter appended to the URL (e.g., `/user/123`).     |

---

## 🧰 Features

### 1. 🌍 API Endpoint Configuration

Automatically detects and normalizes the base endpoint:

```ts
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT?.replace(/\/$/, "");
```

---

### 2. 🔐 Authorization Support

Automatically attaches a Bearer token if a user is logged in:

```ts
if (user?.access_token)
  headers.Authorization = `Bearer ${user.access_token}`;
```

---

### 3. 🧪 Mock Mode

When `USE_API = false`, data is loaded from local mock files:

```ts
export const USE_API = true; // toggle to false for mock mode
```

Mock data is read from `/data/{path}.json`.

---

### 4. ⚠️ Error Handling

Gracefully handles:

* Server-side errors (`status !== 200`)
* JSON parsing issues
* Network failures

You’ll always get a **clean, human-readable error message**:

```ts
"Network error — please check your connection"
"Request failed (404)"
"Unexpected error occurred"
```

---

### 5. 🧩 Response Format

The function returns a **standardized object**:

```ts
{
  data: any,           // the main response data
  status: "success",   // response status
  message: string      // human-readable message
}
```

Or if `returnFullResponse` is set:

```ts
Response { status, ok, headers, ... }
```

---

## 🧠 Example Use Cases

### ✅ `GET` Example

```ts
const result = await fetchData("posts");
console.log(result.data);
```

### ✅ `POST` Example

```ts
const result = await fetchData("user/signup", "POST", {
  email: "test@example.com",
  password: "123456"
});
```

### ✅ `PUT` Example

```ts
await fetchData("user/profile", "PUT", { username: "Breakthrough" });
```

### ✅ With Parameters

```ts
await fetchData("user", "GET", null, { params: "42" }); // → /user/42
```

### ✅ Full Response Example

```ts
const response = await fetchData("files/image", "GET", null, { returnFullResponse: true });
const blob = await response.blob();
```

---

## 💥 Error Example

```ts
try {
  await fetchData("user/nonexistent");
} catch (err) {
  console.error(err.message); // e.g., "Request failed (404)"
}
```

---

## 🧩 Integration Example with Auth Hook

If you want to align this with your `useAuth` hook:

```ts
const { fetchData } = useDataFetcher();

const login = async (payload: any) => fetchData("user/signin", "POST", payload);
const signup = async (payload: any) => fetchData("user/signup", "POST", payload);
```

---

## 🔧 Return Object

| Key         | Type       | Description                          |
| ----------- | ---------- | ------------------------------------ |
| `fetchData` | `Function` | Main function used to fetch from API |

---

## 🏁 Summary

| Feature              | Supported |
| -------------------- | --------- |
| Authorization        | ✅         |
| Mock Mode            | ✅         |
| Error Handling       | ✅         |
| Params               | ✅         |
| Full Response        | ✅         |
| JSON Parsing         | ✅         |
| Environment Endpoint | ✅         |

