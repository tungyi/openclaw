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
    // This function only runs on the client, once
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
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">My Todolist 🤓</h1>
        
        {/* Input and Add Button */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="What needs to be done?"
            className="flex-grow p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-lg shadow-md dark:bg-gray-800">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {todos.length > 0 ? (
              todos.map(todo => (
                <li key={todo.id} className="flex items-center justify-between p-4">
                  <span
                    className={`flex-grow cursor-pointer ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}
                    onClick={() => handleToggleTodo(todo.id)}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="ml-4 px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p className="p-4 text-gray-500 text-center dark:text-gray-400">No todos yet. Add one above!</p>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
