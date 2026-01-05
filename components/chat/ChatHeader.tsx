'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChatHeaderProps {
  title: string;
  showBack?: boolean;
  backUrl?: string;
}

export default function ChatHeader({ title, showBack = false, backUrl }: ChatHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {showBack && (
              <button
                onClick={handleBack}
                className="mr-4 p-2 rounded-lg hover:bg-background2 transition"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-text-primary" />
              </button>
            )}
            <h1 className="text-xl font-bold text-text-primary">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-text-secondary hidden sm:block">
              University Support Chat
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}