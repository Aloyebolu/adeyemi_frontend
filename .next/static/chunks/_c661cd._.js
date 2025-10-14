(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_c661cd._.js", {

"[project]/components/ui/Input.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "Input": (()=>Input)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const Input = ({ ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        className: "border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/Input.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
};
_c = Input;
var _c;
__turbopack_refresh__.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ui/Button.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * 🎨 Button Component
 * Uses tokens from theme for colors, radius, and shadows.
 * Consumes: colors.primary, colors.accent, text.textOnPrimary
 */ __turbopack_esm__({
    "Button": (()=>Button)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const Button = ({ variant = "primary", children, ...props })=>{
    const variants = {
        primary: "bg-primary text-textOnPrimary hover:bg-primaryHover focus:ring-2 focus:ring-accent",
        secondary: "bg-surface text-textPrimary hover:bg-surfaceElevated focus:ring-2 focus:ring-accent",
        outline: "border border-primary text-primary hover:bg-primary hover:text-textOnPrimary focus:ring-2 focus:ring-accent"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ...props,
        className: `px-4 py-2 rounded-xl shadow-md transition-all duration-200 min-h-[2.5rem] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/Button.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
};
_c = Button;
var _c;
__turbopack_refresh__.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ui/Table.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * 📊 AFUED Table Component (Extended)
 * Consumes: colors.surface, colors.border, text.textPrimary, text.textOnPrimary
 * Description: Universal, reusable data table with optional search, sort, filter, pagination, export, and actions.
 */ __turbopack_esm__({
    "Table": (()=>Table)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/ui/Input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/@tanstack/react-table/build/lib/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/trash.js [app-client] (ecmascript) <export default as Trash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@tanstack/table-core/build/lib/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
;
function Table({ columns, data, enableSearch = true, enableSort = true, enablePagination = true, enableFilter = false, enableExport = false, enableActions = false, pageSize = 10, onEdit, onView, onDelete }) {
    _s();
    const [globalFilter, setGlobalFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const table = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useReactTable"])({
        data,
        columns: enableActions ? [
            ...columns,
            {
                header: "Actions",
                id: "actions",
                cell: {
                    "Table.useReactTable[table]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                onView && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: {
                                        "Table.useReactTable[table]": ()=>onView(row.original)
                                    }["Table.useReactTable[table]"],
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/Table.tsx",
                                        lineNumber: 70,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/Table.tsx",
                                    lineNumber: 65,
                                    columnNumber: 19
                                }, this),
                                onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: {
                                        "Table.useReactTable[table]": ()=>onEdit(row.original)
                                    }["Table.useReactTable[table]"],
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/Table.tsx",
                                        lineNumber: 79,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/Table.tsx",
                                    lineNumber: 74,
                                    columnNumber: 19
                                }, this),
                                onDelete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: {
                                        "Table.useReactTable[table]": ()=>onDelete(row.original)
                                    }["Table.useReactTable[table]"],
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__["Trash"], {
                                        size: 16,
                                        className: "text-error"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/Table.tsx",
                                        lineNumber: 88,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/Table.tsx",
                                    lineNumber: 83,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/Table.tsx",
                            lineNumber: 63,
                            columnNumber: 15
                        }, this)
                }["Table.useReactTable[table]"]
            }
        ] : columns,
        state: {
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCoreRowModel"])(),
        getFilteredRowModel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredRowModel"])(),
        getSortedRowModel: enableSort ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSortedRowModel"])() : undefined,
        getPaginationRowModel: enablePagination ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPaginationRowModel"])() : undefined
    });
    const exportCSV = ()=>{
        const headers = table.getAllColumns().filter((col)=>col.id !== "actions").map((col)=>col.id);
        const csvRows = [
            headers.join(","),
            ...data.map((row)=>headers.map((key)=>row[key]).join(","))
        ];
        const blob = new Blob([
            csvRows.join("\n")
        ], {
            type: "text/csv"
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "table-data.csv";
        link.click();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full p-4 bg-surface rounded-xl shadow-md",
        children: [
            (enableSearch || enableExport) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap justify-between items-center mb-4 gap-2",
                children: [
                    enableSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                        placeholder: "Search...",
                        value: globalFilter ?? "",
                        onChange: (e)=>setGlobalFilter(e.target.value),
                        className: "max-w-xs"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/Table.tsx",
                        lineNumber: 128,
                        columnNumber: 13
                    }, this),
                    enableExport && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "secondary",
                        onClick: exportCSV,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                size: 16,
                                className: "mr-2"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/Table.tsx",
                                lineNumber: 137,
                                columnNumber: 15
                            }, this),
                            " Export CSV"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/Table.tsx",
                        lineNumber: 136,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/Table.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full text-sm text-left border border-border",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-surfaceElevated text-textPrimary",
                            children: table.getHeaderGroups().map((headerGroup)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: headerGroup.headers.map((header)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-2 border-b border-border font-semibold select-none cursor-pointer",
                                            onClick: enableSort ? header.column.getToggleSortingHandler() : undefined,
                                            children: header.isPlaceholder ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flexRender"])(header.column.columnDef.header, header.getContext())
                                        }, header.id, false, {
                                            fileName: "[project]/components/ui/Table.tsx",
                                            lineNumber: 150,
                                            columnNumber: 19
                                        }, this))
                                }, headerGroup.id, false, {
                                    fileName: "[project]/components/ui/Table.tsx",
                                    lineNumber: 148,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/ui/Table.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: table.getRowModel().rows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "hover:bg-surfaceElevated transition-all",
                                    children: row.getVisibleCells().map((cell)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2 border-b border-border",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flexRender"])(cell.column.columnDef.cell, cell.getContext())
                                        }, cell.id, false, {
                                            fileName: "[project]/components/ui/Table.tsx",
                                            lineNumber: 171,
                                            columnNumber: 19
                                        }, this))
                                }, row.id, false, {
                                    fileName: "[project]/components/ui/Table.tsx",
                                    lineNumber: 169,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/ui/Table.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/Table.tsx",
                    lineNumber: 145,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/Table.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            enablePagination && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "secondary",
                        onClick: ()=>table.previousPage(),
                        disabled: !table.getCanPreviousPage(),
                        children: "Previous"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/Table.tsx",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-textSecondary",
                        children: [
                            "Page ",
                            table.getState().pagination.pageIndex + 1,
                            " of",
                            " ",
                            table.getPageCount()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/Table.tsx",
                        lineNumber: 191,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "secondary",
                        onClick: ()=>table.nextPage(),
                        disabled: !table.getCanNextPage(),
                        children: "Next"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/Table.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/Table.tsx",
                lineNumber: 183,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/Table.tsx",
        lineNumber: 123,
        columnNumber: 5
    }, this);
}
_s(Table, "u8HMkBjwimSskhPs3BMaxDkfSlI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useReactTable"]
    ];
});
_c = Table;
var _c;
__turbopack_refresh__.register(_c, "Table");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ui/Badge.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * 🎖 Badge Component
 * Purpose: Displays compact status indicators like “Active”, “Pending”, “Error”, etc.
 * Features: Animated appearance, semantic variants, accessible by default.
 */ __turbopack_esm__({
    "Badge": (()=>Badge)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const Badge = ({ variant = "neutral", children })=>{
    const variants = {
        success: "bg-success/90 text-textOnPrimary shadow-sm",
        warning: "bg-warning/90 text-textOnPrimary shadow-sm",
        error: "bg-error/90 text-textOnPrimary shadow-sm",
        info: "bg-accent/90 text-textOnPrimary shadow-sm",
        neutral: "bg-surfaceElevated text-textPrimary border border-border shadow-sm"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${variants[variant]} transition-all duration-200 ease-in-out`,
        role: "status",
        "aria-label": typeof children === "string" ? `${children} badge` : "status badge",
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/Badge.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
};
_c = Badge;
var _c;
__turbopack_refresh__.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(dashboard)/dashboard/example/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>StudentRecordsPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * 🎓 Student Records Page
 * Demonstrates AFUED Table Component usage with all interactive features enabled.
 * Layout: Inside dashboard card with full theme compliance.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/ui/Table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/ui/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$usePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/hooks/usePage.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
function StudentRecordsPage() {
    _s();
    const { setPage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$usePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePage"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StudentRecordsPage.useEffect": ()=>{
            setPage("Student Records");
        }
    }["StudentRecordsPage.useEffect"], [
        setPage
    ]);
    // 🧩 Mock student data
    const students = [
        {
            id: "STU001",
            name: "Aloye Breakthrough",
            department: "Computer Science",
            level: "400",
            status: "Active",
            cgpa: 4.25
        },
        {
            id: "STU002",
            name: "Muna Love",
            department: "Mathematics",
            level: "300",
            status: "Probation",
            cgpa: 1.85
        },
        {
            id: "STU003",
            name: "Joshua Okafor",
            department: "Biology",
            level: "200",
            status: "Inactive",
            cgpa: 0.0
        }
    ];
    // 🧱 Table Columns Definition
    const columns = [
        {
            header: "Student ID",
            accessorKey: "id"
        },
        {
            header: "Name",
            accessorKey: "name"
        },
        {
            header: "Department",
            accessorKey: "department"
        },
        {
            header: "Level",
            accessorKey: "level"
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row })=>{
                const status = row.original.status;
                const variant = status === "Active" ? "success" : status === "Probation" ? "warning" : "error";
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: variant,
                    children: status
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/example/page.tsx",
                    lineNumber: 66,
                    columnNumber: 16
                }, this);
            }
        },
        {
            header: "CGPA",
            accessorKey: "cgpa"
        }
    ];
    // 🧠 Handlers for row actions
    const handleView = (row)=>alert(`Viewing ${row.name}`);
    const handleEdit = (row)=>alert(`Editing ${row.name}`);
    const handleDelete = (row)=>alert(`Deleting ${row.name}`);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-6xl mx-auto p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-surface rounded-xl shadow-md p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-semibold mb-4 text-textPrimary",
                    children: "Student Records"
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/example/page.tsx",
                    lineNumber: 80,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                    columns: columns,
                    data: students,
                    enableSearch: true,
                    enableSort: true,
                    enablePagination: true,
                    enableExport: true,
                    enableActions: true,
                    onView: handleView,
                    onEdit: handleEdit,
                    onDelete: handleDelete
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/example/page.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(dashboard)/dashboard/example/page.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/dashboard/example/page.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
_s(StudentRecordsPage, "YjS5sHpc1PuZRqyLeXH5H/UbjSo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$usePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePage"]
    ];
});
_c = StudentRecordsPage;
var _c;
__turbopack_refresh__.register(_c, "StudentRecordsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(dashboard)/dashboard/example/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=_c661cd._.js.map