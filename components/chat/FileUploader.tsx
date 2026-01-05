'use client';

import { useState, useRef } from 'react';
import { Paperclip, X, Loader2 } from 'lucide-react';

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
  maxSize?: number; // in MB
}

export default function FileUploader({ 
  onUpload, 
  disabled = false,
  maxSize = 10 
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return 'File type not allowed. Allowed: images, PDF, text, Word documents';
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    if (disabled || uploading) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 5000);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await onUpload(file);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      setTimeout(() => setError(null), 5000);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled || uploading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    if (!disabled && !uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={disabled || uploading}
        className={`p-3 rounded-lg transition ${
          isDragging
            ? 'bg-primary/20 border-2 border-primary border-dashed'
            : 'bg-background2 hover:bg-background2/80 border border-border'
        } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title="Attach file"
        aria-label="Attach file"
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-text-secondary" />
        ) : (
          <Paperclip className="h-5 w-5 text-text-secondary" />
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept={allowedTypes.join(',')}
        disabled={disabled || uploading}
      />

      {/* Error Popup */}
      {error && (
        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-error text-white text-sm rounded-lg shadow-lg z-50">
          <div className="flex items-start gap-2">
            <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
          <div className="absolute -bottom-1 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-error"></div>
        </div>
      )}
    </div>
  );
}