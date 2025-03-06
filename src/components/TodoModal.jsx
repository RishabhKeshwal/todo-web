"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TodoModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
    const [title, setTitle] = useState(initialData.text || "");
    const [priority, setPriority] = useState(initialData.priority || "medium");
    const [dueDate, setDueDate] = useState(initialData.date ? initialData.date.split("T")[0] : "");

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.text || "");
            setPriority(initialData.priority || "medium");
            setDueDate(initialData.date ? initialData.date.split("T")[0] : "");
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        const todo = {
            text: title,
            priority,
            date: dueDate || new Date().toISOString(),
            ...(initialData.id && { id: initialData.id }),
        };
        onSubmit(todo);
        onClose();
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <motion.div
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {initialData.id ? "Edit Task" : "Add a New Task"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title..."
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex gap-4">
                        <motion.button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {initialData.id ? "Update" : "Add"}
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md font-semibold hover:bg-gray-400 transition"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default TodoModal;