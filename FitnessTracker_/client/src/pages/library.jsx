import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ExerciseCard from '@/components/ui/site/exercise-card';
import ExerciseForm from '@/components/exercise-form';
import { workoutCategories } from '@shared/schema';

// Predefined library of exercises
const exerciseLibrary = [
  {
    id: 'lib-1',
    name: 'Running',
    category: 'cardio',
    description: 'Outdoor cardio activity',
    calories: 500,
    isTemplate: true
  },
  {
    id: 'lib-2',
    name: 'Push-ups',
    category: 'strength',
    description: 'Upper body strength exercise',
    calories: 100,
    isTemplate: true
  },
  {
    id: 'lib-3',
    name: 'Burpees',
    category: 'hiit',
    description: 'Full body HIIT exercise',
    calories: 600,
    isTemplate: true
  },
  {
    id: 'lib-4',
    name: 'Squats',
    category: 'strength',
    description: 'Lower body strength exercise',
    calories: 200,
    isTemplate: true
  },
  {
    id: 'lib-5',
    name: 'Cycling',
    category: 'cardio',
    description: 'Indoor or outdoor cycling',
    calories: 400,
    isTemplate: true
  },
  {
    id: 'lib-6',
    name: 'Yoga',
    category: 'flexibility',
    description: 'Mind-body flexibility training',
    calories: 150,
    isTemplate: true
  },
  {
    id: 'lib-7',
    name: 'Swimming',
    category: 'cardio',
    description: 'Full body water-based exercise',
    calories: 450,
    isTemplate: true
  },
  {
    id: 'lib-8',
    name: 'Bench Press',
    category: 'strength',
    description: 'Upper body strength training',
    calories: 180,
    isTemplate: true
  },
  {
    id: 'lib-9',
    name: 'Jumping Rope',
    category: 'cardio',
    description: 'High-intensity cardio exercise',
    calories: 350,
    isTemplate: true
  }
];

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Fetch user's exercises
  const { refetch: refetchExercises } = useQuery({
    queryKey: ['/api/exercises'],
  });
  
  // Filter exercises based on search and category
  const filteredExercises = exerciseLibrary.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  const handleSelectExercise = (exercise) => {
    setSelectedTemplate({
      ...exercise,
      date: new Date(),
      duration: 30,
      durationUnit: 'min',
    });
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };
  
  const handleExerciseAdded = () => {
    closeModal();
    refetchExercises();
  };
  
  return (
    <main className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Exercise Library</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search exercises..." 
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="ri-search-line text-slate-400"></i>
            </div>
          </div>
          <select 
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="all">All Categories</option>
            {workoutCategories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-slate-500">
            No exercises found for your search. Try a different term or category.
          </div>
        ) : (
          filteredExercises.map(exercise => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              onSelect={handleSelectExercise}
            />
          ))
        )}
      </div>
      
      {isModalOpen && selectedTemplate && (
        <ExerciseForm 
          onClose={closeModal} 
          onSuccess={handleExerciseAdded}
          editExercise={selectedTemplate}
        />
      )}
    </main>
  );
};

export default Library;
