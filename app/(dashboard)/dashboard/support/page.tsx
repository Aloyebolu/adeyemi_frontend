"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/hooks/useNotification";
import { Badge } from "@/components/ui/Badge";
import {
  MessageSquare,
  Phone,
  Mail,
  HelpCircle,
  BookOpen,
  CreditCard,
  User,
  Building,
  FileText,
  ArrowRight,
  Search
} from "lucide-react";

const supportCategories = [
  {
    id: "academic",
    name: "Academic Issues",
    icon: BookOpen,
    description: "Course registration, results, transcripts, academic advising",
    subcategories: [
      "Course Registration Problems",
      "Result Complaints", 
      "Transcript Requests",
      "Academic Advising",
      "Carryover Issues",
      "Department Matters"
    ]
  },
  {
    id: "financial",
    name: "Financial Matters",
    icon: CreditCard,
    description: "School fees, payments, scholarships, financial aid",
    subcategories: [
      "School Fee Payment Issues",
      "Scholarship Inquiries",
      "Financial Aid",
      "Payment Verification",
      "Refund Requests"
    ]
  },
  {
    id: "technical",
    name: "Technical Support", 
    icon: HelpCircle,
    description: "Portal issues, login problems, technical difficulties",
    subcategories: [
      "Portal Login Issues",
      "Page Not Loading",
      "Error Messages", 
      "Mobile App Problems",
      "Browser Compatibility"
    ]
  },
  {
    id: "administrative",
    name: "Administrative",
    icon: Building,
    description: "Student records, ID cards, hostel allocation, clearance",
    subcategories: [
      "Student ID Card Issues",
      "Hostel Allocation",
      "Clearance Problems", 
      "Document Verification",
      "Record Updates"
    ]
  },
  {
    id: "personal",
    name: "Personal Issues",
    icon: User,
    description: "Personal matters, emergencies, welfare concerns",
    subcategories: [
      "Emergency Situations",
      "Health Issues",
      "Welfare Concerns",
      "Personal Crisis",
      "Confidential Matters"
    ]
  }
];

export default function SupportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle URL parameters for pre-filled forms
  useEffect(() => {
    const category = searchParams.get('category');
    const prefillMessage = searchParams.get('message');
    const urgencyLevel = searchParams.get('urgency');

    if (category) {
      const foundCategory = supportCategories.find(cat => cat.id === category);
      if (foundCategory) {
        setSelectedCategory(foundCategory);
      }
    }

    if (prefillMessage) {
      setMessage(decodeURIComponent(prefillMessage));
    }

    if (urgencyLevel) {
      setUrgency(urgencyLevel);
    }
  }, [searchParams]);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    
    if (!selectedCategory || !message.trim()) {
      addNotification({
        variant: "error",
        message: "Please select a category and provide a message"
      });
      return;
    }

    try {
      // Simulate API call to create support ticket
      const ticketData = {
        category: selectedCategory.id,
        subcategory: e.target.subcategory?.value || "General",
        message,
        urgency,
        timestamp: new Date().toISOString()
      };

      console.log("Submitting ticket:", ticketData);
      
      addNotification({
        variant: "success",
        message: "Support ticket submitted successfully! We'll get back to you soon."
      });

      // Reset form
      setSelectedCategory(null);
      setMessage("");
      setUrgency("medium");
      
    } catch (error) {
      addNotification({
        variant: "error",
        message: "Failed to submit support ticket. Please try again."
      });
    }
  };

  const filteredCategories = supportCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-3">
          <MessageSquare className="text-primary w-8 h-8" />
          <h1 className="text-3xl font-bold text-text-primary">Student Support</h1>
        </div>
        <p className="text-text2 text-lg max-w-2xl mx-auto">
          We're here to help you with any issues or questions you may have. 
          Choose a category below or contact us directly.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Support Categories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text2 w-5 h-5" />
            <input
              type="text"
              placeholder="Search support categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
            />
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredCategories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-medium border-2 ${
                  selectedCategory?.id === category.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      selectedCategory?.id === category.id 
                        ? 'bg-primary text-white' 
                        : 'bg-background2 text-text2'
                    }`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary mb-2">
                        {category.name}
                      </h3>
                      <p className="text-text2 text-sm mb-3">
                        {category.description}
                      </p>
                      <Badge 
                        variant={selectedCategory?.id === category.id ? "info" : "neutral"}
                        className="text-xs"
                      >
                        {category.subcategories.length} subcategories
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Form */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Submit Support Request
              </h2>

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                {/* Selected Category Display */}
                {selectedCategory && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-success text-sm">
                      <selectedCategory.icon className="w-4 h-4" />
                      <span className="font-medium">{selectedCategory.name}</span>
                    </div>
                  </div>
                )}

                {/* Subcategory Selection */}
                {selectedCategory && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Specific Issue
                    </label>
                    <select 
                      name="subcategory"
                      className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                      required
                    >
                      <option value="">Select specific issue</option>
                      {selectedCategory.subcategories.map((subcat) => (
                        <option key={subcat} value={subcat}>
                          {subcat}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Urgency Level */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Urgency Level
                  </label>
                  <select 
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                  >
                    <option value="low">Low - General Inquiry</option>
                    <option value="medium">Medium - Need help soon</option>
                    <option value="high">High - Urgent issue</option>
                    <option value="critical">Critical - System down/Blocked</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you were trying to accomplish."
                    rows={6}
                    className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-surface resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!selectedCategory || !message.trim()}
                  className="w-full bg-primary text-text-on-primary hover:bg-primary-hover"
                >
                  Submit Support Request
                </Button>

                <p className="text-xs text-text2 text-center">
                  Average response time: 2-4 hours during business hours
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-text-primary mb-4">
                Quick Help
              </h3>
              <div className="space-y-3">
                <Link href="/contact">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Directly
                  </Button>
                </Link>
                <Link href="/support/faq">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <HelpCircle className="w-4 h-4" />
                    View FAQ
                  </Button>
                </Link>
                <Link href="/support/tickets">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="w-4 h-4" />
                    My Support Tickets
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}