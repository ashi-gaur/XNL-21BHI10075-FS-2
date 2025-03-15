import { useState } from 'react';
import { workoutCategories } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const ExerciseForm = ({ onClose, onSuccess, editExercise = null }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form state with edit data or defaults
  const [form, setForm] = useState({
    name: editExercise?.name || '',
    category: editExercise?.category || '',
    duration: editExercise?.duration || '',
    durationUnit: editExercise?.durationUnit || 'min',
    calories: editExercise?.calories || '',
    date: editExercise?.date ? new Date(editExercise.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    notes: editExercise?.notes || '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!form.name || !form.category || !form.duration || !form.date) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill out all required fields."
        });
        return;
      }
      
      // Parse values that need to be numbers
      const payload = {
        ...form,
        duration: parseInt(form.duration),
        calories: form.calories ? parseInt(form.calories) : 0,
        date: new Date(form.date)
      };
      
      // Determine if creating new or updating existing
      let response;
      if (editExercise) {
        response = await apiRequest('PATCH', `/api/exercises/${editExercise.id}`, payload);
      } else {
        response = await apiRequest('POST', '/api/exercises', payload);
      }
      
      if (response.ok) {
        toast({
          title: editExercise ? "Exercise Updated" : "Exercise Added",
          description: editExercise 
            ? "Your exercise has been successfully updated." 
            : "Your new exercise has been added successfully."
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save exercise. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative z-10 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{editExercise ? 'Edit Exercise' : 'Add New Exercise'}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="exerciseType" className="block text-sm font-medium text-slate-700 mb-1">Exercise Type</label>
              <div className="relative">
                <select 
                  id="exerciseType" 
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 pr-10 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                >
                  <option value="">Select exercise type</option>
                  {workoutCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i className="ri-arrow-down-s-line text-slate-400"></i>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="exerciseName" className="block text-sm font-medium text-slate-700 mb-1">Exercise Name</label>
              <input 
                type="text" 
                id="exerciseName" 
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter exercise name" 
                className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                <div className="flex">
                  <input 
                    type="number" 
                    id="duration" 
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="Duration" 
                    className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-l-lg text-slate-700 focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <div className="inline-flex items-center px-3 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg">
                    <select 
                      id="durationUnit" 
                      name="durationUnit"
                      value={form.durationUnit}
                      onChange={handleChange}
                      className="bg-transparent text-slate-700 focus:outline-none"
                    >
                      <option value="min">min</option>
                      <option value="hr">hr</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="calories" className="block text-sm font-medium text-slate-700 mb-1">Calories</label>
                <div className="flex">
                  <input 
                    type="number" 
                    id="calories" 
                    name="calories"
                    value={form.calories}
                    onChange={handleChange}
                    placeholder="Calories" 
                    className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-l-lg text-slate-700 focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <div className="inline-flex items-center px-3 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg text-slate-700">
                    kcal
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="exerciseDate" className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
              <input 
                type="datetime-local" 
                id="exerciseDate" 
                name="date"
                value={form.date}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
              <textarea 
                id="notes" 
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="3" 
                placeholder="Add any additional notes" 
                className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-primary focus:border-primary"
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : (editExercise ? 'Update Exercise' : 'Save Exercise')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExerciseForm;
