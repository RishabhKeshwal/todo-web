"use client";
import React, { useState } from "react";

const TodoFilter = ({ setFilter }) => {
    const [nameFilter, setNameFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleNameChange = (e) => {
        const value = e.target.value;
        setNameFilter(value);
        setFilter({ name: value, priority: priorityFilter, startDate, endDate });
    };

    const handlePriorityChange = (e) => {
        const value = e.target.value;
        setPriorityFilter(value);
        setFilter({ name: nameFilter, priority: value, startDate, endDate });
    };

    const handleStartDateChange = (e) => {
        const value = e.target.value;
        setStartDate(value);
        setFilter({ name: nameFilter, priority: priorityFilter, startDate: value, endDate });
    };

    const handleEndDateChange = (e) => {
        const value = e.target.value;
        setEndDate(value);
        setFilter({ name: nameFilter, priority: priorityFilter, startDate, endDate: value });
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="nameFilter" className="block text-gray-700 font-medium mb-2">
                    Filter by Name 🔍
                </label>
                <input
                    id="nameFilter"
                    type="text"
                    value={nameFilter}
                    onChange={handleNameChange}
                    placeholder="Search tasks by name..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
            </div>
            <div>
                <label htmlFor="priorityFilter" className="block text-gray-700 font-medium mb-2">
                    Filter by Priority ⭐
                </label>
                <select
                    id="priorityFilter"
                    value={priorityFilter}
                    onChange={handlePriorityChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    Filter by Date Range 📅
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        placeholder="Start Date"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        placeholder="End Date"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                </div>
            </div>
        </div>
    );
};

export default TodoFilter;