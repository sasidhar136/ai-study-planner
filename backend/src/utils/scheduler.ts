export interface Task {
  id: string;
  title: string;
  dueDate: Date | null;
  estimatedHours: number;
  priority: string;
}

export interface ScheduleAllocation {
  taskId: string;
  date: Date;
  hours: number;
}

const DAILY_LIMIT = 4;

/**
 * Generates a study schedule by sorting tasks by urgency and 
 * allocating them into daily time blocks, considering user energy types.
 */
export const generateScheduleLogic = (tasks: Task[], energyType: string = "morning"): ScheduleAllocation[] => {
  // 1. Sort tasks by urgency (due date) primarily
  const sortedTasks = [...tasks].sort((a, b) => {
    // Due date comparison
    if (a.dueDate && b.dueDate) {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      if (dateA !== dateB) return dateA - dateB;
    } else if (a.dueDate) {
      return -1;
    } else if (b.dueDate) {
      return 1;
    }

    // Secondary sort by priority if dates are same or null
    const priorityMap: Record<string, number> = { "HIGH": 3, "MEDIUM": 2, "LOW": 1 };
    const pA = priorityMap[a.priority] || 2;
    const pB = priorityMap[b.priority] || 2;
    
    return pB - pA; // Higher priority first by default for overall list
  });

  const allocations: ScheduleAllocation[] = [];
  
  // Start from today at 00:00:00
  let currentDay = new Date();
  currentDay.setHours(0, 0, 0, 0);
  
  let currentDayUsedHours = 0;

  // We group tasks by day to handle energy-based reordering within each day
  // But the current algorithm is "greedy" (fill day by day).
  // To implement energy-based planning "Easy", we'll adjust the task list 
  // so that High priority tasks are moved to the front (morning) or back (night) 
  // of the "possible tasks for that day". 
  
  // However, for simplicity and to match the user's "Energy-Based Planning" request:
  // "if morning: assign hard tasks early", "if night: assign hard tasks later".
  // We will re-sort the tasks such that HIGH priority ones are at the absolute start (morning)
  // or relative end (night) of the queue.
  
  const finalSortedTasks = [...sortedTasks].sort((a, b) => {
    const priorityMap: Record<string, number> = { "HIGH": 3, "MEDIUM": 2, "LOW": 1 };
    const pA = priorityMap[a.priority] || 2;
    const pB = priorityMap[b.priority] || 2;

    if (energyType === "morning") {
      // In morning mode, we want High priority tasks to be at the very top of the list
      // so they get picked up first in the daily allocation.
      return pB - pA; 
    } else {
      // In night mode, we want High priority tasks to be pushed later.
      // However, we still need to respect due dates. 
      // If dates are same, put High priority LAST.
      return pA - pB;
    }
  });

  // Re-run the date-aware sort but with energy influence
  finalSortedTasks.sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      if (dateA !== dateB) return dateA - dateB;
    }
    
    const priorityMap: Record<string, number> = { "HIGH": 3, "MEDIUM": 2, "LOW": 1 };
    const pA = priorityMap[a.priority] || 2;
    const pB = priorityMap[b.priority] || 2;

    if (energyType === "morning") {
      return pB - pA;
    } else {
      return pA - pB;
    }
  });

  for (const task of finalSortedTasks) {
    let remainingTaskHours = task.estimatedHours;

    while (remainingTaskHours > 0) {
      const availableHoursInDay = DAILY_LIMIT - currentDayUsedHours;

      if (availableHoursInDay > 0) {
        const hoursToAllocate = Math.min(remainingTaskHours, availableHoursInDay);
        
        allocations.push({
          taskId: task.id,
          date: new Date(currentDay),
          hours: Number(hoursToAllocate.toFixed(1))
        });

        remainingTaskHours -= hoursToAllocate;
        currentDayUsedHours += hoursToAllocate;
      }

      if (currentDayUsedHours >= DAILY_LIMIT - 0.01) {
        currentDay = new Date(currentDay);
        currentDay.setDate(currentDay.getDate() + 1);
        currentDayUsedHours = 0;
      }
    }
  }

  return allocations;
};
