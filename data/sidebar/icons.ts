// Map icon names to dynamic imports
export const ICON_CONFIG = {
  // Only essential icons that are frequently used
  dashboard: () => import('lucide-react').then(mod => mod.LayoutDashboard),
  book: () => import('lucide-react').then(mod => mod.BookOpen),
  list: () => import('lucide-react').then(mod => mod.ClipboardList),
  file: () => import('lucide-react').then(mod => mod.FileText),
  user: () => import('lucide-react').then(mod => mod.User),
  users: () => import('lucide-react').then(mod => mod.Users),
  bell: () => import('lucide-react').then(mod => mod.Bell),
  settings: () => import('lucide-react').then(mod => mod.Settings),
  calendar: () => import('lucide-react').then(mod => mod.Calendar),
  creditCard: () => import('lucide-react').then(mod => mod.CreditCard),
  message: () => import('lucide-react').then(mod => mod.MessageCircle),
  chart: () => import('lucide-react').then(mod => mod.BarChart3),
  check: () => import('lucide-react').then(mod => mod.CheckSquare),
  home: () => import('lucide-react').then(mod => mod.Home),
  school: () => import('lucide-react').then(mod => mod.School),
  building: () => import('lucide-react').then(mod => mod.Building),
  folder: () => import('lucide-react').then(mod => mod.FolderTree),
  plus: () => import('lucide-react').then(mod => mod.PlusCircle),
  briefcase: () => import('lucide-react').then(mod => mod.Briefcase),
  megaphone: () => import('lucide-react').then(mod => mod.Megaphone),
  calculator: () => import('lucide-react').then(mod => mod.Calculator),
  logout: () => import('lucide-react').then(mod => mod.LogOut),
  menu: () => import('lucide-react').then(mod => mod.Menu),
  chevronRight: () => import('lucide-react').then(mod => mod.ChevronRight),
  chevronLeft: () => import('lucide-react').then(mod => mod.ChevronLeft),
  chevronDown: () => import('lucide-react').then(mod => mod.ChevronDown),
} as const;

export type IconName = keyof typeof ICON_CONFIG;

// Simple icon name mapper
export const getIconName = (itemName: string): IconName => {
  const name = itemName.toLowerCase();
  
  if (name.includes('dashboard') || name.includes('overview')) return 'dashboard';
  if (name.includes('result')) return 'list';
  if (name.includes('profile') || name.includes('user')) return 'user';
  if (name.includes('notification')) return 'bell';
  if (name.includes('setting')) return 'settings';
  if (name.includes('course')) return 'book';
  if (name.includes('payment')) return 'creditCard';
  if (name.includes('timetable') || name.includes('calendar')) return 'calendar';
  if (name.includes('message')) return 'message';
  if (name.includes('analytics') || name.includes('report') || name.includes('chart')) return 'chart';
  if (name.includes('attendance') || name.includes('check')) return 'check';
  if (name.includes('faculty') || name.includes('department') || name.includes('building')) return 'building';
  if (name.includes('material') || name.includes('file') || name.includes('document')) return 'file';
  if (name.includes('hostel') || name.includes('home')) return 'home';
  if (name.includes('school') || name.includes('education')) return 'school';
  if (name.includes('folder') || name.includes('category')) return 'folder';
  if (name.includes('create') || name.includes('add') || name.includes('new')) return 'plus';
  if (name.includes('job') || name.includes('work')) return 'briefcase';
  if (name.includes('announcement')) return 'megaphone';
  if (name.includes('calculator') || name.includes('computation')) return 'calculator';
  
  return 'file'; // default
};