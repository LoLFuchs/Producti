import { useState, KeyboardEvent, useEffect } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function AddGroupModal() {
  const { isAddGroupModalOpen, hideAddGroupModal, addGroup } = useTasks();
  const [groupName, setGroupName] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  // Reset form when modal opens
  useEffect(() => {
    if (isAddGroupModalOpen) {
      setGroupName("");
      setSelectedColor("blue");
    }
  }, [isAddGroupModalOpen]);

  const handleGroupNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && groupName.trim()) {
      handleAddGroup();
    }
  };

  const handleAddGroup = () => {
    if (groupName.trim()) {
      addGroup({
        name: groupName.trim(),
        color: selectedColor
      });
      hideAddGroupModal();
    }
  };

  const colors = [
    { value: "red", displayName: "Red", bgClass: "bg-red-500" },
    { value: "yellow", displayName: "Yellow", bgClass: "bg-yellow-500" },
    { value: "green", displayName: "Green", bgClass: "bg-green-500" },
    { value: "blue", displayName: "Blue", bgClass: "bg-blue-500" },
    { value: "purple", displayName: "Purple", bgClass: "bg-purple-500" }
  ];

  return (
    <Dialog open={isAddGroupModalOpen} onOpenChange={hideAddGroupModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Add New Group
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="group-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Group Name
            </Label>
            <Input 
              type="text" 
              id="group-name" 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={handleGroupNameKeyDown}
              placeholder="Enter group name"
              className="mt-1 dark:bg-gray-700"
              autoFocus
            />
          </div>
          
          <div>
            <Label htmlFor="group-color" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Color
            </Label>
            <div className="mt-1 grid grid-cols-5 gap-2">
              {colors.map(color => (
                <button 
                  key={color.value}
                  className={`w-8 h-8 ${color.bgClass} rounded-full focus:outline-none ${
                    selectedColor === color.value 
                      ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800' 
                      : ''
                  }`}
                  onClick={() => setSelectedColor(color.value)}
                  aria-label={`Select ${color.displayName} color`}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end flex space-x-2">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleAddGroup}
            disabled={!groupName.trim()}
          >
            Add Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
