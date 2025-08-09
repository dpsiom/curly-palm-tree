import { useState, useEffect } from 'react';
import styles from '../styles/KanbanBoard.module.css';

const columns = [
  { key: 'todo', label: 'To Do', color: '#f8d7da' },
  { key: 'inprogress', label: 'In Progress', color: '#fff3cd' },
  { key: 'done', label: 'Done', color: '#d4edda' },
];

function loadTasks() {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem("kanban-tasks-next");
  return saved ? JSON.parse(saved) : [];
}

function saveTasks(tasks) {
  localStorage.setItem("kanban-tasks-next", JSON.stringify(tasks));
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", desc: "", column: "todo" });
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    if (tasks.length) saveTasks(tasks);
  }, [tasks]);

  const addTask = e => {
    e.preventDefault();
    setTasks([...tasks, { ...newTask, id: Date.now(), comments: [] }]);
    setNewTask({ title: "", desc: "", column: "todo" });
  };

  const addComment = (taskId, comment) => {
    setTasks(tasks =>
      tasks.map(task =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, comment] }
          : task
      )
    );
    setNewComments({ ...newComments, [taskId]: "" });
  };

  const moveTask = (taskId, toColumn) => {
    setTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, column: toColumn } : task
      )
    );
  };

  return (
    <div className={styles.boardOuter}>
      {columns.map(col => (
        <div
          key={col.key}
          className={styles.column}
          style={{ background: col.color }}
        >
          <h3>{col.label}</h3>
          {tasks
            .filter(task => task.column === col.key)
            .map(task => (
              <div className={styles.task} key={task.id}>
                <b>{task.title}</b>
                <p>{task.desc}</p>
                <div>
                  <small>Comments:</small>
                  <ul>
                    {task.comments.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (newComments[task.id]?.trim())
                        addComment(task.id, newComments[task.id]);
                    }}>
                    <input
                      value={newComments[task.id] || ""}
                      onChange={e =>
                        setNewComments({ ...newComments, [task.id]: e.target.value })
                      }
                      placeholder="Add comment"
                    />
                    <button type="submit">+</button>
                  </form>
                </div>
                <div style={{ marginTop: 7 }}>
                  {columns
                    .filter(c => c.key !== col.key)
                    .map(c => (
                      <button
                        key={c.key}
                        onClick={() => moveTask(task.id, c.key)}
                        style={{ margin: '2px 4px', fontSize: 12 }}
                      >
                        &rarr; {c.label}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          <hr />
          {col.key === "todo" && (
            <form onSubmit={addTask} className={styles.addTaskForm}>
              <input
                required
                placeholder="Title"
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value })}
              />
              <input
                required
                placeholder="Description"
                value={newTask.desc}
                onChange={e => setNewTask({...newTask, desc: e.target.value })}
              />
              <button type="submit">Add</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}
