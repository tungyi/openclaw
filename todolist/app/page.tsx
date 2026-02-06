"use client";

import { useState, useEffect } from 'react';

// A simple type for our todo items
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const TODO_APP_STORAGE_KEY = 'my-todolist-items';

export default function Home() {
  // Lazily initialize state from localStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTodos = localStorage.getItem(TODO_APP_STORAGE_KEY);
      if (savedTodos) {
        try {
          return JSON.parse(savedTodos);
        } catch (e) {
          console.error("Failed to parse todos from localStorage", e);
          return [];
        }
      }
    }
    return [];
  });
  
  const [newTodo, setNewTodo] = useState('');

  // Effect to save todos to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TODO_APP_STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24 bg-black font-mono">
      <div className="w-full max-w-2xl">
        <h1 
          className="text-4xl font-bold text-center mb-8 text-cyan-400"
          style={{ textShadow: '0 0 5px #06b6d4, 0 0 10px #06b6d4' }}
        >
          My Todolist 🤓
        </h1>
        
        {/* Input and Add Button */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="> What needs to be done?"
            className="flex-grow p-4 bg-gray-900 border-2 border-cyan-500/50 rounded-none text-cyan-300 placeholder-cyan-700/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-2 bg-transparent border-2 border-cyan-500 text-cyan-400 font-bold rounded-none transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.8)]"
          >
            ADD
          </button>
        </div>

        {/* Todo List */}
        <div className="bg-gray-900/50 border-2 border-fuchsia-500/50 p-1 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
          <ul className="divide-y divide-fuchsia-500/30">
            {todos.length > 0 ? (
              todos.map(todo => (
                <li key={todo.id} className="flex items-center justify-between p-4 group">
                  <span
                    className={`flex-grow cursor-pointer text-lg transition-colors ${todo.completed ? 'line-through text-gray-600' : 'text-fuchsia-300 group-hover:text-white'}`}
                    onClick={() => handleToggleTodo(todo.id)}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="ml-4 px-3 py-1 text-sm bg-transparent border border-fuchsia-500 text-fuchsia-400 rounded-none opacity-50 group-hover:opacity-100 transition-opacity hover:bg-fuchsia-500 hover:text-black"
                  >
                    DEL
                  </button>
                </li>
              ))
            ) : (
              <p className="p-8 text-center text-gray-700">// NO TASKS PENDING... SYSTEM IDLE //</p>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
