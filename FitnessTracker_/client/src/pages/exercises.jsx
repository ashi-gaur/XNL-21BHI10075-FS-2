import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ExerciseTable from '@/components/exercise-table';
import ExerciseForm from '@/components/exercise-form';

const Exercises = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch exercise data
  const { data: exercises = [], refetch: refetchExercises } = useQuery({
    queryKey: ['/api/exercises'],
  });
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleExerciseAdded = () => {
    closeModal();
    refetchExercises();
  };
  
  return (
    <main className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Your Workouts</h1>
        <p className="text-slate-500">View and manage all your exercises in one place</p>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search exercises..." 
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="ri-search-line text-slate-400"></i>
            </div>
          </div>
          
          <select className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
            <option>All Time</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
          </select>
        </div>
        
        <button 
          onClick={openModal}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium"
        >
          <i className="ri-add-line mr-1"></i> Add Exercise
        </button>
      </div>
      
      <div className="bg-white rounded-xl p-4 md:p-6 shadow">
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-medium">Filter by:</span>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            <i className="ri-filter-line"></i>
            <span>All Categories</span>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1 hover:bg-slate-100 rounded-full text-sm cursor-pointer">
            <i className="ri-run-line text-primary"></i>
            <span>Cardio</span>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1 hover:bg-slate-100 rounded-full text-sm cursor-pointer">
            <i className="ri-boxing-line text-accent"></i>
            <span>Strength</span>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1 hover:bg-slate-100 rounded-full text-sm cursor-pointer">
            <i className="ri-heart-pulse-line text-success"></i>
            <span>HIIT</span>
          </div>
        </div>
        
        <ExerciseTable exercises={exercises} refetchExercises={refetchExercises} />
      </div>
      
      {isModalOpen && (
        <ExerciseForm onClose={closeModal} onSuccess={handleExerciseAdded} />
      )}
    </main>
  );
};

export default Exercises;
