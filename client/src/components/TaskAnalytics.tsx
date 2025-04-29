import { useTasks } from "@/contexts/TaskContext";

export function TaskAnalytics() {
  const { tasks } = useTasks();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">
        Task Progress
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg text-center">
          <div className="text-3xl font-semibold text-primary">{totalTasks}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg text-center">
          <div className="text-3xl font-semibold text-green-600 dark:text-green-400">{completedTasks}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg text-center">
          <div className="text-3xl font-semibold text-gray-600 dark:text-gray-400">{completionRate}%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</div>
        </div>
      </div>
    </div>
  );
}
