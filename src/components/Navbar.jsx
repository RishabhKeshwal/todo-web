"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { FaBars, FaTimes, FaSignOutAlt, FaTasks } from "react-icons/fa";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    // Fetch user details from cookies
    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get("/api/auth/user", { withCredentials: true });
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Logout Handler
    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout", {}, { withCredentials: true });
            setUser(null);
            setIsMenuOpen(false);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Animation variants for logo
    const logoVariants = {
        hidden: { opacity: 0, rotate: -10, y: -20 },
        visible: {
            opacity: 1,
            rotate: 0,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
        hover: {
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.3, yoyo: Infinity }, // Subtle bounce effect
        },
    };

    const textVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
        hover: { color: "#4f46e5" }, // Indigo-600
    };

    // Animation variants
    const menuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-gray-200/30 shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Brand with Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <motion.div
                        variants={logoVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="flex items-center justify-center"
                    >
                        <FaTasks className="text-2xl md:text-3xl text-indigo-600" />
                    </motion.div>
                    <motion.span
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight transition-colors duration-300"
                    >
                        To-Do
                    </motion.span>
                </Link>

                {/* Desktop Menu */}
                <div className="items-center gap-6">
                    {user ? (
                        <>
                            <motion.button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaSignOutAlt size={16} /> Logout
                            </motion.button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="md:hidden absolute top-full left-0 right-0 bg-white/10 backdrop-blur-md border-b border-gray-200/30 shadow-lg"
                    >
                        <div className="flex flex-col items-center py-6 gap-4">
                            {user ? (
                                <>
                                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                                        {user.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <motion.button
                                        onClick={handleLogout}
                                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaSignOutAlt size={16} /> Logout
                                    </motion.button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;