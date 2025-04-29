import { useState, KeyboardEvent } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TaskInput() {
  const { addTask, groups, currentGroup, setCurrentGroup, showAddGroupModal } = useTasks();
  const [taskText, setTaskText] = useState("");

  const handleTaskInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && taskText.trim()) {
      addTask(taskText);
      setTaskText("");
    }
  };

  const handleAddTask = () => {
    if (taskText.trim()) {
      addTask(taskText);
      setTaskText("");
    }
  };

  const handleGroupChange = (value: string) => {
    if (value === "add-new") {
      showAddGroupModal();
    } else {
      setCurrentGroup(value);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="task-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Add New Task
          </Label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <Input
              type="text"
              id="task-input"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              onKeyDown={handleTaskInputKeyDown}
              placeholder="What needs to be done?"
              className="rounded-r-none dark:bg-gray-700"
            />
            <Button
              onClick={handleAddTask}
              className="rounded-l-none"
              disabled={!taskText.trim()}
            >
              Add
            </Button>
          </div>
        </div>
        
        <div>
          <Label htmlFor="task-group" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Group/Project
          </Label>
          <Select
            value={currentGroup} 
            onValueChange={handleGroupChange}
          >
            <SelectTrigger id="task-group" className="mt-1 w-full dark:bg-gray-700">
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
              <SelectItem value="add-new">+ Add New Group</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
