const MetricCard = ({ title, value, icon, trend, percent }) => {
  const trendColor = trend === 'up' ? 'text-success' : 'text-danger';
  const trendIcon = trend === 'up' ? 'ri-arrow-up-line' : 'ri-arrow-down-line';
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-1 font-display font-bold text-3xl">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
      {percent !== undefined && (
        <div className="mt-4 flex items-center">
          <span className={`text-xs font-medium ${trendColor} flex items-center`}>
            <i className={`${trendIcon} mr-1`}></i>
            {percent}%
          </span>
          <span className="text-xs text-slate-500 ml-2">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
