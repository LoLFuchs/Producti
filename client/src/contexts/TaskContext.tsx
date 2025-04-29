import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { nanoid } from "nanoid";

interface TaskGroup {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  groupId: string | null;
  createdAt: string;
}

interface NewGroup {
  name: string;
  color: string;
}

interface TaskContextProps {
  tasks: Task[];
  groups: TaskGroup[];
  currentGroup: string;
  isAddGroupModalOpen: boolean;
  addTask: (text: string) => void;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string) => void;
  clearCompletedTasks: () => void;
  setCurrentGroup: (groupId: string) => void;
  addGroup: (group: NewGroup) => void;
  showAddGroupModal: () => void;
  hideAddGroupModal: () => void;
}

const defaultGroups: TaskGroup[] = [
  { id: 'work', name: 'Work', color: 'blue' },
  { id: 'personal', name: 'Personal', color: 'green' },
  { id: 'study', name: 'Study', color: 'purple' }
];

// Create context with default values
const TaskContext = createContext<TaskContextProps>({
  tasks: [],
  groups: defaultGroups,
  currentGroup: "all",
  isAddGroupModalOpen: false,
  addTask: () => {},
  toggleTaskCompleted: () => {},
  deleteTask: () => {},
  editTask: () => {},
  clearCompletedTasks: () => {},
  setCurrentGroup: () => {},
  addGroup: () => {},
  showAddGroupModal: () => {},
  hideAddGroupModal: () => {}
});

// Custom hook to use the task context
export const useTasks = () => useContext(TaskContext);

export function TaskProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return [];
    
    try {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        return JSON.parse(savedTasks) as Task[];
      }
    } catch (e) {
      console.error("Failed to parse tasks:", e);
    }
    return [];
  });

  const [groups, setGroups] = useState<TaskGroup[]>(() => {
    if (typeof window === "undefined") return defaultGroups;
    
    try {
      const savedGroups = localStorage.getItem("task-groups");
      if (savedGroups) {
        return JSON.parse(savedGroups) as TaskGroup[];
      }
    } catch (e) {
      console.error("Failed to parse groups:", e);
    }
    return defaultGroups;
  });

  const [currentGroup, setCurrentGroup] = useState<string>(() => {
    if (typeof window === "undefined") return "all";
    
    const savedGroup = localStorage.getItem("current-group");
    return savedGroup || "all";
  });

  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("task-groups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("current-group", currentGroup);
  }, [currentGroup]);

  // Filter tasks based on current group
  const filteredTasks = currentGroup === "all"
    ? tasks
    : tasks.filter(task => task.groupId === currentGroup);

  const addTask = (text: string) => {
    if (!text.trim()) return;
    
    const newTask: Task = {
      id: nanoid(),
      text: text.trim(),
      completed: false,
      groupId: currentGroup === "all" ? null : currentGroup,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const editTask = (id: string) => {
    if (typeof window === "undefined") return;
    
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newText = window.prompt("Edit task", task.text);
    if (newText === null) return;
    
    if (newText.trim()) {
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, text: newText.trim() } : task
        )
      );
    }
  };

  const clearCompletedTasks = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  const addGroup = (newGroup: NewGroup) => {
    if (!newGroup.name.trim()) return;
    
    const group: TaskGroup = {
      id: nanoid(),
      name: newGroup.name.trim(),
      color: newGroup.color
    };
    
    setGroups(prev => [...prev, group]);
    setCurrentGroup(group.id);
    hideAddGroupModal();
  };

  const showAddGroupModal = () => {
    setIsAddGroupModalOpen(true);
  };

  const hideAddGroupModal = () => {
    setIsAddGroupModalOpen(false);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: filteredTasks,
        groups,
        currentGroup,
        isAddGroupModalOpen,
        addTask,
        toggleTaskCompleted,
        deleteTask,
        editTask,
        clearCompletedTasks,
        setCurrentGroup,
        addGroup,
        showAddGroupModal,
        hideAddGroupModal
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}