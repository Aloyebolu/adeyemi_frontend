// components/dev-tools/DevToolsMenu.tsx
"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    UserCircle,
    GraduationCap,
    BookOpen,
    X,
    LogOut,
    Settings,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // or use any toast library you prefer
import { loginAs } from "@/lib/auth";

// Define the structure for dev actions
export interface DevAction {
    id: string;
    label: string;
    description?: string;
    icon: React.ReactNode;
    action: () => Promise<void> | void;
    variant?: "default" | "danger" | "success";
}

interface DevToolsMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DevToolsMenu({ isOpen, onClose }: DevToolsMenuProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const { adminLogin, studentLogin, lecturerLogin, loading } = useAuth();
    const router = useRouter();

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                isOpen
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    // Default credentials (store in .env or config file in real app)
    const defaultCredentials = {
        admin: { admin_id: "ADM-002", password: "admin123" },
        lecturer: { staff_id: "STAFF001", password: "STAFF001" },
        student: { matric_no: "CSC/2024/0001D", password: "CSC/2024/0001D" },
    };

    // Define your dev actions
    const devActions: DevAction[] = [
        {
            id: "login-admin",
            label: "Login as Admin",
            description: "Access admin dashboard",
            icon: <UserCircle className="h-5 w-5" />,
            action: async () => {
                try {
                    const data = await adminLogin(defaultCredentials.admin);
                    if (!data?.user || data?.user?.role !== "admin") {
                        toast.error("Access denied. Admin only.");
                        return;
                    }
                    loginAs("admin", data?.user?.access_token, data?.user?.name, data?.user?.id, data?.user?.admin_id,);
                    toast.success("Logged in as Admin");
                    onClose();
                    router.push("/dashboard/admin");

                } catch (error) {
                    toast.error("Admin login failed");
                }
            },
            variant: "success",
        },
        {
            id: "login-lecturer",
            label: "Login as Lecturer",
            description: "Access lecturer portal",
            icon: <BookOpen className="h-5 w-5" />,
            action: async () => {
                try {
                    const data = await lecturerLogin(defaultCredentials.lecturer);
                    if (
                        !data?.user ||
                        !["lecturer", "hod", "dean"].includes(data?.user?.role)
                    ) {
                        return;
                    }

                    // Save session
                    loginAs(
                        data?.user?.role,
                        data?.user?.access_token,
                        data?.user?.name,
                        data?.user?.id,
                        data?.user?.staff_id
                    );
                    toast.success("Logged in as Lecturer");
                    onClose();
                    router.push("/dashboard/lecturer");
                } catch (error) {
                    toast.error("Lecturer login failed");
                }
            },
        },
        {
            id: "login-student",
            label: "Login as Student",
            description: "Access student portal",
            icon: <GraduationCap className="h-5 w-5" />,
            action: async () => {
                try {
                    const data = await studentLogin(defaultCredentials.student);

                    if (!data?.user || data?.user?.role !== "student") {
                        return;
                    }

                    // Save session
                    loginAs(
                        data?.user?.role,
                        data?.user?.access_token,
                        data?.user?.name,
                        data?.user?.id,
                        data?.user?.matric_no
                    );
                    toast.success("Logged in as Student");
                    onClose();
                    router.push("/dashboard/student");
                } catch (error) {
                    toast.error("Student login failed");
                }
            },
        },
        {
            id: "logout-all",
            label: "Logout All Sessions",
            description: "Clear all auth tokens",
            icon: <LogOut className="h-5 w-5" />,
            action: () => {
                // Add your logout logic here
                localStorage.clear();
                sessionStorage.clear();
                toast.info("All sessions cleared");
                onClose();
                router.push("/");
            },
            variant: "danger",
        },
        // Add more actions as needed
    ];

    // Add custom actions from localStorage (for extensibility)
    const [customActions, setCustomActions] = useState<DevAction[]>([]);

    useEffect(() => {
        // Load custom actions from localStorage or API
        const savedActions = localStorage.getItem("dev_custom_actions");
        if (savedActions) {
            try {
                setTimeout(() => {
                    setCustomActions(JSON.parse(savedActions));
                }, 0);
            } catch (e) {
                console.error("Failed to parse custom actions", e);
            }
        }
    }, []);

    const allActions = [...devActions, ...customActions];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
                    />

                    {/* Menu */}
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-1/2 z-[9999] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900"
                    >
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    🛠️ Development Tools
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Quick actions for development
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Actions Grid */}
                        <div className="space-y-3">
                            {allActions.map((action) => (
                                <motion.button
                                    key={action.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => action.action()}
                                    disabled={loading}
                                    className={`flex w-full items-center justify-between rounded-lg p-4 text-left transition-all ${action.variant === "danger"
                                        ? "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                                        : action.variant === "success"
                                            ? "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30"
                                            : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`rounded-lg p-2 ${action.variant === "danger"
                                                ? "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-400"
                                                : action.variant === "success"
                                                    ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400"
                                                    : "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400"
                                                }`}
                                        >
                                            {action.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {action.label}
                                            </h3>
                                            {action.description && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {action.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">→</div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span>DEV_MODE: {process.env.NEXT_PUBLIC_DEV_MODE}</span>
                                <span className="font-mono text-xs">
                                    v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}