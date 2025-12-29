// app/documentation/layout.jsx
export default function DocumentationLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 fixed left-0 top-0 h-screen bg-surface border-r border-border overflow-y-auto pt-20">
          <nav className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-text-primary">Documentation</h2>
            
            <div className="space-y-6">
              {/* Quick Start */}
              <div>
                <h3 className="text-sm font-medium text-text2 mb-2 uppercase tracking-wider">Getting Started</h3>
                <ul className="space-y-1">
                  <li><a href="#overview" className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">Overview</a></li>
                  <li><a href="#access" className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">System Access</a></li>
                  <li><a href="#roles" className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">User Roles</a></li>
                </ul>
              </div>

              {/* User Roles Sections */}
              {['Students', 'Lecturers', 'Admins', 'HODs', 'Deans'].map(role => (
                <div key={role}>
                  <h3 className="text-sm font-medium text-text2 mb-2 uppercase tracking-wider">{role}</h3>
                  <ul className="space-y-1">
                    <li><a href={`#${role.toLowerCase()}-dashboard`} className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">Dashboard</a></li>
                    <li><a href={`#${role.toLowerCase()}-courses`} className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">Courses</a></li>
                    <li><a href={`#${role.toLowerCase()}-grades`} className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">Grades</a></li>
                  </ul>
                </div>
              ))}

              {/* Tools & Features */}
              <div>
                <h3 className="text-sm font-medium text-text2 mb-2 uppercase tracking-wider">Tools & Features</h3>
                <ul className="space-y-1">
                  <li><a href="#gradebook" className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">Gradebook</a></li>
                  <li><a href="#timetable" className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">Timetable</a></li>
                  <li><a href="#announcements" className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">Announcements</a></li>
                  <li><a href="#payments" className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">Fee Payments</a></li>
                  <li><a href="#transcripts" className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">Transcripts</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-sm font-medium text-text2 mb-2 uppercase tracking-wider">Support</h3>
                <ul className="space-y-1">
                  <li><a href="#faqs" className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">FAQs</a></li>
                  <li><a href="#contact" className="block py-1 px-2 text-sm hover:bg-primary-10 rounded text-text2 hover:text-text-primary">Contact Support</a></li>
                </ul>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 flex-1 pt-16">
          <div className="max-w-4xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}