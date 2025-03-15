const ExerciseCard = ({ exercise, onSelect }) => {
  // Map category IDs to their display properties
  const categoryMap = {
    cardio: { 
      icon: "ri-run-line", 
      color: "primary",
      label: "Cardio"
    },
    strength: { 
      icon: "ri-boxing-line", 
      color: "accent",
      label: "Strength"
    },
    flexibility: { 
      icon: "ri-yoga-line", 
      color: "warning",
      label: "Flexibility"
    },
    hiit: { 
      icon: "ri-heart-pulse-line", 
      color: "success",
      label: "HIIT"
    },
    sports: { 
      icon: "ri-basketball-line", 
      color: "primary",
      label: "Sports"
    },
    other: { 
      icon: "ri-fitness-line", 
      color: "secondary",
      label: "Other"
    }
  };
  
  // Default to "other" if category is not recognized
  const category = categoryMap[exercise.category] || categoryMap.other;
  const colorClass = category.color || "primary";
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect && onSelect(exercise)}
    >
      <div className="flex items-start">
        <div className={`w-12 h-12 rounded-lg bg-${colorClass}/10 flex items-center justify-center text-${colorClass} mr-4`}>
          <i className={`${category.icon} text-2xl`}></i>
        </div>
        <div>
          <h4 className="font-medium">{exercise.name}</h4>
          <p className="text-sm text-slate-500 mt-1">{exercise.description || 'No description'}</p>
          <div className="flex items-center mt-2">
            <span className={`px-2 py-0.5 text-xs rounded-full bg-${colorClass}/10 text-${colorClass}`}>
              {category.label}
            </span>
            {exercise.calories && (
              <span className="text-xs text-slate-500 ml-2">~{exercise.calories} kcal</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
