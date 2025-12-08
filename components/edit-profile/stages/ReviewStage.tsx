// components/edit-profile/stages/ReviewStage.tsx
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  AlertCircle, 
  Edit,
  User,
  GraduationCap,
  Users,
  Home,
  Shield,
  BookOpen,
  FileText,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "recharts";

interface ReviewStageProps {
  data: any;
  onUpdate: (data: any) => void;
}

export default function ReviewStage({ data, onUpdate }: ReviewStageProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'personalInfo',
    'academicInfo',
    'familyInfo'
  ]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getCompletionStatus = () => {
    const requiredFields = [
      // Personal Info
      data.personalInfo.firstName,
      data.personalInfo.lastName,
      data.personalInfo.dateOfBirth,
      data.personalInfo.gender,
      data.personalInfo.nationality,
      data.personalInfo.stateOfOrigin,
      data.personalInfo.lga,
      data.personalInfo.religion,
      data.personalInfo.maritalStatus,
      
      // Academic Info
      data.academicInfo.matricNumber,
      data.academicInfo.faculty,
      data.academicInfo.department,
      data.academicInfo.program,
      data.academicInfo.level,
      data.academicInfo.modeOfEntry,
      data.academicInfo.jambRegNumber,
      data.academicInfo.jambScore,
      data.academicInfo.secondarySchool,
      data.academicInfo.secondarySchoolYear,
      
      // Family Info
      data.familyInfo.fatherName,
      data.familyInfo.fatherOccupation,
      data.familyInfo.fatherPhone,
      data.familyInfo.motherName,
      data.familyInfo.motherOccupation,
      data.familyInfo.motherPhone,
      data.familyInfo.emergencyContactName,
      data.familyInfo.emergencyContactPhone,
      
      // Contact Info
      data.contactInfo.permanentAddress,
      data.contactInfo.permanentCity,
      data.contactInfo.permanentState,
      data.contactInfo.phoneNumber,
      data.contactInfo.email,
      data.contactInfo.nextOfKinName,
      data.contactInfo.nextOfKinPhone,
      
      // Medical Info
      data.medicalInfo.bloodGroup,
      data.medicalInfo.genotype,
      
      // Documents
      data.documents.hasUploadedPassport,
      data.documents.hasUploadedBirthCert,
      data.documents.hasUploadedJamb,
      data.documents.hasUploadedOLevel,
      data.documents.hasUploadedOriginCert,
      data.documents.hasUploadedAcceptance,
      data.documents.hasUploadedMedical,
    ];

    const completedCount = requiredFields.filter(Boolean).length;
    const totalCount = requiredFields.length;
    const percentage = Math.round((completedCount / totalCount) * 100);
    
    return {
      completed: completedCount,
      total: totalCount,
      percentage,
      isComplete: completedCount === totalCount,
      missingFields: totalCount - completedCount,
    };
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const status = getCompletionStatus();

  const sections = [
    {
      id: 'personalInfo',
      title: 'Personal Information',
      icon: User,
      data: [
        { label: 'Full Name', value: `${data.personalInfo.firstName} ${data.personalInfo.middleName} ${data.personalInfo.lastName}` },
        { label: 'Date of Birth', value: formatDate(data.personalInfo.dateOfBirth) },
        { label: 'Gender', value: data.personalInfo.gender },
        { label: 'Nationality', value: data.personalInfo.nationality },
        { label: 'State of Origin', value: `${data.personalInfo.stateOfOrigin} State` },
        { label: 'LGA', value: data.personalInfo.lga },
        { label: 'Religion', value: data.personalInfo.religion },
        { label: 'Marital Status', value: data.personalInfo.maritalStatus },
      ]
    },
    {
      id: 'academicInfo',
      title: 'Academic Information',
      icon: GraduationCap,
      data: [
        { label: 'Matric Number', value: data.academicInfo.matricNumber },
        { label: 'Faculty', value: data.academicInfo.faculty },
        { label: 'Department', value: data.academicInfo.department },
        { label: 'Program', value: data.academicInfo.program },
        { label: 'Level', value: `${data.academicInfo.level} Level` },
        { label: 'Mode of Entry', value: data.academicInfo.modeOfEntry },
        { label: 'JAMB Reg Number', value: data.academicInfo.jambRegNumber },
        { label: 'JAMB Score', value: data.academicInfo.jambScore },
        { label: 'Secondary School', value: data.academicInfo.secondarySchool },
        { label: 'Year of Graduation', value: data.academicInfo.secondarySchoolYear },
      ]
    },
    {
      id: 'familyInfo',
      title: 'Family & Guardian Information',
      icon: Users,
      data: [
        { label: "Father's Name", value: data.familyInfo.fatherName },
        { label: "Father's Occupation", value: data.familyInfo.fatherOccupation },
        { label: "Father's Phone", value: data.familyInfo.fatherPhone },
        { label: "Mother's Name", value: data.familyInfo.motherName },
        { label: "Mother's Occupation", value: data.familyInfo.motherOccupation },
        { label: "Mother's Phone", value: data.familyInfo.motherPhone },
        { label: 'Guardian Name', value: data.familyInfo.guardianName || 'Same as Parent' },
        { label: 'Emergency Contact', value: `${data.familyInfo.emergencyContactName} (${data.familyInfo.emergencyContactPhone})` },
      ]
    },
    {
      id: 'contactInfo',
      title: 'Contact Information',
      icon: Home,
      data: [
        { label: 'Permanent Address', value: data.contactInfo.permanentAddress },
        { label: 'Permanent City/State', value: `${data.contactInfo.permanentCity}, ${data.contactInfo.permanentState}` },
        { label: 'Residential Address', value: data.contactInfo.residentialAddress || 'Same as Permanent' },
        { label: 'Phone Number', value: data.contactInfo.phoneNumber },
        { label: 'Email', value: data.contactInfo.email },
        { label: 'Next of Kin', value: `${data.contactInfo.nextOfKinName} (${data.contactInfo.nextOfKinRelationship})` },
      ]
    },
    {
      id: 'medicalInfo',
      title: 'Medical Information',
      icon: Shield,
      data: [
        { label: 'Blood Group', value: data.medicalInfo.bloodGroup },
        { label: 'Genotype', value: data.medicalInfo.genotype },
        { label: 'Allergies', value: data.medicalInfo.allergies || 'None reported' },
        { label: 'Chronic Conditions', value: data.medicalInfo.chronicConditions || 'None reported' },
        { label: 'Disabilities', value: data.medicalInfo.disabilities || 'None reported' },
        { label: 'Primary Doctor', value: data.medicalInfo.doctorName || 'Not specified' },
      ]
    },
    {
      id: 'documents',
      title: 'Uploaded Documents',
      icon: BookOpen,
      data: [
        { 
          label: 'Passport Photo', 
          value: data.documents.hasUploadedPassport ? '✓ Uploaded' : '✗ Missing',
          status: data.documents.hasUploadedPassport ? 'complete' : 'missing'
        },
        { 
          label: 'Birth Certificate', 
          value: data.documents.hasUploadedBirthCert ? '✓ Uploaded' : '✗ Missing',
          status: data.documents.hasUploadedBirthCert ? 'complete' : 'missing'
        },
        { 
          label: 'JAMB Result', 
          value: data.documents.hasUploadedJamb ? '✓ Uploaded' : '✗ Missing',
          status: data.documents.hasUploadedJamb ? 'complete' : 'missing'
        },
        { 
          label: "O'Level Result", 
          value: data.documents.hasUploadedOLevel ? '✓ Uploaded' : '✗ Missing',
          status: data.documents.hasUploadedOLevel ? 'complete' : 'missing'
        },
        { 
          label: 'State of Origin Certificate', 
          value: data.documents.hasUploadedOriginCert ? '✓ Uploaded' : '✗ Missing',
          status: data.documents.hasUploadedOriginCert ? 'complete' : 'missing'
        },
        { 
          label: 'Admission Letter', 
          value: data.documents.hasUploadedAcceptance ? '✓ Uploaded' : '✗ Missing',
          status: data.documents.hasUploadedAcceptance ? 'complete' : 'missing'
        },
        { 
          label: 'Medical Certificate', 
          value: data.documents.hasUploadedMedical ? '✓ Uploaded' : '✗ Missing',
          status: data.documents.hasUploadedMedical ? 'complete' : 'missing'
        },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Profile Completion Status</h3>
              <p className="text-sm text-gray-600">
                Review all information before final submission
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{status.percentage}%</div>
              <p className="text-sm text-gray-600">
                {status.completed} of {status.total} required fields completed
              </p>
            </div>
          </div>
          
          {status.isComplete ? (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">All required information is complete!</p>
                  <p className="text-sm text-green-700">You can now submit your profile for verification.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">
                    {status.missingFields} required fields are missing
                  </p>
                  <p className="text-sm text-yellow-700">
                    Please complete all sections before submission.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardContent className="p-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <section.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{section.title}</h3>
                    <p className="text-sm text-gray-600">
                      {expandedSections.includes(section.id) 
                        ? 'Click to collapse' 
                        : 'Click to expand'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {section.id === 'documents' && (
                    <Badge variant={
                      section.data.every((item: any) => item.status === 'complete') 
                        ? 'default' 
                        : 'destructive'
                    }>
                      {section.data.filter((item: any) => item.status === 'complete').length} / {section.data.length}
                    </Badge>
                  )}
                  <ChevronRight className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    expandedSections.includes(section.id) && "rotate-90"
                  )} />
                </div>
              </button>

              {expandedSections.includes(section.id) && (
                <>
                  <Separator />
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.data.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            {item.label}
                          </Label>
                          <div className={cn(
                            "p-3 rounded-lg border",
                            item.status === 'missing' 
                              ? "bg-red-50 border-red-200 text-red-800"
                              : "bg-gray-50 border-gray-200"
                          )}>
                            <p className={item.status === 'missing' ? "font-medium" : ""}>
                              {item.value || 'Not provided'}
                            </p>
                            {item.status === 'missing' && (
                              <p className="text-xs mt-1 text-red-600">
                                This document is required for profile verification
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Navigate to the appropriate stage
                          const stageMap: Record<string, number> = {
                            personalInfo: 1,
                            academicInfo: 2,
                            familyInfo: 3,
                            contactInfo: 4,
                            medicalInfo: 5,
                            documents: 6,
                          };
                          const stage = stageMap[section.id];
                          if (stage) {
                            // This would be handled by the parent component
                            alert(`Would navigate to Stage ${stage}: ${section.title}`);
                          }
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Section
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Declaration */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Declaration</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-primary mt-0.5">✓</div>
                <p className="text-gray-700">
                  I hereby declare that all information provided in this profile is true, complete, and accurate to the best of my knowledge.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-primary mt-0.5">✓</div>
                <p className="text-gray-700">
                  I understand that any false information or omission may lead to disciplinary action including expulsion from the university.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-primary mt-0.5">✓</div>
                <p className="text-gray-700">
                  I authorize the university to verify the information provided and to conduct background checks as necessary.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-primary mt-0.5">✓</div>
                <p className="text-gray-700">
                  I consent to the collection, storage, and use of my personal information for academic and administrative purposes.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Important Notice</p>
                <p>By submitting this profile, you agree to the terms and conditions of the university's data protection policy and student code of conduct.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}