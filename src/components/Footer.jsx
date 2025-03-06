"use client";
import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
    // Animation variants
    const footerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    };

    return (
        <motion.footer
            variants={footerVariants}
            initial="hidden"
            animate="visible"
            className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-gray-200/30 shadow-lg py-4 z-50"
        >
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm md:text-base text-gray-800 font-medium tracking-wide">
                    © {new Date().getFullYear()} To-Do App. Crafted with{" "}
                    <motion.span
                        className="text-red-400 inline-block"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        ♥
                    </motion.span>{" "}
                    for productivity lovers.{" "}
                    <span className="text-indigo-400">✨</span>
                </p>
            </div>
        </motion.footer>
    );
};

export default Footer;