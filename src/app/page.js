"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/user", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const floatVariants = {
    animate: {
      y: [-10, 10],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex flex-col">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative bg-gradient-to-r h-screen from-indigo-600 via-purple-600 to-indigo-700 text-white py-16 md:py-24 flex items-center justify-center overflow-hidden"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10" />

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            Welcome to Todo App ✨
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl mt-4 max-w-2xl mx-auto text-gray-100"
          >
            {loading
              ? "Loading..."
              : user
              ? `Hey ${user.name}, conquer your tasks! 🚀`
              : "Boost your productivity today. 📅"}
          </motion.p>

          {/* Icon with Float Animation */}
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="mt-8 mb-10 mx-auto w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center"
          >
            <div className="relative w-full h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 shadow-lg flex items-center justify-center">
              <span className="text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-md">
                📋
              </span>
              <div className="absolute inset-0 rounded-full border-2 border-white opacity-20 animate-pulse" />
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <Link
              href={`${user ? "/todo" : "login"}`}
              className="inline-block bg-white text-indigo-700 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-indigo-50 transition duration-300"
            >
              Get Started 🌟
            </Link>
          </motion.div>
        </div>
      </motion.header>
    </div>
  );
}
