export interface Student {
  _id: string;
  name: string;
  department: string;
  photo: string;
  email: string;
  level: string;
  semester: string;
  matric_no: string
}

export interface Activity {
  id: string;
  action: string;
  time: string;
  type: 'academic' | 'system' | 'profile' | 'registration' | 'financial';
  icon: React.ReactNode;
}

export interface Announcement {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export interface QuickStat {
  label: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

export interface SchoolFees {
  amount: number;
  paid: number;
  balance: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  dueDate: string;
  lastPaymentDate?: string;
  breakdown: {
    tuition: number;
    accommodation: number;
    medical: number;
    library: number;
    sports: number;
    technology: number;
    other: number;
  };
  paymentHistory: PaymentHistoryItemProps[];
}

export interface StudentDashboardProps {
  student: Student;
  activities: Activity[];
  announcements: Announcement[];
  quickStats: QuickStat[];
  schoolFees: SchoolFees;
}

export type PaymentMethod = 'stripe' | 'flutterwave' | 'paystack' | 'bank_transfer' | 'online_payment' | 'card' | 'bank';

export interface PaymentHistoryItemProps {
  amount: number;
  date: string;
  method: PaymentMethod;
  reference: string;
  status?: 'completed' | 'pending' | 'failed';
  currency?: string;
  index?: number;
}