import { useLocation, Link } from "wouter";

const Sidebar = ({ isMobileOpen, closeMobileMenu }) => {
  const [location] = useLocation();
  
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { path: "/exercises", label: "Workouts", icon: "ri-heart-pulse-line" },
    { path: "/library", label: "Exercises", icon: "ri-fire-line" },
    { path: "/settings", label: "Settings", icon: "ri-settings-4-line" },
  ];
  
  return (
    <aside className={`fixed inset-y-0 left-0 z-10 w-64 bg-secondary text-white transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <i className="ri-pulse-line text-2xl text-primary"></i>
          <h1 className="text-xl font-bold">FitTrack</h1>
        </div>
        <button className="md:hidden text-white" onClick={closeMobileMenu}>
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>
      
      <div className="mt-6">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              JS
            </div>
            <div>
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-slate-400">Premium Plan</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                location === item.path
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-300 hover:bg-primary/10 hover:text-primary'
              } transition-colors`}
            >
              <i className={`${item.icon} text-xl`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
          <i className="ri-logout-box-line text-xl"></i>
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
