'use client';

import { MessageSquare, Clock, CheckCircle, HelpCircle } from 'lucide-react';

interface QuickReply {
  id: string;
  text: string;
  category: string;
  icon: React.ReactNode;
}

interface QuickRepliesProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export default function QuickReplies({ onSelect, disabled = false }: QuickRepliesProps) {
  const quickReplies: QuickReply[] = [
    {
      id: 'welcome',
      text: 'Hello! How can I help you today?',
      category: 'Greeting',
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      id: 'wait',
      text: 'Please give me a moment while I check that for you.',
      category: 'Delay',
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: 'confirm',
      text: 'I understand. Let me help you with that.',
      category: 'Confirmation',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      id: 'info',
      text: 'For more information, please visit our website or contact the administration office.',
      category: 'Information',
      icon: <HelpCircle className="h-4 w-4" />
    },
    {
      id: 'hours',
      text: 'Our office hours are Monday to Friday, 8:00 AM to 4:00 PM.',
      category: 'Hours',
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: 'followup',
      text: 'Is there anything else I can help you with?',
      category: 'Follow-up',
      icon: <MessageSquare className="h-4 w-4" />
    }
  ];

  const categories = Array.from(new Set(quickReplies.map(reply => reply.category)));

  return (
    <div className="border-t border-border p-4">
      <h4 className="font-medium text-text-primary mb-3">Quick Replies</h4>
      
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category}>
            <div className="text-xs font-medium text-text-secondary mb-2">
              {category}
            </div>
            <div className="flex flex-wrap gap-2">
              {quickReplies
                .filter(reply => reply.category === category)
                .map((reply) => (
                  <button
                    key={reply.id}
                    onClick={() => onSelect(reply.text)}
                    disabled={disabled}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-background2 hover:bg-background2/80 border border-border rounded-lg text-sm text-text-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reply.icon}
                    {reply.text}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}