'use client';

import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Users,
  FileText,
  HelpCircle,
  Download,
  GraduationCap,
} from 'lucide-react';

const menuItems = [
  { label: 'Staff / Student', icon: Users, href: '/login' },
  { label: 'Applicants', icon: BookOpen, href: '/applicants' },
  { label: 'Transcripts', icon: FileText, href: '/transcripts' },
  { label: 'Demonstration', icon: GraduationCap, href: '/demo' },
  { label: 'FAQ', icon: HelpCircle, href: '/faq' },
  { label: 'Downloads', icon: Download, href: '/downloads' },
];

export default function MenuGrid() {
  const router = useRouter();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map(({ label, icon: Icon, href }, i) => (
        <div
          key={i}
          onClick={() => router.push(href)}
          className="bg-white rounded-xl shadow-md p-6 text-center hover:bg-[#F4C430] hover:text-[#0B3D2E] transition-all cursor-pointer active:scale-95"
        >
          <div className="flex flex-col items-center gap-3">
            <Icon size={40} />
            <span className="font-semibold text-lg">{label}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
