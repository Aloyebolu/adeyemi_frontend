(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_76a0e8._.js", {

"[project]/components/ui/Alert.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "Alert": (()=>Alert)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
;
const Alert = ({ variant, message, onClose, duration = 5000 })=>{
    _s();
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Alert.useEffect": ()=>{
            // Trigger enter animation
            const enter = setTimeout({
                "Alert.useEffect.enter": ()=>setIsVisible(true)
            }["Alert.useEffect.enter"], 50);
            // Trigger exit animation
            const exit = setTimeout({
                "Alert.useEffect.exit": ()=>setIsVisible(false)
            }["Alert.useEffect.exit"], duration);
            return ({
                "Alert.useEffect": ()=>{
                    clearTimeout(enter);
                    clearTimeout(exit);
                }
            })["Alert.useEffect"];
        }
    }["Alert.useEffect"], [
        duration
    ]);
    // Call onClose after exit animation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Alert.useEffect": ()=>{
            if (!isVisible) {
                const timer = setTimeout({
                    "Alert.useEffect.timer": ()=>onClose()
                }["Alert.useEffect.timer"], 300); // match CSS transition duration
                return ({
                    "Alert.useEffect": ()=>clearTimeout(timer)
                })["Alert.useEffect"];
            }
        }
    }["Alert.useEffect"], [
        isVisible,
        onClose
    ]);
    const colors = {
        success: 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100',
        error: 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100',
        info: 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100',
        warning: 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `p-4 rounded-lg shadow-md mb-4 max-w-sm w-full border border-opacity-50
        transform transition-all duration-300
        ${colors[variant]}
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `,
        children: message
    }, void 0, false, {
        fileName: "[project]/components/ui/Alert.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
};
_s(Alert, "nsCiLtF5Y1+XM2+DHz+VedU//yk=");
_c = Alert;
var _c;
__turbopack_refresh__.register(_c, "Alert");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/context/NotificationContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "NotificationContext": (()=>NotificationContext),
    "NotificationContextProvider": (()=>NotificationContextProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/ui/Alert.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
const NotificationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    notifications: [],
    addNotification: ()=>{},
    removeNotification: ()=>{}
});
const NotificationContextProvider = ({ children })=>{
    _s();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const addNotification = (notification)=>{
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications((prev)=>[
                ...prev,
                {
                    ...notification,
                    id
                }
            ]);
    };
    const removeNotification = (id)=>{
        setNotifications((prev)=>prev.filter((n)=>n.id !== id));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NotificationContext.Provider, {
        value: {
            notifications,
            addNotification,
            removeNotification
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-0 right-4 space-y-2 z-50",
                style: {
                    position: ''
                },
                children: notifications.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                        variant: n.variant,
                        message: n.message,
                        duration: 5000,
                        onClose: ()=>removeNotification(n.id)
                    }, n.id, false, {
                        fileName: "[project]/context/NotificationContext.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/context/NotificationContext.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/context/NotificationContext.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
};
_s(NotificationContextProvider, "/HH3zTd3BUNOgnlhD79kguSWbWM=");
_c = NotificationContextProvider;
var _c;
__turbopack_refresh__.register(_c, "NotificationContextProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/layout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>RootLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$NotificationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/context/NotificationContext.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function RootLayout({ children }) {
    // const user = localStorage.getItem('userId')
    // const {user, setUser} = useContext(UserContext)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        name: "viewport",
        content: "width=device-width, maximum-scale=1.0, users-scalable=no, initial-scale=1.0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            className: "select-none",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$NotificationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotificationContextProvider"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/app/layout.tsx",
                lineNumber: 18,
                columnNumber: 15
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/layout.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/layout.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = RootLayout;
var _c;
__turbopack_refresh__.register(_c, "RootLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=_76a0e8._.js.map