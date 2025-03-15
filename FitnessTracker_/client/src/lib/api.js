import { apiRequest } from './queryClient';

// Exercise-related API functions
export const exerciseApi = {
  // Get all exercises
  getAll: async () => {
    const response = await apiRequest('GET', '/api/exercises');
    return response.json();
  },
  
  // Get a single exercise by ID
  getById: async (id) => {
    const response = await apiRequest('GET', `/api/exercises/${id}`);
    return response.json();
  },
  
  // Create a new exercise
  create: async (exercise) => {
    const response = await apiRequest('POST', '/api/exercises', exercise);
    return response.json();
  },
  
  // Update an existing exercise
  update: async (id, exercise) => {
    const response = await apiRequest('PATCH', `/api/exercises/${id}`, exercise);
    return response.json();
  },
  
  // Delete an exercise
  delete: async (id) => {
    return apiRequest('DELETE', `/api/exercises/${id}`);
  }
};

// Dashboard stats API functions
export const statsApi = {
  // Get dashboard stats
  get: async () => {
    const response = await apiRequest('GET', '/api/stats');
    return response.json();
  }
};

// Format data for charts
export const formatChartData = (exercises) => {
  // Get last 7 days
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return date;
  });
  
  // Day labels (Sun, Mon, etc.)
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const labels = last7Days.map(date => dayLabels[date.getDay()]);
  
  // Initialize data arrays with zeros
  const durationByDay = Array(7).fill(0);
  const caloriesByDay = Array(7).fill(0);
  
  // Fill in data from exercises
  exercises.forEach(exercise => {
    const exerciseDate = new Date(exercise.date);
    
    // Check if exercise is within the last 7 days
    for (let i = 0; i < 7; i++) {
      const day = last7Days[i];
      if (exerciseDate.getDate() === day.getDate() && 
          exerciseDate.getMonth() === day.getMonth() && 
          exerciseDate.getFullYear() === day.getFullYear()) {
        
        // Convert all durations to minutes for consistency
        if (exercise.durationUnit === 'hr') {
          durationByDay[i] += (exercise.duration * 60);
        } else {
          durationByDay[i] += exercise.duration;
        }
        
        caloriesByDay[i] += (exercise.calories || 0);
        break;
      }
    }
  });
  
  return {
    labels,
    durationByDay,
    caloriesByDay
  };
};
