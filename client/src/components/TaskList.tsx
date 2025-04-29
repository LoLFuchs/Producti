import { useState } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { getGroupColorClass, getRelativeTimeString } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TaskFilter = 'all' | 'active' | 'completed';

export function TaskList() {
  const { 
    tasks, 
    groups, 
    toggleTaskCompleted, 
    deleteTask, 
    clearCompletedTasks,
    editTask
  } = useTasks();
  
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'active') return !task.completed;
    if (taskFilter === 'completed') return task.completed;
    return true;
  });

  const activeTasksCount = tasks.filter(task => !task.completed).length;

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
    }
    setShowDeleteDialog(false);
  };

  const handleClearCompleted = () => {
    setShowClearDialog(true);
  };

  const confirmClearCompleted = () => {
    clearCompletedTasks();
    setShowClearDialog(false);
  };

  const getGroupName = (groupId: string | null) => {
    if (!groupId) return null;
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : null;
  };

  const getGroupColor = (groupId: string | null) => {
    if (!groupId) return 'blue';
    const group = groups.find(g => g.id === groupId);
    return group ? group.color : 'blue';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
          Your Tasks
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant={taskFilter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setTaskFilter('all')}
            className="text-xs"
          >
            All
          </Button>
          <Button 
            variant={taskFilter === 'active' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setTaskFilter('active')}
            className="text-xs"
          >
            Active
          </Button>
          <Button 
            variant={taskFilter === 'completed' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setTaskFilter('completed')}
            className="text-xs"
          >
            Completed
          </Button>
        </div>
      </div>
      
      <div className="task-list-container">
        <AnimatePresence>
          {filteredTasks.length > 0 ? (
            <ul className="space-y-2">
              {filteredTasks.map(task => {
                const groupColor = getGroupColorClass(getGroupColor(task.groupId));
                
                return (
                  <motion.li 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group bg-gray-50 dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-750 p-3 rounded-lg transition duration-150 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id={`task-${task.id}`}
                        checked={task.completed} 
                        onCheckedChange={() => toggleTaskCompleted(task.id)}
                        className="h-5 w-5"
                      />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                          {task.text}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {task.groupId && getGroupName(task.groupId) && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${groupColor.bg} ${groupColor.text}`}>
                              {getGroupName(task.groupId)}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {getRelativeTimeString(new Date(task.createdAt))}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => editTask(task.id)}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                          aria-label="Edit task"
                        >
                          <Pencil className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                          aria-label="Delete task"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No tasks found.
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <div>{activeTasksCount} {activeTasksCount === 1 ? 'task' : 'tasks'} left</div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearCompleted}
          className="hover:text-gray-700 dark:hover:text-gray-300 h-auto p-0"
        >
          Clear completed
        </Button>
      </div>

      {/* Delete Task Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Completed Confirmation */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear completed tasks?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all completed tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearCompleted}>Clear</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
