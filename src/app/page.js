"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, CheckCircle2, Circle, Plus, Edit } from "lucide-react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/todos";

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(API_URL, { title });
      setTitle("");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      await axios.put(`${API_URL}/${todo._id}`, { ...todo, completed: !todo.completed });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex justify-center font-sans">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
          Tasks
        </h1>

        <form onSubmit={addTodo} className="flex gap-4 mb-8">
          <input
            type="text"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 px-6 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={20} /> Add
          </button>
        </form>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className={`flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 transition-all ${
                todo.completed ? "opacity-50" : ""
              }`}
            >
              <button onClick={() => toggleTodo(todo)} className="text-blue-400">
                {todo.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              
              <span className={`flex-1 text-lg ${todo.completed ? "line-through text-slate-500" : ""}`}>
                {todo.title}
              </span>

              <button
                onClick={() => deleteTodo(todo._id)}
                className="text-slate-500 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          
          {todos.length === 0 && (
            <div className="text-center text-slate-500 py-10">No tasks yet. Create one!</div>
          )}
        </div>
      </div>
    </div>
  );
}
