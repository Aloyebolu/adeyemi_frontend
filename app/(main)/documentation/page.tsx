// app/documentation/page.jsx
export default function DocumentationPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <header className="text-center py-8 border-b border-border">
        <h1 className="text-4xl font-bold mb-4 text-text-primary">University Management System Documentation</h1>
        <p className="text-lg text-text2 max-w-2xl mx-auto">
          Comprehensive guide for students, lecturers, administrators, HODs, and Deans to effectively use the Nigerian University Management System
        </p>
      </header>

      {/* Getting Started */}
      <section id="overview" className="scroll-mt-20">
        <div className="bg-surface-elevated rounded-card p-6 shadow-medium">
          <h2 className="text-2xl font-bold mb-4 text-text-primary flex items-center gap-3">
            <span className="p-2 bg-primary-10 rounded-full">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            System Overview
          </h2>
          <p className="text-text2 mb-4">
            Welcome to the Nigerian University Management System. This platform integrates all academic and administrative processes for a seamless educational experience.
          </p>
          
          {/* Role Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[
              { role: "Students", desc: "Course registration, grade viewing, fee payments", color: "bg-primary-10" },
              { role: "Lecturers", desc: "Grade submission, course management, student tracking", color: "bg-accent/10" },
              { role: "Administrators", desc: "System configuration, user management, reporting", color: "bg-success/10" },
              { role: "HODs", desc: "Department oversight, course approval, staff management", color: "bg-warning/10" },
              { role: "Deans", desc: "Faculty management, academic planning, policy implementation", color: "bg-info/10" },
            ].map((item) => (
              <div key={item.role} className={`p-4 rounded-card ${item.color} border border-border`}>
                <h3 className="font-semibold text-text-primary">{item.role}</h3>
                <p className="text-sm text-text2 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Section */}
      <section id="students-dashboard" className="scroll-mt-20">
        <div className="bg-surface-elevated rounded-card p-6 shadow-medium">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Student Portal Guide</h2>
            <span className="px-3 py-1 bg-primary-20 text-primary rounded-full text-sm font-medium">
              Student
            </span>
          </div>
          
          {/* Step-by-step guide */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Key Features</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-border rounded-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary-20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-text-primary">Course Registration</h4>
                </div>
                <p className="text-sm text-text2">
                  Register for courses each semester. Ensure you meet prerequisites and check timetable compatibility.
                </p>
              </div>

              <div className="border border-border rounded-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary-20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-text-primary">Fee Payment</h4>
                </div>
                <p className="text-sm text-text2">
                  Pay tuition and other fees through the secure payment gateway. Download receipts for verification.
                </p>
              </div>

              <div className="border border-border rounded-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary-20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-text-primary">Grade Viewing</h4>
                </div>
                <p className="text-sm text-text2">
                  View semester results, calculate GPA, and track academic progress throughout your program.
                </p>
              </div>

              <div className="border border-border rounded-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary-20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-text-primary">Transcript Request</h4>
                </div>
                <p className="text-sm text-text2">
                  Request official transcripts for further studies or employment. Processing time: 3-5 working days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lecturer Section */}
      <section id="lecturers-dashboard" className="scroll-mt-20">
        <div className="bg-surface-elevated rounded-card p-6 shadow-medium">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Lecturer Portal Guide</h2>
            <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
              Lecturer
            </span>
          </div>

          {/* Important Note */}
          <div className="bg-warning/10 border border-warning/30 rounded-card p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold text-text-primary mb-1">Important Notice</h4>
                <p className="text-sm text-text2">
                  All grades must be submitted within 2 weeks after examinations. Late submissions require HOD approval.
                </p>
              </div>
            </div>
          </div>

          {/* Grade Submission Steps */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text-primary">Grade Submission Process</h3>
            
            <div className="relative">
              {/* Timeline */}
              {[
                { step: "1", title: "Access Gradebook", desc: "Navigate to Courses → Gradebook" },
                { step: "2", title: "Select Course", desc: "Choose course and semester" },
                { step: "3", title: "Input Scores", desc: "Enter CA and exam scores" },
                { step: "4", title: "Calculate & Review", desc: "System calculates final grades" },
                { step: "5", title: "Submit to HOD", desc: "Submit for approval" },
              ].map((item, index) => (
                <div key={item.step} className="flex gap-4 mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary-20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">{item.step}</span>
                    </div>
                    {index < 4 && (
                      <div className="flex-1 w-0.5 bg-border mt-2"></div>
                    )}
                  </div>
                  <div className="pb-8">
                    <h4 className="font-semibold text-text-primary">{item.title}</h4>
                    <p className="text-sm text-text2 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="scroll-mt-20">
        <div className="bg-surface-elevated rounded-card p-6 shadow-medium">
          <h2 className="text-2xl font-bold mb-6 text-text-primary">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {[
              {
                q: "How do I reset my password?",
                a: "Click 'Forgot Password' on login page. You'll receive reset instructions via your registered email."
              },
              {
                q: "When are course registrations open?",
                a: "Course registration opens 2 weeks before semester begins and closes 1 week after semester start."
              },
              {
                q: "How are GPA calculations done?",
                a: "GPA is calculated using the Nigerian university 5-point scale. Quality points = Grade Point × Credit Units."
              },
              {
                q: "How do lecturers submit grades?",
                a: "Lecturers submit through Gradebook portal. All submissions require HOD approval."
              },
              {
                q: "What payment methods are accepted?",
                a: "We accept bank transfers, online cards, and USSD payments through our secure payment partners."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-border rounded-card p-4">
                <summary className="flex justify-between items-center cursor-pointer text-text-primary font-medium">
                  {faq.q}
                  <svg className="w-5 h-5 text-text2 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-text2">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="contact" className="scroll-mt-20">
        <div className="bg-gradient-to-r from-primary-10 to-accent/10 rounded-card p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Need More Help?</h2>
          <p className="text-text2 mb-6">
            Contact the university ICT support team for technical assistance.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-surface rounded-card p-4">
              <h4 className="font-semibold text-text-primary mb-2">Email Support</h4>
              <p className="text-primary">support@university.edu.ng</p>
            </div>
            <div className="bg-surface rounded-card p-4">
              <h4 className="font-semibold text-text-primary mb-2">Phone Support</h4>
              <p className="text-primary">+234 XXX XXX XXXX</p>
            </div>
            <div className="bg-surface rounded-card p-4">
              <h4 className="font-semibold text-text-primary mb-2">Office Hours</h4>
              <p className="text-text2">Mon-Fri: 8am-6pm</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}