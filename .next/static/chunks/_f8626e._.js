(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_f8626e._.js", {

"[project]/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
const Home = ()=>{
    _s();
    const [opened, setOpened] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeGroup, setActiveGroup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const srollY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(window.screenY);
    const [currentHeight, setCurrentHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (scrollY < currentHeight) {
                console.log(true);
            }
            console.log(currentHeight);
            setCurrentHeight(currentHeight);
        }
    }["Home.useEffect"], [
        scrollY
    ]);
    const [chat, setChat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            name: "Aloye Breakthough",
            message: "This is a message from Aloye Breakthroug",
            unread: 5
        },
        {
            name: "Daivid",
            message: "How are you doing today, i hope that you are doing good",
            unread: 5
        },
        {
            name: "Aloye Breakthough",
            message: "This is a message from Aloye Breakthroug",
            unread: 5
        },
        {
            name: "Daivid",
            message: "How are you doing today, i hope that you are doing good",
            unread: 5
        },
        {
            name: "Aloye Breakthough",
            message: "This is a message from Aloye Breakthroug",
            unread: 5
        },
        {
            name: "Daivid",
            message: "How are you doing today, i hope that you are doing good",
            unread: 5
        },
        {
            name: "Aloye Breakthough",
            message: "This is a message from Aloye Breakthroug"
        },
        {
            name: "Daivid",
            message: "How are you doing today, i hope that you are doing good"
        },
        {
            name: "Aloye Breakthough",
            message: "This is a message from Aloye Breakthroug"
        },
        {
            name: "Daivid",
            message: "How are you doing today, i hope that you are doing good"
        },
        {
            name: "Aloye Breakthough",
            message: "This is a message from Aloye Breakthroug"
        },
        {
            name: "Daivid",
            message: "How are you doing today, i hope that you are doing good"
        },
        {
            name: "Aloye Breakthough",
            message: "This is a message from Aloye Breakthroug"
        },
        {
            name: "Daivid",
            message: "How are you doing today, i hope that you are doing good"
        }
    ]);
    const groups = [
        'all',
        'unread',
        'groups'
    ];
    const filteredChats = chat.filter((item)=>item.message.toLowerCase().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase()));
    const highlightText = (text, term)=>{
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index)=>regex.test(part) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mark", {
                children: part
            }, index, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 96,
                columnNumber: 28
            }, this) : part);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-[100%] h-[100%] p-4 pt-0 mt-0 position-fixed ",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed'
                },
                className: "flex w-[100%] justify-between bg-black p-5 top-0 left-0 ",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-lg text-bold",
                        children: "WhatsApp"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 102,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "a"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 104,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "b"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 105,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 103,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 101,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 100
                },
                className: "rounded-[30] bg-red-500 w-[100%] p-2 mt-3 rouded-sm mt-30 flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__.FaBeer, {}, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 111,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        style: {
                            width: '100%',
                            backgroundColor: 'transparent',
                            outline: 'none'
                        },
                        value: search,
                        type: "text",
                        onChange: (e)=>setSearch(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 112,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 110,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between mt-4",
                children: groups.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveGroup(index),
                        className: `p-1 text-[13px] rounded-[20] ${activeGroup == index ? 'bg-purple-900 text-purpule-500' : 'border-2'}`,
                        children: item
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 124,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 121,
                columnNumber: 13
            }, this),
            activeGroup == 0 && filteredChats.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex mt-4 gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px'
                            },
                            className: "bg-blue-500 w-40 h-40 "
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 134,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: item.name
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 136,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm ",
                                    children: item.message
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 137,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 135,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 133,
                    columnNumber: 17
                }, this)),
            activeGroup == 1 && filteredChats.map((item, index)=>item.unread > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex mt-4 gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px'
                            },
                            className: "bg-blue-500 w-40 h-40 "
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 145,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: item.name
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 147,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: highlightText(item.message, search)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 150,
                                    columnNumber: 26
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 146,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 144,
                    columnNumber: 17
                }, this) : null)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 99,
        columnNumber: 9
    }, this);
};
_s(Home, "RzgV49ChFA0dxxDoyOCsvDStZdc=");
_c = Home;
const __TURBOPACK__default__export__ = Home;
var _c;
__turbopack_refresh__.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
"[project]/node_modules/react-icons/index.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// THIS FILE IS AUTO GENERATED
__turbopack_esm__({});
;
}}),
"[project]/node_modules/react-icons/index.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/react-icons/index.mjs [app-client] (ecmascript) <locals>");
}}),
"[project]/node_modules/react-icons/lib/index.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({});
;
;
;
}}),
"[project]/node_modules/react-icons/lib/index.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/react-icons/lib/index.mjs [app-client] (ecmascript) <locals>");
}}),
"[project]/node_modules/react-icons/lib/iconsManifest.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "IconsManifest": (()=>IconsManifest)
});
var IconsManifest = [
    {
        "id": "ci",
        "name": "Circum Icons",
        "projectUrl": "https://circumicons.com/",
        "license": "MPL-2.0 license",
        "licenseUrl": "https://github.com/Klarr-Agency/Circum-Icons/blob/main/LICENSE"
    },
    {
        "id": "fa",
        "name": "Font Awesome 5",
        "projectUrl": "https://fontawesome.com/",
        "license": "CC BY 4.0 License",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
    },
    {
        "id": "fa6",
        "name": "Font Awesome 6",
        "projectUrl": "https://fontawesome.com/",
        "license": "CC BY 4.0 License",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
    },
    {
        "id": "io",
        "name": "Ionicons 4",
        "projectUrl": "https://ionicons.com/",
        "license": "MIT",
        "licenseUrl": "https://github.com/ionic-team/ionicons/blob/master/LICENSE"
    },
    {
        "id": "io5",
        "name": "Ionicons 5",
        "projectUrl": "https://ionicons.com/",
        "license": "MIT",
        "licenseUrl": "https://github.com/ionic-team/ionicons/blob/master/LICENSE"
    },
    {
        "id": "md",
        "name": "Material Design icons",
        "projectUrl": "http://google.github.io/material-design-icons/",
        "license": "Apache License Version 2.0",
        "licenseUrl": "https://github.com/google/material-design-icons/blob/master/LICENSE"
    },
    {
        "id": "ti",
        "name": "Typicons",
        "projectUrl": "http://s-ings.com/typicons/",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
    },
    {
        "id": "go",
        "name": "Github Octicons icons",
        "projectUrl": "https://octicons.github.com/",
        "license": "MIT",
        "licenseUrl": "https://github.com/primer/octicons/blob/master/LICENSE"
    },
    {
        "id": "fi",
        "name": "Feather",
        "projectUrl": "https://feathericons.com/",
        "license": "MIT",
        "licenseUrl": "https://github.com/feathericons/feather/blob/master/LICENSE"
    },
    {
        "id": "lu",
        "name": "Lucide",
        "projectUrl": "https://lucide.dev/",
        "license": "ISC",
        "licenseUrl": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    {
        "id": "gi",
        "name": "Game Icons",
        "projectUrl": "https://game-icons.net/",
        "license": "CC BY 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/3.0/"
    },
    {
        "id": "wi",
        "name": "Weather Icons",
        "projectUrl": "https://erikflowers.github.io/weather-icons/",
        "license": "SIL OFL 1.1",
        "licenseUrl": "http://scripts.sil.org/OFL"
    },
    {
        "id": "di",
        "name": "Devicons",
        "projectUrl": "https://vorillaz.github.io/devicons/",
        "license": "MIT",
        "licenseUrl": "https://opensource.org/licenses/MIT"
    },
    {
        "id": "ai",
        "name": "Ant Design Icons",
        "projectUrl": "https://github.com/ant-design/ant-design-icons",
        "license": "MIT",
        "licenseUrl": "https://opensource.org/licenses/MIT"
    },
    {
        "id": "bs",
        "name": "Bootstrap Icons",
        "projectUrl": "https://github.com/twbs/icons",
        "license": "MIT",
        "licenseUrl": "https://opensource.org/licenses/MIT"
    },
    {
        "id": "ri",
        "name": "Remix Icon",
        "projectUrl": "https://github.com/Remix-Design/RemixIcon",
        "license": "Apache License Version 2.0",
        "licenseUrl": "http://www.apache.org/licenses/"
    },
    {
        "id": "fc",
        "name": "Flat Color Icons",
        "projectUrl": "https://github.com/icons8/flat-color-icons",
        "license": "MIT",
        "licenseUrl": "https://opensource.org/licenses/MIT"
    },
    {
        "id": "gr",
        "name": "Grommet-Icons",
        "projectUrl": "https://github.com/grommet/grommet-icons",
        "license": "Apache License Version 2.0",
        "licenseUrl": "http://www.apache.org/licenses/"
    },
    {
        "id": "hi",
        "name": "Heroicons",
        "projectUrl": "https://github.com/tailwindlabs/heroicons",
        "license": "MIT",
        "licenseUrl": "https://opensource.org/licenses/MIT"
    },
    {
        "id": "hi2",
        "name": "Heroicons 2",
        "projectUrl": "https://github.com/tailwindlabs/heroicons",
        "license": "MIT",
        "licenseUrl": "https://opensource.org/licenses/MIT"
    },
    {
        "id": "si",
        "name": "Simple Icons",
        "projectUrl": "https://simpleicons.org/",
        "license": "CC0 1.0 Universal",
        "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
    },
    {
        "id": "sl",
        "name": "Simple Line Icons",
        "projectUrl": "https://thesabbir.github.io/simple-line-icons/",
        "license": "MIT",
        "licenseUrl": "https://opensource.org/licenses/MIT"
    },
    {
        "id": "im",
        "name": "IcoMoon Free",
        "projectUrl": "https://github.com/Keyamoon/IcoMoon-Free",
        "license": "CC BY 4.0 License",
        "licenseUrl": "https://github.com/Keyamoon/IcoMoon-Free/blob/master/License.txt"
    },
    {
        "id": "bi",
        "name": "BoxIcons",
        "projectUrl": "https://github.com/atisawd/boxicons",
        "license": "MIT",
        "licenseUrl": "https://github.com/atisawd/boxicons/blob/master/LICENSE"
    },
    {
        "id": "cg",
        "name": "css.gg",
        "projectUrl": "https://github.com/astrit/css.gg",
        "license": "MIT",
        "licenseUrl": "https://opensource.org/licenses/MIT"
    },
    {
        "id": "vsc",
        "name": "VS Code Icons",
        "projectUrl": "https://github.com/microsoft/vscode-codicons",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
    },
    {
        "id": "tb",
        "name": "Tabler Icons",
        "projectUrl": "https://github.com/tabler/tabler-icons",
        "license": "MIT",
        "licenseUrl": "https://opensource.org/licenses/MIT"
    },
    {
        "id": "tfi",
        "name": "Themify Icons",
        "projectUrl": "https://github.com/lykmapipo/themify-icons",
        "license": "MIT",
        "licenseUrl": "https://github.com/thecreation/standard-icons/blob/master/modules/themify-icons/LICENSE"
    },
    {
        "id": "rx",
        "name": "Radix Icons",
        "projectUrl": "https://icons.radix-ui.com",
        "license": "MIT",
        "licenseUrl": "https://github.com/radix-ui/icons/blob/master/LICENSE"
    },
    {
        "id": "pi",
        "name": "Phosphor Icons",
        "projectUrl": "https://github.com/phosphor-icons/core",
        "license": "MIT",
        "licenseUrl": "https://github.com/phosphor-icons/core/blob/main/LICENSE"
    },
    {
        "id": "lia",
        "name": "Icons8 Line Awesome",
        "projectUrl": "https://icons8.com/line-awesome",
        "license": "MIT",
        "licenseUrl": "https://github.com/icons8/line-awesome/blob/master/LICENSE.md"
    }
];
}}),
"[project]/node_modules/react-icons/lib/iconContext.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DefaultContext": (()=>DefaultContext),
    "IconContext": (()=>IconContext)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var DefaultContext = {
    color: undefined,
    size: undefined,
    className: undefined,
    style: undefined,
    attr: undefined
};
var IconContext = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createContext && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createContext(DefaultContext);
}}),
"[project]/node_modules/react-icons/lib/iconBase.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "GenIcon": (()=>GenIcon),
    "IconBase": (()=>IconBase)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$iconContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/lib/iconContext.mjs [app-client] (ecmascript)");
var _excluded = [
    "attr",
    "size",
    "title"
];
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    for(var key in source){
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (excluded.indexOf(key) >= 0) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _extends() {
    _extends = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : ("TURBOPACK unreachable", undefined);
    return _extends.apply(this, arguments);
}
function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function _objectSpread(e) {
    for(var r = 1; r < arguments.length; r++){
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
            _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
    }
    return e;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
;
;
function Tree2Element(tree) {
    return tree && tree.map((node, i)=>/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(node.tag, _objectSpread({
            key: i
        }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
    return (props)=>/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(IconBase, _extends({
            attr: _objectSpread({}, data.attr)
        }, props), Tree2Element(data.child));
}
function IconBase(props) {
    var elem = (conf)=>{
        var { attr, size, title } = props, svgProps = _objectWithoutProperties(props, _excluded);
        var computedSize = size || conf.size || "1em";
        var className;
        if (conf.className) className = conf.className;
        if (props.className) className = (className ? className + " " : "") + props.className;
        return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("svg", _extends({
            stroke: "currentColor",
            fill: "currentColor",
            strokeWidth: "0"
        }, conf.attr, attr, svgProps, {
            className: className,
            style: _objectSpread(_objectSpread({
                color: props.color || conf.color
            }, conf.style), props.style),
            height: computedSize,
            width: computedSize,
            xmlns: "http://www.w3.org/2000/svg"
        }), title && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("title", null, title), props.children);
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$iconContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconContext"] !== undefined ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$iconContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconContext"].Consumer, null, (conf)=>elem(conf)) : elem(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$iconContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DefaultContext"]);
}
}}),
"[project]/node_modules/react-icons/lib/index.mjs [app-client] (ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DefaultContext": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$iconContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DefaultContext"]),
    "GenIcon": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$iconBase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GenIcon"]),
    "IconBase": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$iconBase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconBase"]),
    "IconContext": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$iconContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconContext"]),
    "IconsManifest": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$iconsManifest$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconsManifest"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$iconsManifest$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/lib/iconsManifest.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$iconBase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/lib/iconBase.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$iconContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/lib/iconContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/react-icons/lib/index.mjs [app-client] (ecmascript) <locals>");
}}),
"[project]/node_modules/react-icons/lib/index.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DefaultContext": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["DefaultContext"]),
    "GenIcon": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GenIcon"]),
    "IconBase": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["IconBase"]),
    "IconContext": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["IconContext"]),
    "IconsManifest": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["IconsManifest"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/react-icons/lib/index.mjs [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__ = __turbopack_import__("[project]/node_modules/react-icons/lib/index.mjs [app-client] (ecmascript) <exports>");
}}),
"[project]/node_modules/react-icons/index.mjs [app-client] (ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DefaultContext": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DefaultContext"]),
    "GenIcon": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GenIcon"]),
    "IconBase": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconBase"]),
    "IconContext": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconContext"]),
    "IconsManifest": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconsManifest"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/lib/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/react-icons/index.mjs [app-client] (ecmascript) <locals>");
}}),
"[project]/node_modules/react-icons/index.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DefaultContext": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["DefaultContext"]),
    "GenIcon": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GenIcon"]),
    "IconBase": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["IconBase"]),
    "IconContext": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["IconContext"]),
    "IconsManifest": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["IconsManifest"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/react-icons/index.mjs [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__ = __turbopack_import__("[project]/node_modules/react-icons/index.mjs [app-client] (ecmascript) <exports>");
}}),
}]);

//# sourceMappingURL=_f8626e._.js.map