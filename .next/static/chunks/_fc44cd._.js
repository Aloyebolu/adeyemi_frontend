(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_fc44cd._.js", {

"[project]/styles/theme.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// styles/theme.ts
// Single source of truth for colors, spacing, type, radii, shadows, breakpoints.
// Keep this file authoritative — never hardcode colors/spacing in components.
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__),
    "theme": (()=>theme)
});
const theme = {
    // Core palette (keeps AFUED required hexes)
    colors: {
        primary: "#0B3D2E",
        primaryHover: "#11543E",
        accent: "#F4C430",
        accentHover: "#e4b828",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        surfaceElevated: "#F7F8F9",
        border: "#D1D5DB",
        textPrimary: "#1F2937",
        textSecondary: "#6B7280",
        textOnPrimary: "#FFFFFF",
        success: "#16A34A",
        error: "#DC2626",
        warning: "#D97706",
        info: "#0EA5E9"
    },
    // Neutral scale for UI surfaces, borders and text variants (use these, not ad-hoc grays)
    neutral: {
        50: "#F9FAFB",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
        900: "#111827"
    },
    // Semantic tokens (use these across components)
    semantic: {
        bg: "background",
        surface: "surface",
        surfaceElevated: "surfaceElevated",
        border: "border",
        text: "textPrimary",
        textMuted: "textSecondary",
        brand: "primary",
        accent: "accent"
    },
    // Spacing scale (use rems — consistent & responsive)
    spacing: {
        px: "1px",
        0: "0rem",
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem"
    },
    // Type scale (rem units — change base font-size in globals if needed)
    type: {
        fontFamily: {
            heading: "Poppins, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
            body: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
        },
        h1: "2rem",
        h2: "1.5rem",
        h3: "1.25rem",
        bodyLarge: "1rem",
        body: "0.9375rem",
        small: "0.8125rem" // 13px
    },
    // Radii
    radii: {
        sm: "0.375rem",
        card: "1rem",
        lg: "1.5rem",
        pill: "9999px"
    },
    // Elevation / shadows (consistent elevation tokens)
    shadows: {
        low: "0 1px 2px rgba(16,24,40,0.04)",
        medium: "0 6px 20px rgba(16,24,40,0.08)",
        high: "0 12px 40px rgba(16,24,40,0.12)"
    },
    // Breakpoints (for layout and responsive decisions)
    breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px"
    },
    // Motion & z-index tokens
    motion: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms"
    },
    zIndex: {
        dropdown: 1000,
        sticky: 1100,
        modal: 1200,
        toast: 1300
    }
};
const __TURBOPACK__default__export__ = theme;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/Sidebar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// Sidebar.tsx
// Tokens used: theme.colors.primary, theme.colors.textPrimary, theme.colors.textOnPrimary, theme.colors.background
// Component: Universal AFUED Sidebar with role-based navigation
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/styles/theme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
const Sidebar = ({ role, open })=>{
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    //   const [open, setOpen] = useState(true);
    const commonLinks = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
        }
    ];
    const roleLinks = {
        student: [
            {
                name: "Course Registration",
                href: "/dashboard/student/register",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
            },
            {
                name: "Results",
                href: "/dashboard/student/results",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"]
            },
            {
                name: "Transcript Request",
                href: "/dashboard/student/transcript",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
            }
        ],
        lecturer: [
            {
                name: "Upload Results",
                href: "/dashboard/lecturer/upload",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"]
            },
            {
                name: "Manage Courses",
                href: "/dashboard/lecturer/courses",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
            }
        ],
        admin: [
            {
                name: "Approve Results",
                href: "/dashboard/admin/approve",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"]
            },
            {
                name: "Manage Users",
                href: "/dashboard/admin/users",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"]
            },
            {
                name: "Generate Transcript",
                href: "/dashboard/admin/transcripts",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
            }
        ],
        parent: [
            {
                name: "View Ward Results",
                href: "/dashboard/parent/results",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"]
            }
        ]
    };
    const links = [
        ...commonLinks,
        ...roleLinks[role] || []
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: `${open ? "w-64" : "w-20"} bg-white dark:bg-[var(--color-background-dark)] border-r border-gray-200 dark:border-gray-700 flex flex-col p-4 transition-all duration-300 min-h-screen`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-8 h-8 rounded-full",
                        style: {
                            backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].colors.primary
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-bold text-gray-800 dark:text-white",
                        children: "AFUED Portal"
                    }, void 0, false, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex flex-col gap-2 flex-grow",
                children: links.map((link)=>{
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: link.href,
                        className: `flex  items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive ? "bg-primary/200 text-primary font-bold" : "text-textPrimary dark:text-gray-600 hover:bg-primary/20 dark:hover:bg-primary/20 hover:text-primary"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 80,
                                columnNumber: 15
                            }, this),
                            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: link.name
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 81,
                                columnNumber: 24
                            }, this)
                        ]
                    }, link.name, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 71,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary w-full",
                    onClick: ()=>{
                        localStorage.clear();
                        window.location.href = "/";
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this),
                        open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Logout"
                        }, void 0, false, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 97,
                            columnNumber: 20
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Sidebar.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Sidebar.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
};
_s(Sidebar, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Sidebar;
const __TURBOPACK__default__export__ = Sidebar;
var _c;
__turbopack_refresh__.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/dataFetcher.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// lib/dataFetcher.ts
// Utility to fetch mock or live API data seamlessly
__turbopack_esm__({
    "USE_API": (()=>USE_API),
    "fetchData": (()=>fetchData)
});
const USE_API = false; //  Change to true when backend is ready
async function fetchData(path) {
    try {
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/Topbar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// TopBar.tsx
// Tokens used: theme.colors.primary, theme.colors.backgroundLight, theme.colors.backgroundDark, theme.colors.textPrimary
// Component: AFUED TopBar with animated dropdown, avatar display, and solid background
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/styles/theme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataFetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/dataFetcher.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
;
;
const roleTitles = {
    student: "Student",
    lecturer: "Lecturer",
    admin: "Administrator",
    parent: "Parent"
};
const TopBar = ({ role, page })=>{
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const menuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopBar.useEffect": ()=>{
            async function loadUser() {
                try {
                    const users = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataFetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchData"])("students");
                    // You can later replace this with an auth-based user lookup
                    setUser(users[0]);
                } catch (error) {
                    console.error("Error loading user data:", error);
                }
            }
            loadUser();
        }
    }["TopBar.useEffect"], []);
    // Close dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopBar.useEffect": ()=>{
            const handleClickOutside = {
                "TopBar.useEffect.handleClickOutside": (event)=>{
                    if (menuRef.current && !menuRef.current.contains(event.target)) {
                        setMenuOpen(false);
                    }
                }
            }["TopBar.useEffect.handleClickOutside"];
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "TopBar.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["TopBar.useEffect"];
        }
    }["TopBar.useEffect"], []);
    // Role-based menu links
    const roleMenuItems = {
        student: [
            {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
                label: "My Courses",
                href: "/dashboard/student/register"
            },
            {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"],
                label: "My Results",
                href: "/dashboard/student/results"
            }
        ],
        lecturer: [
            {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"],
                label: "Upload Scores",
                href: "/dashboard/lecturer/upload"
            }
        ],
        admin: [
            {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
                label: "Manage Portal",
                href: "/dashboard/admin"
            }
        ],
        parent: [
            {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"],
                label: "View Ward Result",
                href: "/dashboard/parent/results"
            }
        ]
    };
    const avatar = user?.photo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        src: user.photo,
        alt: "Profile",
        width: 40,
        height: 40,
        className: "object-cover rounded-full w-10 h-10 border border-[var(--color-border)]"
    }, void 0, false, {
        fileName: "[project]/components/Topbar.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-full h-10 w-10 flex items-center justify-center font-bold text-white shadow-md",
        style: {
            backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].colors.primary
        },
        children: user?.name?.charAt(0).toUpperCase() || "A"
    }, void 0, false, {
        fileName: "[project]/components/Topbar.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "flex items-center justify-between p-4 border-b border-[var(--color-border)]  bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]  sticky top-0 z-50 transition-colors duration-300",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "lg:hidden flex items-center justify-center p-2 rounded-md hover:bg-[var(--color-background-light)]/80  dark:hover:bg-[var(--color-background-dark)]/80",
                        "aria-label": "Toggle sidebar",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                            size: 22,
                            className: "text-[var(--color-text-primary)] dark:text-white"
                        }, void 0, false, {
                            fileName: "[project]/components/Topbar.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Topbar.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-[var(--color-text-primary)] dark:text-white tracking-tight",
                        children: page
                    }, void 0, false, {
                        fileName: "[project]/components/Topbar.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Topbar.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex items-center gap-4",
                ref: menuRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-right hidden sm:block",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-bold text-[var(--color-text-primary)] dark:text-white",
                                children: user?.name || "Loading..."
                            }, void 0, false, {
                                fileName: "[project]/components/Topbar.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-[var(--color-text-secondary)] dark:text-gray-400",
                                children: roleTitles[role]
                            }, void 0, false, {
                                fileName: "[project]/components/Topbar.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Topbar.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setMenuOpen(!menuOpen),
                        "aria-label": "Open profile menu",
                        children: avatar
                    }, void 0, false, {
                        fileName: "[project]/components/Topbar.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: menuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: -10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            exit: {
                                opacity: 0,
                                y: -10
                            },
                            transition: {
                                duration: 0.15
                            },
                            className: "absolute right-0 top-12 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]  shadow-lg rounded-xl w-60 border border-[var(--color-border)] overflow-hidden z-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 border-b border-[var(--color-border)] flex items-center gap-3",
                                    style: {
                                        backgroundColor: "var(--color-background-light)"
                                    },
                                    children: [
                                        avatar,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-bold text-[var(--color-text-primary)] dark:text-white",
                                                    children: user?.name
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Topbar.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-500 dark:text-gray-400",
                                                    children: roleTitles[role]
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Topbar.tsx",
                                                    lineNumber: 148,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/Topbar.tsx",
                                            lineNumber: 144,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Topbar.tsx",
                                    lineNumber: 138,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "py-2",
                                    children: roleMenuItems[role].map((item, i)=>{
                                        const Icon = item.icon;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: item.href,
                                            className: "flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all duration-150",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Topbar.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 23
                                                }, this),
                                                item.label
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/components/Topbar.tsx",
                                            lineNumber: 157,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/components/Topbar.tsx",
                                    lineNumber: 153,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-t border-[var(--color-border)] py-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "#",
                                            className: "flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all duration-150",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Topbar.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 19
                                                }, this),
                                                " Profile"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/Topbar.tsx",
                                            lineNumber: 171,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                localStorage.clear();
                                                window.location.href = "/";
                                            },
                                            className: "w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all duration-150",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Topbar.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 19
                                                }, this),
                                                " Logout"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/Topbar.tsx",
                                            lineNumber: 177,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Topbar.tsx",
                                    lineNumber: 170,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Topbar.tsx",
                            lineNumber: 129,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Topbar.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Topbar.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Topbar.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
};
_s(TopBar, "YBXTN6YrJDML2otq5A/yPHlb++Y=");
_c = TopBar;
const __TURBOPACK__default__export__ = TopBar;
var _c;
__turbopack_refresh__.register(_c, "TopBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/hooks/useSidebar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "useSidebar": (()=>useSidebar)
});
// hooks/useSidebar.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_refresh__.signature();
'use client';
;
function useSidebar() {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSidebar.useEffect": ()=>{
            const saved = localStorage.getItem("sidebar_open");
            if (saved) setOpen(saved === "true");
        }
    }["useSidebar.useEffect"], []);
    const toggleSidebar = ()=>{
        const newState = !open;
        setOpen(newState);
        localStorage.setItem("sidebar_open", String(newState));
    };
    return {
        open,
        toggleSidebar
    };
}
_s(useSidebar, "5swwslfKOPgwwZeTkoqeSpghmqY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(dashboard)/layout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>DashboardPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Topbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/Topbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/hooks/useSidebar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
function DashboardPage({ children }) {
    _s();
    const userRole = "student";
    const currentPage = "Dashboard";
    const { open, toggleSidebar } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebar"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "light flex min-h-screen bg-background-light dark:bg-background-dark",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                role: userRole,
                open: open
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/layout.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Topbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        role: userRole,
                        page: currentPage
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "p-6 flex-1",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/layout.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/layout.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_s(DashboardPage, "9Yw+JQAcbcW4uGlhl6/iRibSBqo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebar"]
    ];
});
_c = DashboardPage;
var _c;
__turbopack_refresh__.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(dashboard)/layout.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=_fc44cd._.js.map