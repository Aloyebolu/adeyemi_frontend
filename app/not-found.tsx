"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  ClipboardList,
  Users,
  FileText,
} from "lucide-react";

export default function RootNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden text-[#0f172a] text-center relative">
      {/* ✨ Floating Background Icons */}
      {[BookOpen, ClipboardList, Users, FileText].map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute opacity-10 text-blue-400"
          initial={{ y: Math.random() * 400, x: Math.random() * 400 }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            top: `${10 + i * 20}%`,
            left: `${10 + i * 25}%`,
          }}
        >
          <Icon size={80} />
        </motion.div>
      ))}

      {/* 🎓 AFUED Branding */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-6xl sm:text-7xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4"
      >
        AFUED says...
      </motion.h1>

      {/* 💥 “Oops” text */}
      <motion.h2
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-5xl sm:text-6xl font-bold text-blue-300 drop-shadow-lg"
      >
        Oops! You took a wrong turn 🎓
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-300 mt-4 mb-10 max-w-lg"
      >
        The page you’re looking for doesn’t exist.
        Don’t worry — you can safely head back to your dashboard 👇
      </motion.p>

      {/* 🎯 Back Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg hover:shadow-cyan-300/40 transition"
        >
          Back to Dashboard
        </Link>
      </motion.div>

      {/* 🌌 Floating glow */}
      <motion.div
        className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ repeat: Infinity, duration: 6 }}
        style={{ top: "20%", left: "50%", transform: "translateX(-50%)" }}
      />
    </div>
  );
}
