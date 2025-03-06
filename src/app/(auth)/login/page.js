"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      toast.success("Logged in successfully! 🚀");
      router.push("/todo"); // Immediate redirect; remove setTimeout for production
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const floatVariants = {
    animate: {
      y: [-5, 5],
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex items-center justify-center p-4">
      <Toaster position="top-right" /> {/* Toast container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-4xl flex flex-col lg:flex-row rounded-xl shadow-2xl overflow-hidden"
      >
        <motion.div
          variants={itemVariants}
          className="lg:w-1/2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-8 flex items-center justify-center relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl font-extrabold tracking-tight"
            >
              Welcome Back!
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl max-w-sm mx-auto text-indigo-100"
            >
              Log in to unleash your productivity potential.
            </motion.p>

            {/* Icon Container */}
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="relative w-36 h-36 flex items-center justify-center"
            >
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 shadow-xl flex items-center justify-center">
                <span className="text-6xl md:text-7xl text-white drop-shadow-lg">
                  📋
                </span>
                {/* Decorative Rings */}
                <div className="absolute inset-0 rounded-full border-2 border-white opacity-25 animate-pulse" />
                <div className="absolute inset-2 rounded-full border-2 border-indigo-200 opacity-20 animate-ping" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Section (Form) */}
        <motion.div
          variants={itemVariants}
          className="lg:w-1/2 bg-white p-8 flex flex-col justify-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-gray-800 mb-6 text-center"
          >
            Login
          </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <motion.input
                variants={itemVariants}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Password
              </label>
              <motion.input
                variants={itemVariants}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                required
                disabled={loading}
              />
            </div>
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 text-white py-3 rounded-md font-semibold shadow-md transition duration-300 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700"
              }`}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-center text-gray-600 text-sm"
          >
            No account?{" "}
            <Link href="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
