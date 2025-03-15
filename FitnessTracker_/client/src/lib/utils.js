// Generic utility functions for the application
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for combining Tailwind CSS classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};

// Calculate the calories burned based on exercise type, duration, and user's weight
export const calculateCalories = (exerciseType, durationMinutes, weightKg = 70) => {
  // MET values (Metabolic Equivalent of Task) for different exercises
  const metValues = {
    cardio: 8, // running (~8 km/h)
    strength: 4, // moderate effort
    flexibility: 2.5, // yoga
    hiit: 10, // very vigorous
    sports: 6, // varies by sport, this is an average
    other: 4 // moderate effort as default
  };
  
  // Formula: Calories = MET value × weight (kg) × duration (hours)
  const met = metValues[exerciseType] || metValues.other;
  const durationHours = durationMinutes / 60;
  
  return Math.round(met * weightKg * durationHours);
};

// Generate a color based on category for consistent UI
export const getCategoryColor = (category) => {
  const colorMap = {
    cardio: 'primary',
    strength: 'accent',
    flexibility: 'warning',
    hiit: 'success',
    sports: 'primary',
    other: 'secondary'
  };
  
  return colorMap[category] || 'secondary';
};

// Format duration for display
export const formatDuration = (duration, unit) => {
  if (unit === 'hr') {
    return `${duration} ${duration === 1 ? 'hour' : 'hours'}`;
  }
  return `${duration} ${duration === 1 ? 'minute' : 'minutes'}`;
};
