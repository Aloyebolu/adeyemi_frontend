"use client";

import { useState } from "react";
import { CreditCard, FileText, Download, CheckCircle, AlertTriangle, Clock, XCircle } from "lucide-react";
import { SchoolFees } from "@/types/student.types";
import PaymentHistoryItem from "./PaymentHistoryItem";

interface StudentSchoolFeesCardProps {
  schoolFees: SchoolFees;
}

const StudentSchoolFeesCard = ({ schoolFees }: StudentSchoolFeesCardProps) => {
  const [showFeesBreakdown, setShowFeesBreakdown] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} className="text-green-600" />;
      case 'partial': return <AlertTriangle size={16} className="text-orange-600" />;
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      case 'overdue': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 'partial': return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case 'pending': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case 'overdue': return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    // School Fees Card with Enhanced Progress Bar
<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
  <div className="flex justify-between items-start mb-6">
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <CreditCard size={20} />
        School Fees Status
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Due Date: {new Date(schoolFees.dueDate).toLocaleDateString()}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schoolFees.status)} flex items-center gap-1`}>
        {getStatusIcon(schoolFees.status)}
        {schoolFees.status.charAt(0).toUpperCase() + schoolFees.status.slice(1)}
      </span>
    </div>
  </div>

  {/* Enhanced Fees Progress */}
  <div className="mb-6">
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Payment Progress
      </span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {Math.round((schoolFees.paid / schoolFees.amount) * 100)}%
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({formatCurrency(schoolFees.paid)} of {formatCurrency(schoolFees.amount)})
        </span>
      </div>
    </div>
    
    {/* Enhanced Progress Bar */}
    <div className="relative">
      {/* Background Track */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        {/* Animated Progress Fill */}
        <div 
          className={`h-4 rounded-full relative overflow-hidden transition-all duration-1000 ease-out ${
            schoolFees.status === 'paid' ? 'bg-gradient-to-r from-green-500 to-green-600' :
            schoolFees.status === 'partial' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
            schoolFees.status === 'overdue' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
            'bg-gradient-to-r from-yellow-500 to-yellow-600'
          }`}
          style={{ 
            width: `${(schoolFees.paid / schoolFees.amount) * 100}%`,
            transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Shimmer Animation */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* Progress Pulse Effect */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
        </div>
      </div>
      
      {/* Progress Markers */}
      <div className="flex justify-between mt-2 px-1">
        {[0, 25, 50, 75, 100].map((marker) => (
          <div key={marker} className="flex flex-col items-center">
            <div 
              className={`w-1 h-1 rounded-full ${
                (schoolFees.paid / schoolFees.amount) * 100 >= marker 
                  ? 'bg-current' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            ></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {marker}%
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Enhanced Stats Cards */}
    <div className="grid grid-cols-3 gap-4 mt-6">
      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transform hover:scale-105 transition-transform duration-200">
        <div className="text-lg font-bold text-red-500 dark:text-red-400 animate-pulse">
          {formatCurrency(schoolFees.balance)}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Balance Due</div>
        {schoolFees.balance > 0 && (
          <div className="text-xs text-red-500 mt-1 animate-bounce">
            ⚠️ Pay Now
          </div>
        )}
      </div>
      
      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transform hover:scale-105 transition-transform duration-200">
        <div className="text-lg font-bold text-green-500 dark:text-green-400">
          {formatCurrency(schoolFees.paid)}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Amount Paid</div>
        {schoolFees.paid > 0 && (
          <div className="text-xs text-green-500 mt-1">
            ✓ {Math.round((schoolFees.paid / schoolFees.amount) * 100)}% Complete
          </div>
        )}
      </div>
      
      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transform hover:scale-105 transition-transform duration-200">
        <div className="text-lg font-bold text-blue-500 dark:text-blue-400">
          {formatCurrency(schoolFees.amount)}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Fees</div>
        <div className="text-xs text-blue-500 mt-1">
          {schoolFees.dueDate && new Date(schoolFees.dueDate) > new Date() ? (
            `Due in ${Math.ceil((new Date(schoolFees.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
          ) : 'Past Due'}
        </div>
      </div>
    </div>
  </div>

  {/* Enhanced Fees Actions */}
  <div className="flex gap-3 mb-6">
    <button className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
      <CreditCard size={18} />
      Pay Fees Now
    </button>
    <button 
      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
      onClick={() => setShowFeesBreakdown(!showFeesBreakdown)}
    >
      <FileText size={18} />
      {showFeesBreakdown ? 'Hide Breakdown' : 'View Breakdown'}
    </button>
    <button className="px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105">
      <Download size={18} />
    </button>
  </div>

  {/* Enhanced Fees Breakdown with Animation */}
  <div className={`overflow-hidden transition-all duration-500 ${
    showFeesBreakdown ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
  }`}>
    <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <FileText size={18} />
        Fees Breakdown
      </h4>
      
      {/* Animated Breakdown Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(schoolFees.breakdown).map(([key, value], index) => (
          <div 
            key={key}
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInUp 0.5s ease-out forwards'
            }}
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: `hsl(${index * 45}, 70%, 50%)`
                }}
              ></div>
              {key}
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {formatCurrency(value)}
            </span>
          </div>
        ))}
      </div>

      {/* Enhanced Payment History */}
      <div className="mt-6">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock size={18} />
          Payment History
        </h4>
        <div className="space-y-3">
          {schoolFees.paymentHistory.map((payment, index) => (
            <PaymentHistoryItem
              key={index}
              amount={payment.amount}
              date={payment.date}
              method={payment.method}
              reference={payment.reference}
              status={payment.status}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default StudentSchoolFeesCard;