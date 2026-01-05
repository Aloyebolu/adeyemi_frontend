'use client';

import { useState } from 'react';
import { ChatSession } from '@/types/chat';
import { X, Users, UserCheck, Clock, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface ChatTransferModalProps {
  session: ChatSession;
  attendants: any[];
  onClose: () => void;
  onConfirm: (attendantId: string) => Promise<void>;
}

export default function ChatTransferModal({
  session,
  attendants,
  onClose,
  onConfirm
}: ChatTransferModalProps) {
  const [selectedAttendant, setSelectedAttendant] = useState<string>('');
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserInfo = () => {
    if (session.user_id) {
      return {
        type: 'Registered User',
        name: session.user_id.name,
        email: session.user_id.email
      };
    }
    
    if (session.guest_info) {
      return {
        type: 'Guest User',
        name: session.guest_info.name || 'Not provided',
        email: session.guest_info.email
      };
    }
    
    return null;
  };

  const userInfo = getUserInfo();
  const availableAttendants = attendants.filter(a => a.chat_availability);

  const handleTransfer = async () => {
    if (!selectedAttendant) {
      setError('Please select an attendant');
      return;
    }

    setTransferring(true);
    setError(null);

    try {
      await onConfirm(selectedAttendant);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-text-primary">Transfer Chat</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-background2 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Chat Info */}
          <div className="bg-background2 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">
                  Created: {format(new Date(session.createdAt), 'PPpp')}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                session.status === 'waiting' 
                  ? 'bg-warning/10 text-warning' 
                  : 'bg-success/10 text-success'
              }`}>
                {session.status}
              </span>
            </div>
            
            {userInfo && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-text-secondary" />
                  <span className="text-sm">{userInfo.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-text-secondary" />
                  <span className="text-sm">{userInfo.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* Attendant Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Select Attendant
            </label>
            
            {availableAttendants.length === 0 ? (
              <div className="text-center py-4 bg-background2 rounded-lg">
                <UserCheck className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                <p className="text-sm text-text-secondary">
                  No available attendants at the moment
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableAttendants.map((attendant) => (
                  <div
                    key={attendant._id}
                    onClick={() => setSelectedAttendant(attendant._id)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      selectedAttendant === attendant._id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-text-primary">
                          {attendant.name}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {attendant.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
                        <span className="text-xs text-success">Online</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-primary hover:bg-background2 rounded-lg transition"
            disabled={transferring}
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={!selectedAttendant || transferring || availableAttendants.length === 0}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
          >
            {transferring ? 'Transferring...' : 'Transfer Chat'}
          </button>
        </div>
      </div>
    </div>
  );
}