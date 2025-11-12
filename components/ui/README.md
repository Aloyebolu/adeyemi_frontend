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


--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------
# Select Component Documentation
--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------



## Overview
A fully accessible and theme-aware dropdown component built on top of **Radix UI’s Select primitives**.

**Consumes:**
- `colors.surface`
- `colors.border`
- `colors.textPrimary`
- `shadows.medium`
- `radii.sm`

**Purpose:**  
Provides a customizable, keyboard-navigable select/dropdown component for UI forms.

**Dependencies:**
- React
- @radix-ui/react-select
- lucide-react (icons)
- cn() utility for class merging
- theme object for design tokens

---

## Example Usage

```jsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="cherry">Cherry</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

---

## Components

### `Select`
Root Select component that wraps the entire dropdown logic and context.

### `SelectGroup`
Groups related Select items together.

### `SelectValue`
Displays the currently selected value inside the trigger.

### `SelectTrigger`
The clickable trigger element that opens the dropdown. Displays the selected value or placeholder text.

**Props:**
| Prop | Type | Description |
|------|------|--------------|
| `className` | `string` | Additional custom class names |
| `children` | `React.ReactNode` | Optional trigger content |

### `SelectContent`
The dropdown content that appears when the trigger is clicked. Contains the viewport for items.

**Props:**
| Prop | Type | Default | Description |
|------|------|----------|--------------|
| `position` | `"item-aligned" or "popper"` | `"popper"` | Controls positioning mode |

### `SelectLabel`
Label for grouping related items.

### `SelectItem`
Individual item within the dropdown. Supports keyboard navigation, focus, and selection.

### `SelectSeparator`
Visual separator used between groups or sections of items.

---

## Styling Notes
Uses Tailwind utility classes combined with Radix UI data attributes for animations and focus states.

**Key Tailwind classes:**
- `rounded-md`, `border`, `bg-background`, `focus:ring-2`
- Animations via `data-[state=open]` and `data-[state=closed]` selectors

---

## Accessibility
✅ Keyboard navigable  
✅ Screen-reader friendly via Radix primitives  
✅ Fully themeable and composable

---

## File Structure
```
components/ui/select.tsx
```

---

## Maintainer Notes
Keep class names consistent with the design system tokens (`theme.colors`, `theme.shadows`, `theme.radii`).  
Future improvements could include:
- Adding multi-select functionality  
- Supporting asynchronous options loading  
- Integrating icons or grouped headers


Perfect — now that’s the full AFUED Table v3.0 component. Here’s the **complete professional documentation** (developer-focused, matching enterprise standards).

---

# 📘 AFUED Table v3.0 Documentation

## 🧩 Overview

The `Table` component is an **enterprise-ready React table** built with **TanStack React Table**.
It includes out-of-the-box support for:

✅ Sorting, filtering, searching
✅ Pagination (client or server)
✅ Row selection + bulk actions
✅ CSV, Excel, and TXT export
✅ 23 built-in **themes/variants**
✅ Dropdown filtering
✅ Optional numbering
✅ Inline editing (cell-based)
✅ Smooth UX and Tailwind design compliance

---

## ⚙️ Import

```tsx
import { Table } from "@/components/Table";
```

---

## 📥 Props

| Prop                | Type                                                                              | Default                   | Description                                      |
| ------------------- | --------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------ |
| `columns`           | `any[]`                                                                           | **required**              | Column definitions as expected by TanStack Table |
| `data`              | `TData[]`                                                                         | **required**              | Array of data objects                            |
| `enableSearch`      | `boolean`                                                                         | `true`                    | Toggles global search input                      |
| `enableSort`        | `boolean`                                                                         | `true`                    | Enables sorting on columns                       |
| `enablePagination`  | `boolean`                                                                         | `true`                    | Enables pagination                               |
| `enableFilter`      | `boolean`                                                                         | `true`                    | Enables dropdown filter                          |
| `enableSelection`   | `boolean`                                                                         | `true`                    | Enables checkbox row selection                   |
| `enableExport`      | `boolean`                                                                         | `true`                    | Enables export (CSV, Excel, TXT)                 |
| `serverMode`        | `boolean`                                                                         | `false`                   | Enables remote (server-side) data fetching       |
| `onServerQuery`     | `(query: { page, pageSize, search?, sortField?, sortOrder?, filterId? }) => void` | `undefined`               | Handles remote queries                           |
| `onBulkAction`      | `(action: string, selectedRows: TData[]) => void`                                 | `undefined`               | Handles bulk actions                             |
| `pageSize`          | `number`                                                                          | `10`                      | Default number of rows per page                  |
| `isLoading`         | `boolean`                                                                         | `false`                   | Displays loading spinner                         |
| `error`             | `string`                                                                          | `null`                    | Displays error message                           |
| `pagination`        | `object`                                                                          | `undefined`               | Custom pagination data for server mode           |
| `enableDropDown`    | `boolean`                                                                         | `false`                   | Enables dropdown menu for filters                |
| `dropDownData`      | `{ text: string; id: string }[]`                                                  | `[{ text: "", id: "0" }]` | Dropdown options                                 |
| `dropDownText`      | `string`                                                                          | `"Dropdown"`              | Placeholder text for dropdown                    |
| `variant`           | `TableVariant`                                                                    | `"default"`               | Defines theme variant                            |
| `controls`          | `boolean`                                                                         | `true`                    | Enables or hides control toolbar                 |
| `onCellEdit`        | `(rowIndex, columnId, newValue) => void`                                          | `undefined`               | Called on cell edit                              |
| `tableEmptyMessage` | `string`                                                                          | `"No records found."`     | Message for empty table                          |
| `showNumbering`     | `boolean`                                                                         | `false`                   | Displays row numbering column                    |
| `numberingType`     | `"1" \| "(1)" \| "{1}" \| "a" \| "A" \| "i" \| "I"`                               | `"1"`                     | Numbering style                                  |
| `numberingText`     | `string`                                                                          | `"#"`                     | Header label for numbering column                |

---

## 🧱 Example Usage

```tsx
const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name", editable: true },
  { accessorKey: "email", header: "Email" },
];

const data = [
  { id: 1, name: "Aloye Breakthrough", email: "aloye@afu.edu" },
  { id: 2, name: "Muna Love", email: "muna@afu.edu" },
];

export default function Demo() {
  return (
    <Table
      columns={columns}
      data={data}
      enableSearch
      enablePagination
      variant="corporate"
      showNumbering
      numberingType="(1)"
      dropDownText="Filter by Status"
      dropDownData={[
        { text: "Active", id: "active" },
        { text: "Suspended", id: "suspended" },
      ]}
      onCellEdit={(rowIndex, columnId, value) =>
        console.log(`Edited ${columnId} in row ${rowIndex}: ${value}`)
      }
    />
  );
}
```

---

## 🎨 Available Variants

| Category          | Variants                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Light Themes      | `default`, `striped`, `borderless`, `compact`, `corporate`, `paper`, `minimal`, `soft`, `dashboard`, `elegant` |
| Dark / Futuristic | `dark`, `tech`, `monochrome`, `futuristic`, `neon`, `blueprint`                                                |
| Colorful          | `colorful`, `ocean`, `nature`, `fire`, `pastel`, `gradient`                                                    |

---

## 🧠 Advanced Features

### 🔍 1. Server Mode

Enable **server-side filtering, sorting, and pagination**:

```tsx
<Table
  columns={columns}
  data={data}
  serverMode
  onServerQuery={(query) => {
    console.log("Server request:", query);
  }}
/>
```

`query` includes:

```ts
{
  page: number;
  pageSize: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  filterId?: string;
}
```

---

### 🧾 2. Inline Editing

Each column can be editable:

```tsx
{ accessorKey: "email", header: "Email", editable: true }
```

---

### 🗂️ 3. Export Formats

* **CSV:** Downloadable spreadsheet format
* **Excel:** Uses XLSX for `.xlsx` export
* **TXT:** Exports each row as a JSON string

---

### 🔢 4. Numbering

Show sequential numbering in several styles:

| Style   | Example       |
| ------- | ------------- |
| `"1"`   | 1, 2, 3       |
| `"(1)"` | (1), (2), (3) |
| `"{1}"` | {1}, {2}      |
| `"a"`   | a, b, c       |
| `"A"`   | A, B, C       |
| `"i"`   | i, ii, iii    |
| `"I"`   | I, II, III    |

---

### ⚡ 5. Theming System

Each `variant` applies custom Tailwind classes from the internal `variantStyles` map — so you can extend or override themes easily.

---

### 🧮 6. Custom Dropdown Filter

Ideal for categories, departments, or user status filters.

```tsx
dropDownData={[
  { text: "Science", id: "SCI" },
  { text: "Arts", id: "ART" },
]}
```

---

### 🧱 7. Pagination (Server or Client)

Automatically calculates visible rows, or triggers your backend with `onServerQuery`.

---

## 🚀 Performance Notes

* All local operations (sort, filter) are **instant and debounced**.
* Server calls are delayed by **500ms** to avoid redundant fetches.
* Uses **React.memo-friendly** architecture and clean re-renders.

---

## 🧰 Dependencies

* `@tanstack/react-table`
* `xlsx`
* `lucide-react`
* `@/components/ui/Button`
* `@/components/ui/Input`
* `@/components/ui/select`
* `theme` (custom design token map)

---

## 🧑‍💻 Author

**AFUED Engineering Team**
Optimized and documented with ❤️ for **Breakthrough & Muna**.

---

Would you like me to add a **README.md** version (formatted for GitHub docs) next? 📄💻✨🔥💙💡🧩📊🪄🧠⚙️
