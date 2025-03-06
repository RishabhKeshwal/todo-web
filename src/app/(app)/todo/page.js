"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import TodoFilter from "../../../components/TodoFilter";
import TodoList from "../../../components/TodoList";
import TodoModal from "../../../components/TodoModal";

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState({
    name: "",
    priority: "all",
    startDate: "",
    endDate: "",
  });
  const [editingTodo, setEditingTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, todosRes] = await Promise.all([
          axios.get("/api/auth/user", { withCredentials: true }),
          axios.get("/api/todos/get-todo", { withCredentials: true }),
        ]);
        setUser(userRes.data);
        setTodos(todosRes.data);
      } catch (error) {
        toast.error("Failed to load data. Please refresh.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addTodo = async (todo) => {
    try {
      const res = await axios.post("/api/todos/create-todo", todo, {
        withCredentials: true,
      });
      setTodos((prev) => [...prev, res.data]);
      toast.success("Task added!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add task.");
    }
  };

  const updateTodo = async (todo) => {
    try {
      await axios.put("/api/todos/update-todo", todo, {
        withCredentials: true,
      });
      setTodos((prev) =>
        prev.map((t) =>
          t._id === todo._id
            ? {
                ...t,
                text: todo.text,
                priority: todo.priority,
                date: todo.date,
              }
            : t
        )
      );
      toast.success("Task updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/delete-todo?id=${id}`, {
        withCredentials: true,
      });
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      toast.success("Task deleted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task.");
    }
  };

  const handleModalSubmit = (todo) => {
    if (todo._id) {
      updateTodo(todo);
    } else {
      addTodo(todo);
    }
  };

  const startEditing = (id, text, priority, date) => {
    setEditingTodo({ _id: id, text, priority, date });
    setIsModalOpen(true);
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesName = todo.text
      .toLowerCase()
      .includes(filter.name.toLowerCase());
    const matchesPriority =
      filter.priority === "all" || todo.priority === filter.priority;
    const todoDate = new Date(todo.date);
    const start = filter.startDate ? new Date(filter.startDate) : null;
    const end = filter.endDate ? new Date(filter.endDate) : null;
    const matchesDate =
      (!start && !end) ||
      (start && !end && todoDate >= start) ||
      (!start && end && todoDate <= end) ||
      (start && end && todoDate >= start && todoDate <= end);
    return matchesName && matchesPriority && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex flex-col">
      <Toaster position="top-right" />

      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-6 shadow-lg"
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <motion.div className="flex items-center gap-4">
            {loading ? (
              <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
            ) : (
              <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-xl font-bold text-indigo-800">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <motion.h1 className="text-2xl md:text-3xl font-bold">
                {user ? `${user.name}'s Todos` : "Your Todos"}
              </motion.h1>
              <motion.p className="text-sm md:text-base text-indigo-100">
                {user ? user.email : "Stay organized and productive"}
              </motion.p>
            </div>
          </motion.div>
          <motion.button
            onClick={() => {
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold shadow-md transition"
          >
            Add Task
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-1/3 w-full"
        >
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Filter Tasks
            </h2>
            <TodoFilter setFilter={setFilter} />
          </div>
        </motion.div>

        {/* Todo List Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:w-3/4 w-full"
        >
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tasks</h2>
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <TodoList
                todos={filteredTodos}
                deleteTodo={deleteTodo}
                startEditing={startEditing}
              />
            )}
          </div>
        </motion.div>
      </main>

      {/* Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTodo || {}}
      />
    </div>
  );
};

export default TodoPage;
