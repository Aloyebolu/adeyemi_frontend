// components/edit-profile/stages/DocumentsStage.tsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, FileText, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentsStageProps {
  data: any;
  onUpdate: (data: any) => void;
}

type DocumentType = 
  | 'passportPhoto'
  | 'birthCertificate'
  | 'jambResult'
  | 'oLevelResult'
  | 'stateOfOriginCert'
  | 'acceptanceLetter'
  | 'medicalReport';

interface DocumentInfo {
  id: DocumentType;
  label: string;
  description: string;
  required: boolean;
  maxSize: number; // in MB
  allowedTypes: string[];
  uploadStatus: 'not_uploaded' | 'uploading' | 'uploaded' | 'error';
  progress: number;
}

export default function DocumentsStage({ data, onUpdate }: DocumentsStageProps) {
  const [uploadingDoc, setUploadingDoc] = useState<DocumentType | null>(null);
  const fileInputRefs = useRef<Record<DocumentType, HTMLInputElement | null>>({
    passportPhoto: null,
    birthCertificate: null,
    jambResult: null,
    oLevelResult: null,
    stateOfOriginCert: null,
    acceptanceLetter: null,
    medicalReport: null,
  });

  const documentTypes: DocumentInfo[] = [
    {
      id: 'passportPhoto',
      label: 'Passport Photograph',
      description: 'Recent colored passport photo (JPEG/PNG, max 2MB)',
      required: true,
      maxSize: 2,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      uploadStatus: data.documents.hasUploadedPassport ? 'uploaded' : 'not_uploaded',
      progress: data.documents.hasUploadedPassport ? 100 : 0,
    },
    {
      id: 'birthCertificate',
      label: 'Birth Certificate',
      description: 'Official birth certificate or declaration of age (PDF/JPEG, max 5MB)',
      required: true,
      maxSize: 5,
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
      uploadStatus: data.documents.hasUploadedBirthCert ? 'uploaded' : 'not_uploaded',
      progress: data.documents.hasUploadedBirthCert ? 100 : 0,
    },
    {
      id: 'jambResult',
      label: 'JAMB Result Slip',
      description: 'Original JAMB result slip (PDF/JPEG, max 3MB)',
      required: true,
      maxSize: 3,
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
      uploadStatus: data.documents.hasUploadedJamb ? 'uploaded' : 'not_uploaded',
      progress: data.documents.hasUploadedJamb ? 100 : 0,
    },
    {
      id: 'oLevelResult',
      label: "O'Level Result",
      description: "WAEC/NECO/NABTEB result (PDF/JPEG, max 5MB)",
      required: true,
      maxSize: 5,
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
      uploadStatus: data.documents.hasUploadedOLevel ? 'uploaded' : 'not_uploaded',
      progress: data.documents.hasUploadedOLevel ? 100 : 0,
    },
    {
      id: 'stateOfOriginCert',
      label: 'State of Origin Certificate',
      description: 'Local government certificate of origin (PDF/JPEG, max 3MB)',
      required: true,
      maxSize: 3,
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
      uploadStatus: data.documents.hasUploadedOriginCert ? 'uploaded' : 'not_uploaded',
      progress: data.documents.hasUploadedOriginCert ? 100 : 0,
    },
    {
      id: 'acceptanceLetter',
      label: 'Admission Letter',
      description: 'University admission letter (PDF, max 2MB)',
      required: true,
      maxSize: 2,
      allowedTypes: ['application/pdf'],
      uploadStatus: data.documents.hasUploadedAcceptance ? 'uploaded' : 'not_uploaded',
      progress: data.documents.hasUploadedAcceptance ? 100 : 0,
    },
    {
      id: 'medicalReport',
      label: 'Medical Fitness Certificate',
      description: 'Medical report from recognized hospital (PDF/JPEG, max 3MB)',
      required: true,
      maxSize: 3,
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
      uploadStatus: data.documents.hasUploadedMedical ? 'uploaded' : 'not_uploaded',
      progress: data.documents.hasUploadedMedical ? 100 : 0,
    },
  ];

  const handleFileSelect = (docId: DocumentType) => {
    fileInputRefs.current[docId]?.click();
  };

  const handleFileChange = async (docId: DocumentType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const docInfo = documentTypes.find(d => d.id === docId);
    if (!docInfo) return;

    // Validate file type
    if (!docInfo.allowedTypes.includes(file.type)) {
      alert(`Invalid file type. Allowed types: ${docInfo.allowedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > docInfo.maxSize * 1024 * 1024) {
      alert(`File too large. Maximum size: ${docInfo.maxSize}MB`);
      return;
    }

    setUploadingDoc(docId);
    
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        // Update progress
        const updatedDocs = documentTypes.map(d => 
          d.id === docId ? { ...d, progress } : d
        );
        // In a real app, you'd update the UI here
      }

      // Simulate successful upload
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update the document status
      const updateKey = `hasUploaded${docId.charAt(0).toUpperCase() + docId.slice(1)}`;
      const fileKey = docId;
      
      onUpdate({
        documents: {
          ...data.documents,
          [updateKey]: true,
          [fileKey]: file,
        },
      });

      alert(`${docInfo.label} uploaded successfully!`);

    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Failed to upload ${docInfo.label}. Please try again.`);
    } finally {
      setUploadingDoc(null);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRemoveDocument = (docId: DocumentType) => {
    if (confirm('Are you sure you want to remove this document?')) {
      const updateKey = `hasUploaded${docId.charAt(0).toUpperCase() + docId.slice(1)}`;
      const fileKey = docId;
      
      onUpdate({
        documents: {
          ...data.documents,
          [updateKey]: false,
          [fileKey]: null,
        },
      });
    }
  };

  const handleViewDocument = (docId: DocumentType) => {
    // In a real app, this would open the document
    alert(`Viewing ${docId}. This would open the document in a new tab.`);
  };

  const uploadedCount = documentTypes.filter(doc => 
    data.documents[`hasUploaded${doc.id.charAt(0).toUpperCase() + doc.id.slice(1)}`]
  ).length;
  const totalRequired = documentTypes.filter(doc => doc.required).length;
  const uploadPercentage = Math.round((uploadedCount / totalRequired) * 100);

  return (
    <div className="space-y-6">
      {/* Upload Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Document Upload Progress</h3>
              <p className="text-sm text-gray-600">
                {uploadedCount} of {totalRequired} required documents uploaded
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{uploadPercentage}%</div>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </div>
          <Progress value={uploadPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((doc) => {
          const isUploaded = data.documents[`hasUploaded${doc.id.charAt(0).toUpperCase() + doc.id.slice(1)}`];
          const isUploading = uploadingDoc === doc.id;

          return (
            <Card key={doc.id} className={cn(
              "overflow-hidden",
              isUploaded && "border-green-200 bg-green-50",
              isUploading && "border-blue-200"
            )}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{doc.label}</h4>
                      {doc.required && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  </div>
                  {isUploaded && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </div>

                <input
                  type="file"
                  ref={(el) => fileInputRefs.current[doc.id] = el}
                  onChange={(e) => handleFileChange(doc.id, e)}
                  accept={doc.allowedTypes.join(',')}
                  className="hidden"
                />

                {isUploading ? (
                  <div className="space-y-2">
                    <Progress value={doc.progress} className="h-2" />
                    <p className="text-sm text-center text-gray-600">Uploading...</p>
                  </div>
                ) : isUploaded ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewDocument(doc.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRemoveDocument(doc.id)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleFileSelect(doc.id)}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                )}

                {!isUploaded && !isUploading && (
                  <div className="mt-2 text-xs text-gray-500">
                    Max: {doc.maxSize}MB • {doc.allowedTypes.map(t => t.split('/')[1]).join(', ')}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Upload Instructions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Requirements
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• All documents must be clear and legible</li>
                <li>• PDF files are preferred for multi-page documents</li>
                <li>• Images should be in JPG or PNG format</li>
                <li>• Maximum file size for each document is specified above</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Tips
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Use a scanner or scanning app for best quality</li>
                <li>• Ensure text is readable and not cut off</li>
                <li>• Verify document validity dates</li>
                <li>• Save documents with descriptive names</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-blue-600 mt-0.5">ℹ️</div>
            <div className="text-sm text-blue-700">
              <p className="font-medium">Important Notice</p>
              <p>All documents will be verified by the university administration. Please ensure all uploaded documents are authentic and up-to-date. Falsification of documents may lead to disciplinary action including expulsion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}