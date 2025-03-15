import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Chart } from 'chart.js/auto';
import MetricCard from '@/components/ui/site/metric-card';
import ActivityCard from '@/components/ui/site/activity-card';
import ExerciseTable from '@/components/exercise-table';
import ExerciseForm from '@/components/exercise-form';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  // Fetch exercise data
  const { data: exercises = [], refetch: refetchExercises } = useQuery({
    queryKey: ['/api/exercises'],
  });
  
  // Fetch stats data
  const { data: stats = { weeklyExercises: 0, activeHours: 0, totalCalories: 0, recentActivities: [] } } = useQuery({
    queryKey: ['/api/stats'],
  });
  
  // Set up workout progress chart
  useEffect(() => {
    if (chartRef.current && exercises.length > 0) {
      // Clean up previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Prepare data for chart - last 7 days
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i));
        return date;
      });
      
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const labels = last7Days.map(date => dayLabels[date.getDay()]);
      
      // Calculate exercise durations by day
      const durationByDay = last7Days.map(date => {
        const dayExercises = exercises.filter(ex => {
          const exDate = new Date(ex.date);
          return exDate.getDate() === date.getDate() && 
                 exDate.getMonth() === date.getMonth() && 
                 exDate.getFullYear() === date.getFullYear();
        });
        
        // Convert all durations to minutes for consistent tracking
        return dayExercises.reduce((total, ex) => {
          if (ex.durationUnit === 'hr') {
            return total + (ex.duration * 60);
          }
          return total + ex.duration;
        }, 0);
      });
      
      // Calculate calories by day
      const caloriesByDay = last7Days.map(date => {
        const dayExercises = exercises.filter(ex => {
          const exDate = new Date(ex.date);
          return exDate.getDate() === date.getDate() && 
                 exDate.getMonth() === date.getMonth() && 
                 exDate.getFullYear() === date.getFullYear();
        });
        
        return dayExercises.reduce((total, ex) => total + (ex.calories || 0), 0);
      });
      
      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Workout Duration (min)',
              data: durationByDay,
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              borderColor: '#0EA5E9',
              borderWidth: 2,
              tension: 0.3,
              fill: true
            },
            {
              label: 'Calories Burned',
              data: caloriesByDay,
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              borderColor: '#F97316',
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Duration (min)'
              }
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              title: {
                display: true,
                text: 'Calories'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 10,
                usePointStyle: true
              }
            }
          }
        }
      });
    }
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [exercises]);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleExerciseAdded = () => {
    closeModal();
    refetchExercises();
  };
  
  // Just showing the 3 most recent exercises on dashboard
  const recentExercises = exercises.slice(0, 3);
  
  return (
    <main className="p-4 md:p-6">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard 
          title="Weekly Workouts" 
          value={stats.weeklyExercises || 0} 
          icon="ri-calendar-line" 
          trend="up" 
          percent={12}
        />
        
        <MetricCard 
          title="Active Hours" 
          value={stats.activeHours || 0} 
          icon="ri-time-line" 
          trend="up" 
          percent={8}
        />
        
        <MetricCard 
          title="Calories Burned" 
          value={stats.totalCalories || 0} 
          icon="ri-fire-line" 
          trend="down" 
          percent={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="bg-white rounded-xl shadow-sm p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Workout Progress</h3>
            <div className="flex text-sm">
              <button className="px-2 py-1 rounded text-primary bg-primary/10 font-medium">Week</button>
              <button className="px-2 py-1 rounded text-slate-500 hover:bg-slate-100">Month</button>
              <button className="px-2 py-1 rounded text-slate-500 hover:bg-slate-100">Year</button>
            </div>
          </div>
          <div className="h-60">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Activity Summary</h3>
            <button className="text-sm text-primary font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentExercises.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                No activities to show. Start adding your exercises!
              </div>
            ) : (
              recentExercises.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Exercise Tracking Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Exercise Tracking</h3>
          <button 
            onClick={openModal}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium"
          >
            <i className="ri-add-line mr-1"></i> Add Exercise
          </button>
        </div>

        <ExerciseTable exercises={exercises} refetchExercises={refetchExercises} />
      </div>
      
      {isModalOpen && (
        <ExerciseForm onClose={closeModal} onSuccess={handleExerciseAdded} />
      )}
    </main>
  );
};

export default Dashboard;
