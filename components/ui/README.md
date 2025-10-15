Alright Breakthrough 💥🔥
Here’s a **comprehensive documentation** for your `AdvancedFilterSystem` component — written in a clean, developer-friendly format that can be pasted into your project’s `/docs` folder or a README file.

---

# 🧠 AdvancedFilterSystem Component Documentation

## 📘 Overview

`AdvancedFilterSystem` is a **dynamic and intelligent filtering system** built with React that allows users to construct complex queries using multiple fields, operators, and logical connectors (`AND` / `OR`).
It automatically builds a **MongoDB-compatible query object** and supports **auto-suggestions**, **async data fetching**, and **error handling**.

It’s perfect for dashboards, admin panels, or any app requiring advanced search and filtering logic.

---

## ⚙️ Features

✅ Supports complex filters with multiple conditions
✅ Dynamic field/operator/value selection
✅ Handles AND/OR logic for nested conditions
✅ Optional async fetching for auto-suggestions
✅ Automatically converts operators into MongoDB query syntax
✅ Realtime callback with generated query
✅ Safe UI with error and loading states
✅ Keyboard navigation for suggestions (↑ ↓ Enter Esc)

---

## 🧩 Props

| Prop Name         | Type                                                  | Required | Description                                                                         |
| ----------------- | ----------------------------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| `fields`          | `Record<string, string>`                              | ✅ Yes    | Defines available fields and their labels.                                          |
| `fetchData`       | `(field: string, input: string) => Promise<string[]>` | ❌ No     | Custom async function to fetch suggestions for specific fields.                     |
| `fetchableFields` | `string[]`                                            | ❌ No     | Specifies which fields should trigger the `fetchData` suggestion feature.           |
| `onFiltersChange` | `(filters: any) => void`                              | ❌ No     | Callback that receives the built MongoDB query object whenever filters are updated. |

---

## 🧱 State Variables

| State             | Type             | Purpose                                               |
| ----------------- | ---------------- | ----------------------------------------------------- |
| `nodes`           | `Array`          | Stores all added filter conditions.                   |
| `currentField`    | `string`         | The currently selected field name.                    |
| `currentOperator` | `string`         | The comparison operator (e.g., `=`, `>`, `contains`). |
| `currentValue`    | `string`         | The input value for the selected field.               |
| `currentLogic`    | `string`         | The logic connector (`AND` or `OR`).                  |
| `suggestions`     | `string[]`       | Autocomplete suggestions for current field.           |
| `loading`         | `boolean`        | Indicates if suggestions are being fetched.           |
| `error`           | `string \| null` | Stores any error message encountered during fetch.    |
| `highlightIndex`  | `number`         | Tracks which suggestion is currently highlighted.     |

---

## ⚡ Core Functions

### 🧮 `convertOperatorToQuery(operator: string, value: any)`

Converts user-selected operators into **MongoDB-compatible query syntax**.

**Example:**

```ts
convertOperatorToQuery(">", 20)
// Returns: { $gt: 20 }
```

Supported operators:

```
=, !=, >, <, >=, <=, contains, startsWith, endsWith
```

---

### 🧱 `buildQueryObject(nodes: any[])`

Builds the **final MongoDB query object** from all filters.

**Example Input:**

```js
[
  { field: "age", operator: ">", value: "18", logic: "AND" },
  { field: "status", operator: "=", value: "active", logic: "OR" }
]
```

**Output Query:**

```js
{
  $or: [
    { $and: [{ age: { $gt: 18 } }] },
    { status: "active" }
  ]
}
```

---

### ➕ `addNode()`

Adds a new filter node to the list when the user clicks “Add” or presses Enter.

### ❌ `removeNode(index: number)`

Removes a specific condition node by its index.

### 🧹 `clearAll()`

Clears all existing filters and resets everything.

### 🧭 `handleKeyDown(e: KeyboardEvent)`

Handles keyboard navigation for suggestion dropdowns (Arrow keys, Enter, Escape).

---

## 🔄 Async Suggestions (Auto-Fetch Logic)

This component supports **async auto-suggestions** for selected fields.

* When the user types in a fetchable field, a delayed request (700 ms debounce) is sent.
* You can provide your own `fetchData` function, or it will use a default `/api/:field?q=value` endpoint.

```ts
useEffect(() => {
  if (!currentField || !currentValue || !fetchableFields.includes(currentField)) return;
  const handler = setTimeout(async () => {
    setLoading(true);
    try {
      const results = await fetchData(currentField, currentValue);
      setSuggestions(results);
    } catch (err) {
      setError(`Failed to load ${fields[currentField]}`);
    } finally {
      setLoading(false);
    }
  }, 700);

  return () => clearTimeout(handler);
}, [currentField, currentValue]);
```

---

## 🖥️ Example Usage

```tsx
import { AdvancedFilterSystem } from "@/components/AdvancedFilterSystem";

const FIELD_CONFIG = {
  name: "Name",
  age: "Age",
  status: "Status",
  department: "Department",
};

export default function FacultyPage() {
  const handleFiltersChange = (query: any) => {
    console.log("Generated Query:", query);
    // Example: send query to backend
    // fetch("/api/faculty?filter=" + JSON.stringify(query));
  };

  return (
    <AdvancedFilterSystem
      fields={FIELD_CONFIG}
      fetchableFields={["name", "department"]}
      onFiltersChange={handleFiltersChange}
    />
  );
}
```

---

## 🧠 Example Query Output

When a user adds filters like:

```
Name contains "John" AND Age >= 18 OR Status = "Active"
```

Generated MongoDB query:

```js
{
  $or: [
    { $and: [{ name: { $regex: "John", $options: "i" }, age: { $gte: 18 } }] },
    { status: "Active" }
  ]
}
```

---

## 🎨 UI/UX Highlights

✨ Clean modern design (with Tailwind classes)
🖱 Click or keyboard navigation for suggestions
🧩 Responsive and mobile-friendly
🔁 Real-time query updates
🚨 Error and loading indicators
💬 Context-aware suggestion dropdown

---

## 🧰 Dependencies

* React 18+
* TailwindCSS
* ShadCN `Button` component
* Custom hook `useDataFetcher` (handles data fetching abstraction)

---

## 💡 Best Practices

* Use descriptive field labels for better UX
* Limit `fetchableFields` to avoid excessive requests
* Debounce fetch calls for large datasets
* Always handle `onFiltersChange` to sync with backend queries

---

## 🧾 License

This component is part of your custom internal UI library and can be reused across multiple modules — just ensure your backend supports **MongoDB-style query objects**.

---

🔥✨📘💻🎯🚀🧩🧠💪🎨
