'use client';

import { useState } from 'react';

interface GuestFormProps {
  onSubmit: (data: {
    email: string;
    name?: string;
    phone?: string;
  }) => void;
  disabled?: boolean;
}

export default function GuestForm({ onSubmit, disabled = false }: GuestFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      email: formData.email.trim(),
      name: formData.name.trim() || undefined,
      phone: formData.phone.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          Email <span className="text-error">*</span>
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={`w-full px-3 py-2 bg-background2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.email ? 'border-error' : 'border-border'
          }`}
          placeholder="your.email@example.com"
          disabled={disabled}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-error">{errors.email}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          Name (Optional)
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 bg-background2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Your name"
          disabled={disabled}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          Phone (Optional)
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className={`w-full px-3 py-2 bg-background2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.phone ? 'border-error' : 'border-border'
          }`}
          placeholder="+1234567890"
          disabled={disabled}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-error">{errors.phone}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={disabled || !formData.email}
        className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? 'Connecting...' : 'Start Chat as Guest'}
      </button>
    </form>
  );
}