import { formatDistanceToNow } from 'date-fns';

const ActivityCard = ({ activity }) => {
  // Map category IDs to icon data
  const categoryIconMap = {
    cardio: { icon: "ri-run-line", color: "primary" },
    strength: { icon: "ri-boxing-line", color: "accent" },
    flexibility: { icon: "ri-yoga-line", color: "warning" },
    hiit: { icon: "ri-heart-pulse-line", color: "success" },
    sports: { icon: "ri-basketball-line", color: "primary" },
    other: { icon: "ri-fitness-line", color: "secondary" }
  };
  
  // Default to "other" if category is not recognized
  const iconData = categoryIconMap[activity.category] || categoryIconMap.other;
  
  // Format date relative to now (today, yesterday, 2 days ago, etc.)
  const formattedDate = formatDistanceToNow(new Date(activity.date), { addSuffix: true });
  
  // Format duration display
  const formatDuration = () => {
    if (activity.durationUnit === 'hr') {
      return `${activity.duration} hr`;
    }
    return `${activity.duration} min`;
  };
  
  return (
    <div className="flex items-center p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
      <div className={`w-10 h-10 rounded-lg bg-${iconData.color}/10 flex items-center justify-center text-${iconData.color} mr-4`}>
        <i className={`${iconData.icon} text-xl`}></i>
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{activity.name}</h4>
        <div className="flex items-center text-sm text-slate-500">
          {activity.calories && <span>{activity.calories} kcal</span>}
          <span className="mx-2">•</span>
          <span>{formatDuration()}</span>
        </div>
      </div>
      <span className="text-xs text-slate-500">{formattedDate}</span>
    </div>
  );
};

export default ActivityCard;
