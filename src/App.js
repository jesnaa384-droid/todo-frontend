import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/tasks")
      .then(res => setTasks(res.data))
      .catch(err => console.log(err));
  }, []);

  const addTask = () => {
    if (!task.trim()) return;

    axios.post("http://127.0.0.1:5000/tasks", {
      text: task,
      completed: false
    })
    .then(res => {
      setTasks([...tasks, res.data]);
      setTask("");
    })
    .catch(err => console.log("ADD ERROR:", err));
  };

  const toggleTask = (t) => {
    axios.put(`http://127.0.0.1:5000/tasks/${t._id}`, {
      completed: !t.completed
    })
    .then(res => {
      setTasks(tasks.map(x => x._id === t._id ? res.data : x));
    })
    .catch(err => console.log(err));
  };

  const deleteTask = (id) => {
    axios.delete(`http://127.0.0.1:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter(t => t._id !== id)))
      .catch(err => console.log(err));
  };

  return (
    <div className="container">
      <h2>Todo App</h2>

      <div className="input">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
        />
        <button onClick={addTask}>+</button>
      </div>

      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleTask(t)}
            />

            <span className={t.completed ? "done" : ""}>
              {t.text}
            </span>

            <button onClick={() => deleteTask(t._id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;