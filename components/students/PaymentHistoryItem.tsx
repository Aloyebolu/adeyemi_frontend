import { PaymentHistoryItemProps, PaymentMethod } from "@/types/student.types";
import { CreditCard, CheckCircle, Zap, Globe, Crosshair, CrossIcon } from "lucide-react";



const PaymentHistoryItem = ({ 
  amount, 
  date, 
  method, 
  reference, 
  status = 'completed',
  currency = 'NGN',
  index = 0
}: PaymentHistoryItemProps) => {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center";
    
    switch (method) {
      case 'stripe':
        return (
          <div className={`${baseClasses} bg-purple-100 dark:bg-purple-900`}>
            <div className="w-6 h-6 bg-purple-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
          </div>
        );
      
      case 'flutterwave':
        return (
          <div className={`${baseClasses} bg-orange-100 dark:bg-orange-900`}>
            <div className="w-6 h-6 bg-orange-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
              F
            </div>
          </div>
        );
      
      case 'paystack':
        return (
          <div className={`${baseClasses} bg-blue-100 dark:bg-blue-900`}>
            <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
              P
            </div>
          </div>
        );
      
      case 'bank_transfer':
      case 'bank':
        return (
          <div className={`${baseClasses} bg-green-100 dark:bg-green-900`}>
            <CreditCard size={18} className="text-green-600 dark:text-green-400" />
          </div>
        );
      
      case 'online_payment':
        return (
          <div className={`${baseClasses} bg-indigo-100 dark:bg-indigo-900`}>
            <Globe size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        );
      
      case 'card':
      default:
        return (
          <div className={`${baseClasses} bg-green-100 dark:bg-green-900`}>
            <CreditCard size={18} className="text-green-600 dark:text-green-400" />
          </div>
        );
    }
  };

  const getMethodDisplayName = (method: PaymentMethod) => {
    const methodNames: Record<PaymentMethod, string> = {
      stripe: 'Stripe',
      flutterwave: 'Flutterwave', 
      paystack: 'Paystack',
      bank_transfer: 'Bank Transfer',
      online_payment: 'Online Payment',
      card: 'Card Payment',
      bank: 'Bank Transfer'
    };
    return methodNames[method] || 'Payment';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900',
          borderColor: 'border-green-500',
          icon: <CheckCircle size={14} />,
          text: 'Completed'
        };
      case 'pending':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900', 
          borderColor: 'border-yellow-500',
          icon: <Zap size={14} />,
          text: 'Pending'
        };
      case 'failed':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100 dark:bg-red-900',
          borderColor: 'border-red-500',
          icon: <CrossIcon size={14}/>,
          text: 'Failed'
        };
      default:
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900',
          borderColor: 'border-green-500',
          icon: <CheckCircle size={14} />,
          text: 'Completed'
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div 
      className={`flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 border-l-4 ${statusConfig.borderColor}`}
      style={{
        animationDelay: `${index * 150}ms`,
        animation: 'slideInRight 0.5s ease-out forwards'
      }}
    >
      <div className="flex items-center gap-3">
        {getPaymentIcon(method)}
        <div>
          <p className="font-bold text-gray-900 dark:text-white">
            {formatCurrency(amount)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(date).toLocaleDateString()} • {getMethodDisplayName(method)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${statusConfig.color} flex items-center gap-1 justify-end`}>
          {statusConfig.icon}
          {statusConfig.text}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {reference}
        </p>
      </div>
    </div>
  );
};

export default PaymentHistoryItem;