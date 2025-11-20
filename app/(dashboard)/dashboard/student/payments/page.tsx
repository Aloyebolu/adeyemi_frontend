"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Lock, 
  Download,
  ArrowLeft,
  Zap,
  Globe,
  Building
} from "lucide-react";

// Paystack type definitions
interface PaystackResponse {
  message: string;
  reference: string;
  status: string;
  transaction: string;
  trxref: string;
}

interface PaymentData {
  email: string;
  amount: number;
  reference: string;
  publicKey: string;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

const SchoolFeesPayment = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [amount, setAmount] = useState(250000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState("");

  const PAYSTACK_PUBLIC_KEY = "pk_test_0d2b6ebe5036a18b01d24b04b722d774e7644063";
  const PAYSTACK_SECRET_KEY = "sk_test_00d9fcb583aae17319ce291085129e73d1345530";

  // Mock fees data
  const feesData = {
    totalAmount: 250000,
    paid: 200000,
    balance: 50000,
    dueDate: "2024-03-30",
    breakdown: {
      tuition: 180000,
      accommodation: 40000,
      medical: 10000,
      library: 8000,
      sports: 5000,
      technology: 5000,
      other: 2000
    }
  };

  const paymentMethods = [
    {
      id: "paystack",
      name: "Paystack",
      description: "Instant payment with card, bank transfer, or USSD",
      icon: "P",
      color: "bg-blue-500",
      popular: true
    },
    {
      id: "bank-transfer",
      name: "Bank Transfer",
      description: "Direct transfer to university account",
      icon: <Building size={20} />,
      color: "bg-green-500"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // Generate unique transaction reference
  const generateReference = () => {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Initialize Paystack payment
  const initializePaystackPayment = () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsProcessing(true);
    setError("");

    const reference = generateReference();
    setTransactionRef(reference);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount * 100, // Convert to kobo
      reference: reference,
      currency: 'NGN',
      callback: function(response: PaystackResponse) {
        setIsProcessing(false);
        if (response.status === 'success') {
          setPaymentSuccess(true);
          setActiveStep(3);
          verifyPayment(reference);
        } else {
          setError("Payment failed. Please try again.");
        }
      },
      onClose: function() {
        setIsProcessing(false);
        setError("Payment was cancelled.");
      }
    });

    handler.openIframe();
  };

  // Verify payment with server
  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch(`/api/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
        },
        body: JSON.stringify({ reference })
      });

      const data = await response.json();
      
      if (data.status) {
        setPaymentSuccess(true);
      } else {
        setError("Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Unable to verify payment. Please contact support.");
    }
  };

  const handlePayment = async () => {
    if (selectedMethod === "paystack") {
      initializePaystackPayment();
    } else if (selectedMethod === "bank-transfer") {
      // Handle bank transfer logic
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setActiveStep(3);
      setIsProcessing(false);
      setPaymentSuccess(true);
    }
  };

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const steps = [
    { number: 1, title: "Review Fees", status: activeStep >= 1 ? "completed" : "upcoming" },
    { number: 2, title: "Payment Method", status: activeStep >= 2 ? "completed" : "upcoming" },
    { number: 3, title: "Confirmation", status: activeStep >= 3 ? "completed" : "upcoming" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => activeStep > 1 ? setActiveStep(activeStep - 1) : window.history.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  School Fees Payment
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Complete your fees payment securely
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Secure • Encrypted
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10">
              <div 
                className="h-0.5 bg-green-500 transition-all duration-500"
                style={{ width: `${((activeStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
            
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.status === "completed" 
                    ? "bg-green-500 border-green-500 text-white" 
                    : step.number === activeStep
                    ? "border-green-500 bg-white dark:bg-gray-800 text-green-500"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400"
                }`}>
                  {step.status === "completed" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>
                <span className={`text-sm font-medium mt-2 ${
                  step.number === activeStep 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Review Fees */}
            {activeStep === 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Review Your Fees
                </h2>

                {/* Amount Summary */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-blue-100 text-sm">Total Fees</p>
                      <p className="text-3xl font-bold">{formatCurrency(feesData.totalAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-100 text-sm">Balance Due</p>
                      <p className="text-2xl font-bold text-yellow-300">{formatCurrency(feesData.balance)}</p>
                    </div>
                  </div>
                  <div className="w-full bg-blue-400/30 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(feesData.paid / feesData.totalAmount) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-blue-100 text-sm mt-2">
                    {Math.round((feesData.paid / feesData.totalAmount) * 100)}% paid • Due {new Date(feesData.dueDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Fees Breakdown */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Fees Breakdown</h3>
                  {Object.entries(feesData.breakdown).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">
                        {key.replace('_', ' ')}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(value)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8">
                  <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                    <Download size={18} />
                    Download Invoice
                  </button>
                  <button 
                    onClick={() => setActiveStep(2)}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <CreditCard size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {activeStep === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Choose Payment Method
                </h2>

                {/* Email Input for Paystack */}
                {selectedMethod === "paystack" && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      required
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Payment receipt will be sent to this email
                    </p>
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedMethod === method.id
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center text-white font-bold`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {method.name}
                            </h3>
                            {method.popular && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            {method.description}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          selectedMethod === method.id
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}>
                          {selectedMethod === method.id && (
                            <CheckCircle size={14} className="text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Security Features */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Shield size={16} className="text-green-500" />
                    <span>Your payment is secured with bank-level encryption</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveStep(1)}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handlePayment}
                    disabled={!selectedMethod || isProcessing || (selectedMethod === "paystack" && !email)}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay {formatCurrency(amount)}
                        <Lock size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {activeStep === 3 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  paymentSuccess ? "bg-green-100 dark:bg-green-900" : "bg-yellow-100 dark:bg-yellow-900"
                }`}>
                  {paymentSuccess ? (
                    <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle size={32} className="text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {paymentSuccess ? "Payment Successful!" : "Payment Processing"}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {paymentSuccess 
                    ? "Your school fees payment has been processed successfully"
                    : "Your payment is being processed. You'll receive confirmation shortly."
                  }
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 max-w-md mx-auto mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Amount Paid:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {paymentMethods.find(m => m.id === selectedMethod)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                    <span className="font-mono text-sm text-gray-900 dark:text-white">{transactionRef}</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                    <Download size={16} />
                    Download Receipt
                  </button>
                  <button className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield size={18} className="text-green-500" />
                Payment Security
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Lock size={14} className="text-green-500 flex-shrink-0" />
                  <span>Bank-level encryption</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Zap size={14} className="text-green-500 flex-shrink-0" />
                  <span>Instant payment confirmation</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Globe size={14} className="text-green-500 flex-shrink-0" />
                  <span>PCI DSS compliant</span>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Need Help?
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                Our support team is here to help with your payment
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600 dark:text-blue-400">Bursary:</span>
                  <span className="text-blue-900 dark:text-blue-100 font-medium">01-2345678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 dark:text-blue-400">IT Support:</span>
                  <span className="text-blue-900 dark:text-blue-100 font-medium">01-2345679</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 dark:text-blue-400">Email:</span>
                  <span className="text-blue-900 dark:text-blue-100 font-medium">bursary@university.edu.ng</span>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800 p-6">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
                <AlertCircle size={16} />
                Important Notes
              </h3>
              <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-2">
                <li>• Payments may take 5-10 minutes to reflect</li>
                <li>• Keep your transaction reference safe</li>
                <li>• Contact support if payment fails</li>
                <li>• Download receipt for your records</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolFeesPayment;