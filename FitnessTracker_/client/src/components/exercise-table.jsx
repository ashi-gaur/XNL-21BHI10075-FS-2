import { useState } from 'react';
import { format } from 'date-fns';
import { workoutCategories } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import ExerciseForm from './exercise-form';

const ExerciseTable = ({ exercises, refetchExercises }) => {
  const { toast } = useToast();
  const [editingExercise, setEditingExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create a map for quick category lookups
  const categoryMap = {};
  workoutCategories.forEach(cat => {
    categoryMap[cat.id] = {
      name: cat.name,
      icon: cat.icon,
      color: getCategoryColor(cat.id)
    };
  });
  
  function getCategoryColor(categoryId) {
    switch(categoryId) {
      case 'cardio': return 'primary';
      case 'strength': return 'accent';
      case 'hiit': return 'success';
      case 'flexibility': return 'warning';
      case 'sports': return 'primary';
      default: return 'secondary';
    }
  }
  
  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        const response = await apiRequest('DELETE', `/api/exercises/${id}`);
        
        if (response.ok) {
          toast({
            title: "Exercise Deleted",
            description: "Your exercise has been successfully deleted."
          });
          refetchExercises();
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete exercise. Please try again."
        });
      }
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExercise(null);
  };
  
  const handleSuccess = () => {
    closeModal();
    refetchExercises();
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Exercise</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Calories</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {exercises.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-slate-500">
                    No exercises found. Add your first exercise!
                  </td>
                </tr>
              ) : (
                exercises.map(exercise => {
                  const category = categoryMap[exercise.category] || { name: 'Other', icon: 'ri-fitness-line', color: 'secondary' };
                  
                  return (
                    <tr key={exercise.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-md bg-${category.color}/10 flex items-center justify-center text-${category.color} mr-3`}>
                            <i className={category.icon}></i>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{exercise.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full bg-${category.color}/10 text-${category.color} font-medium`}>
                          {category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {exercise.duration} {exercise.durationUnit === 'min' ? 'minutes' : 'hours'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(exercise.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {exercise.calories} kcal
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(exercise)}
                          className="text-primary hover:text-primary-dark mr-2"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button 
                          onClick={() => handleDelete(exercise.id)}
                          className="text-danger hover:text-danger-dark"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && (
        <ExerciseForm 
          onClose={closeModal} 
          onSuccess={handleSuccess}
          editExercise={editingExercise}
        />
      )}
    </>
  );
};

export default ExerciseTable;
