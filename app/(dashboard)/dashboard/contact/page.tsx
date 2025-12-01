// app/contact/page.js
"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/hooks/useNotification";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Building,
  Send,
  MessageSquare
} from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    title: "Phone Support",
    details: "+234-XXX-XXXX-XXX",
    description: "Available Monday-Friday, 8:00 AM - 5:00 PM",
    action: "Call Now"
  },
  {
    icon: Mail,
    title: "Email Support",
    details: "support@university.edu.ng",
    description: "We respond within 2-4 hours during business days",
    action: "Send Email"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    details: "Available on Portal",
    description: "Instant help during business hours",
    action: "Start Chat"
  },
  {
    icon: Building,
    title: "Visit Us",
    details: "ICT Directorate, Main Campus",
    description: "Ground Floor, Administrative Building",
    action: "Get Directions"
  }
];

const departments = [
  {
    name: "ICT Directorate",
    email: "ict@university.edu.ng",
    phone: "+234-XXX-XXXX-001",
    responsibility: "Technical issues, portal problems"
  },
  {
    name: "Academic Affairs",
    email: "academics@university.edu.ng", 
    phone: "+234-XXX-XXXX-002",
    responsibility: "Course registration, results, transcripts"
  },
  {
    name: "Student Affairs",
    email: "studentaffairs@university.edu.ng",
    phone: "+234-XXX-XXXX-003",
    responsibility: "Hostel, clearance, student welfare"
  },
  {
    name: "Bursary Department",
    email: "bursary@university.edu.ng",
    phone: "+234-XXX-XXXX-004",
    responsibility: "Fees, payments, financial matters"
  }
];

export default function ContactPage() {
  const { addNotification } = useNotifications();

  const handleContactAction = (method, details) => {
    switch(method) {
      case 'Phone Support':
        window.open(`tel:${details}`);
        break;
      case 'Email Support':
        window.open(`mailto:${details}`);
        break;
      case 'Live Chat':
        addNotification({
          variant: "info",
          message: "Live chat will open in a new window"
        });
        // Implement live chat opening logic
        break;
      case 'Visit Us':
        addNotification({
          variant: "info", 
          message: "Opening directions in maps"
        });
        // Implement maps opening logic
        break;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-text-primary">Contact Us</h1>
        <p className="text-text2 text-lg max-w-2xl mx-auto">
          Get in touch with us through any of the following channels. 
          We're here to help you succeed.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Methods */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">
            Quick Contact Methods
          </h2>
          
          <div className="grid gap-4">
            {contactMethods.map((method) => (
              <Card key={method.title} className="hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary text-white rounded-lg">
                      <method.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary mb-2">
                        {method.title}
                      </h3>
                      <p className="text-text-primary font-medium mb-1">
                        {method.details}
                      </p>
                      <p className="text-text2 text-sm mb-3">
                        {method.description}
                      </p>
                      <Button
                        onClick={() => handleContactAction(method.title, method.details)}
                        className="bg-primary text-text-on-primary hover:bg-primary-hover"
                      >
                        {method.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Departments & Operating Hours */}
        <div className="space-y-8">
          {/* Operating Hours */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-primary w-6 h-6" />
                <h3 className="text-xl font-semibold text-text-primary">
                  Operating Hours
                </h3>
              </div>
              <div className="space-y-3 text-text2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium text-text-primary">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-text-primary">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday & Holidays</span>
                  <span className="font-medium text-text-primary">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Departments Contact */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building className="text-primary w-6 h-6" />
                <h3 className="text-xl font-semibold text-text-primary">
                  Department Contacts
                </h3>
              </div>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div key={dept.name} className="border-b border-border pb-4 last:border-0">
                    <h4 className="font-semibold text-text-primary mb-2">
                      {dept.name}
                    </h4>
                    <p className="text-text2 text-sm mb-2">
                      {dept.responsibility}
                    </p>
                    <div className="flex gap-4 text-sm">
                      <a 
                        href={`mailto:${dept.email}`}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                      <a 
                        href={`tel:${dept.phone}`}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-error/20 bg-error/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-text-primary mb-2">
                🚨 Emergency Contact
              </h3>
              <p className="text-text2 text-sm mb-3">
                For critical system outages or urgent academic matters outside business hours
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Emergency Hotline:</span>
                  <span className="font-medium text-text-primary">+234-XXX-XXXX-999</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency Email:</span>
                  <span className="font-medium text-text-primary">emergency@university.edu.ng</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}