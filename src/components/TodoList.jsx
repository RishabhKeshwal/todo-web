"use client";
import React, { useState } from "react";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

const TodoList = ({ todos, deleteTodo, startEditing }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const todosPerPage = 5;

    const totalPages = Math.ceil(todos.length / todosPerPage);
    const startIndex = (currentPage - 1) * todosPerPage;
    const currentTodos = todos.slice(startIndex, startIndex + todosPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="space-y-4">
            {currentTodos.length > 0 ? (
                currentTodos.map((todo) => {
                    const formattedPriority = todo.priority
                        ? todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)
                        : "Low";

                    const priorityColor =
                        todo.priority === "high"
                            ? "bg-red-500/20 text-red-600 border-red-500/40"
                            : todo.priority === "medium"
                                ? "bg-yellow-500/20 text-yellow-600 border-yellow-500/40"
                                : "bg-green-500/20 text-green-600 border-green-500/40";

                    const priorityIcon =
                        todo.priority === "high" ? "🔴" : todo.priority === "medium" ? "🟡" : "🟢";

                    const formattedDate = todo.date
                        ? new Date(todo.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })
                        : "No Due Date";

                    return (
                        <motion.div
                            key={todo._id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/10 backdrop-blur-md border border-gray-200/30 rounded-xl shadow-lg hover:bg-white/20 transition-all duration-300 min-h-[100px] w-full"
                        >
                            <div className="flex items-start sm:items-center gap-3 flex-grow w-full sm:w-auto">
                                <div className={`${priorityColor} w-10 h-10 flex items-center justify-center rounded-full border shrink-0`}>
                                    <span className="text-xl font-bold">{priorityIcon}</span>
                                </div>
                                <div className="flex flex-col space-y-1 w-full">
                                    <span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight break-words">
                                        {todo.text}
                                    </span>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
                                        <span className={`${priorityColor} px-2 py-1 rounded-md font-semibold`}>
                                            {formattedPriority}
                                        </span>
                                        <span className="text-gray-600 flex items-center gap-1">
                                            <span className="text-indigo-400">🕒</span> {formattedDate}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row-reverse sm:flex-row justify-end gap-2 mt-3 sm:mt-0 sm:ml-4 ml-auto shrink-0 sm:self-end">
                                <motion.button
                                    onClick={() => startEditing(todo._id, todo.text, todo.priority, todo.date)}
                                    className="bg-white/30 text-blue-500 p-2 rounded-full border border-blue-500/40 hover:bg-blue-500/40 hover:text-blue-600 transition-all duration-200 backdrop-blur-sm"
                                    title="Edit"
                                >
                                    <FaEdit size={16} />
                                </motion.button>
                                <motion.button
                                    onClick={() => deleteTodo(todo._id)}
                                    className="bg-white/30 text-red-500 p-2 rounded-full border border-red-500/40 hover:bg-red-500/40 hover:text-red-600 transition-all duration-200 backdrop-blur-sm"
                                    title="Delete"
                                >
                                    <FaTrash size={16} />
                                </motion.button>
                            </div>
                        </motion.div>
                    );
                })
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-8 text-gray-700 text-lg font-medium bg-white/10 backdrop-blur-md border border-gray-200/30 rounded-xl shadow-lg w-full"
                >
                    No tasks yet. Time to shine! ✨
                </motion.div>
            )}
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full bg-blue-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronLeft size={20} />
                    </button>
                    <span className="text-gray-700 font-semibold">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full bg-blue-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TodoList;
