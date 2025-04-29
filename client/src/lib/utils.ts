import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function calculateProgress(current: number, total: number): number {
  return (total - current) / total;
}

export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHours = Math.floor(diffInMin / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSec < 60) {
    return 'Just now';
  } else if (diffInMin < 60) {
    return `Added ${diffInMin} minute${diffInMin > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `Added ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays === 1) {
    return 'Added yesterday';
  } else {
    return `Added ${diffInDays} days ago`;
  }
}

export function getGroupColorClass(color: string): {
  bg: string,
  text: string
} {
  const colorMap: Record<string, {
    bg: string,
    text: string
  }> = {
    red: {
      bg: 'bg-red-100 dark:bg-red-800',
      text: 'text-red-800 dark:text-red-100'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-100'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-800',
      text: 'text-green-800 dark:text-green-100'
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-800',
      text: 'text-blue-800 dark:text-blue-100'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-800',
      text: 'text-purple-800 dark:text-purple-100'
    }
  };

  return colorMap[color] || colorMap.blue;
}
