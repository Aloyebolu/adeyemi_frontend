// app/students/edit-profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/Badge";
import { Alert,  } from "@/components/ui/Alert";
import { 
  User, 
  GraduationCap, 
  Users, 
  Home, 
  BookOpen, 
  Shield,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
   Flag,
  Building2
} from "lucide-react";

// Import stage components
import PersonalInfoStage from "@/components/edit-profile/stages/PersonalInfoStage";
import AcademicInfoStage from "@/components/edit-profile/stages/AcademicInfoStage";
import FamilyInfoStage from "@/components/edit-profile/stages/FamilyInfoStage";
import ContactInfoStage from "@/components/edit-profile/stages/ContactInfoStage";
import MedicalInfoStage from "@/components/edit-profile/stages/MedicalInfoStage";
import DocumentsStage from "@/components/edit-profile/stages/DocumentsStage";
import ReviewStage from "@/components/edit-profile/stages/ReviewStage";

// Define stage structure
const stages = [
  { id: 1, name: "Personal Information", icon: User, description: "Basic personal details" },
  { id: 2, name: "Academic Information", icon: GraduationCap, description: "Academic details and history" },
  { id: 3, name: "Family & Guardian", icon: Users, description: "Parent and guardian information" },
  { id: 4, name: "Contact Information", icon: Home, description: "Address and contact details" },
  { id: 5, name: "Medical Information", icon: Shield, description: "Health and medical details" },
  { id: 6, name: "Documents", icon: BookOpen, description: "Upload required documents" },
  { id: 7, name: "Review & Submit", icon: CheckCircle, description: "Review all information" },
];

interface StudentProfileData {
  personalInfo: {
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    gender: "Male" | "Female" | "Other";
    nationality: string;
    stateOfOrigin: string;
    lga: string;
    religion: string;
    maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  };
  
  academicInfo: {
    matricNumber: string;
    faculty: string;
    department: string;
    program: string;
    level: "100" | "200" | "300" | "400" | "500";
    modeOfEntry: "UTME" | "Direct Entry" | "Transfer" | "Remedial";
    jambRegNumber: string;
    jambScore: number;
    secondarySchool: string;
    secondarySchoolYear: string;
    previousInstitution?: string;
    previousQualification?: string;
  };
  
  familyInfo: {
    fatherName: string;
    fatherOccupation: string;
    fatherPhone: string;
    fatherEmail: string;
    fatherAddress: string;
    
    motherName: string;
    motherOccupation: string;
    motherPhone: string;
    motherEmail: string;
    motherAddress: string;
    
    guardianName: string;
    guardianRelationship: string;
    guardianOccupation: string;
    guardianPhone: string;
    guardianEmail: string;
    guardianAddress: string;
    isGuardianSameAsParent: boolean;
    
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelationship: string;
  };
  
  contactInfo: {
    permanentAddress: string;
    permanentCity: string;
    permanentState: string;
    permanentLGA: string;
    
    residentialAddress: string;
    residentialCity: string;
    residentialState: string;
    residentialLGA: string;
    
    phoneNumber: string;
    alternativePhone: string;
    email: string;
    alternativeEmail: string;
    
    nextOfKinName: string;
    nextOfKinRelationship: string;
    nextOfKinPhone: string;
    nextOfKinAddress: string;
  };
  
  medicalInfo: {
    bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "Unknown";
    genotype: "AA" | "AS" | "SS" | "AC" | "CC" | "Unknown";
    allergies: string;
    chronicConditions: string;
    disabilities: string;
    medications: string;
    doctorName: string;
    doctorPhone: string;
    hospitalName: string;
    hospitalAddress: string;
    insuranceProvider: string;
    insuranceNumber: string;
  };
  
  documents: {
    passportPhoto: File | null;
    birthCertificate: File | null;
    jambResult: File | null;
    oLevelResult: File | null;
    stateOfOriginCert: File | null;
    acceptanceLetter: File | null;
    medicalReport: File | null;
    hasUploadedPassport: boolean;
    hasUploadedBirthCert: boolean;
    hasUploadedJamb: boolean;
    hasUploadedOLevel: boolean;
    hasUploadedOriginCert: boolean;
    hasUploadedAcceptance: boolean;
    hasUploadedMedical: boolean;
  };
}

export default function EditStudentProfilePage() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [profileData, setProfileData] = useState<StudentProfileData>({
    personalInfo: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "Male",
      nationality: "Nigerian",
      stateOfOrigin: "",
      lga: "",
      religion: "",
      maritalStatus: "Single",
    },
    academicInfo: {
      matricNumber: "",
      faculty: "",
      department: "",
      program: "",
      level: "100",
      modeOfEntry: "UTME",
      jambRegNumber: "",
      jambScore: 0,
      secondarySchool: "",
      secondarySchoolYear: "",
    },
    familyInfo: {
      fatherName: "",
      fatherOccupation: "",
      fatherPhone: "",
      fatherEmail: "",
      fatherAddress: "",
      motherName: "",
      motherOccupation: "",
      motherPhone: "",
      motherEmail: "",
      motherAddress: "",
      guardianName: "",
      guardianRelationship: "",
      guardianOccupation: "",
      guardianPhone: "",
      guardianEmail: "",
      guardianAddress: "",
      isGuardianSameAsParent: false,
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
    },
    contactInfo: {
      permanentAddress: "",
      permanentCity: "",
      permanentState: "",
      permanentLGA: "",
      residentialAddress: "",
      residentialCity: "",
      residentialState: "",
      residentialLGA: "",
      phoneNumber: "",
      alternativePhone: "",
      email: "",
      alternativeEmail: "",
      nextOfKinName: "",
      nextOfKinRelationship: "",
      nextOfKinPhone: "",
      nextOfKinAddress: "",
    },
    medicalInfo: {
      bloodGroup: "Unknown",
      genotype: "Unknown",
      allergies: "",
      chronicConditions: "",
      disabilities: "",
      medications: "",
      doctorName: "",
      doctorPhone: "",
      hospitalName: "",
      hospitalAddress: "",
      insuranceProvider: "",
      insuranceNumber: "",
    },
    documents: {
      passportPhoto: null,
      birthCertificate: null,
      jambResult: null,
      oLevelResult: null,
      stateOfOriginCert: null,
      acceptanceLetter: null,
      medicalReport: null,
      hasUploadedPassport: false,
      hasUploadedBirthCert: false,
      hasUploadedJamb: false,
      hasUploadedOLevel: false,
      hasUploadedOriginCert: false,
      hasUploadedAcceptance: false,
      hasUploadedMedical: false,
    },
  });

  // Load existing data on mount
  useEffect(() => {
    fetchExistingProfile();
  }, []);

  const fetchExistingProfile = async () => {
    try {
      const response = await fetch("/api/students/profile");
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        // Mark completed stages based on filled data
        const filledStages = [];
        if (data.personalInfo.firstName) filledStages.push(1);
        if (data.academicInfo.matricNumber) filledStages.push(2);
        if (data.familyInfo.fatherName) filledStages.push(3);
        if (data.contactInfo.phoneNumber) filledStages.push(4);
        if (data.medicalInfo.bloodGroup !== "Unknown") filledStages.push(5);
        if (data.documents.hasUploadedPassport) filledStages.push(6);
        setCompletedStages(filledStages);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleStageUpdate = (stageId: number, data: Partial<StudentProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
    
    // Mark stage as completed
    if (!completedStages.includes(stageId)) {
      setCompletedStages(prev => [...prev, stageId]);
    }
    
    // Save stage data immediately
    saveStageData(stageId, data);
  };

  const saveStageData = async (stageId: number, data: Partial<StudentProfileData>) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/students/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageId, data }),
      });
      
      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      setSaveStatus("error");
      console.error("Failed to save stage:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextStage = () => {
    if (currentStage < stages.length) {
      setCurrentStage(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStage = () => {
    if (currentStage > 1) {
      setCurrentStage(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/students/profile/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      
      if (response.ok) {
        alert("Profile submitted successfully!");
        router.push("/students/profile");
      }
    } catch (error) {
      alert("Failed to submit profile");
    } finally {
      setIsSaving(false);
    }
  };

  const progressPercentage = (completedStages.length / stages.length) * 100;

  const renderStage = () => {
    const stageProps = {
      data: profileData,
      onUpdate: (data: Partial<StudentProfileData>) => handleStageUpdate(currentStage, data),
    };

    switch (currentStage) {
      case 1:
        return <PersonalInfoStage {...stageProps} />;
      case 2:
        return <AcademicInfoStage {...stageProps} />;
      case 3:
        return <FamilyInfoStage {...stageProps} />;
      case 4:
        return <ContactInfoStage {...stageProps} />;
      case 5:
        return <MedicalInfoStage {...stageProps} />;
      case 6:
        return <DocumentsStage {...stageProps} />;
      case 7:
        return <ReviewStage {...stageProps} />;
      default:
        return <PersonalInfoStage {...stageProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/students/profile")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-white flex items-center justify-center shadow">
                <Flag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">AFUED Student Profile</h1>
                <p className="text-sm text-gray-600">Complete your profile in stages</p>
              </div>
            </div>
          </div>
          
          <Badge variant="outline" className="px-4 py-2">
            <Building2 className="w-4 h-4 mr-2" />
            Student Portal
          </Badge>
        </div>

        {/* Progress and Stages */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stages Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {stages.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => setCurrentStage(stage.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentStage === stage.id
                          ? "bg-primary text-primary-foreground"
                          : completedStages.includes(stage.id)
                          ? "bg-green-50 border border-green-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          currentStage === stage.id
                            ? "bg-primary-foreground/20"
                            : completedStages.includes(stage.id)
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}>
                          <stage.icon className={`w-4 h-4 ${
                            currentStage === stage.id
                              ? "text-primary-foreground"
                              : completedStages.includes(stage.id)
                              ? "text-green-600"
                              : "text-gray-600"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${
                              currentStage === stage.id ? "text-primary-foreground" : "text-gray-800"
                            }`}>
                              {stage.name}
                            </span>
                            {completedStages.includes(stage.id) && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p className={`text-xs ${
                            currentStage === stage.id ? "text-primary-foreground/80" : "text-gray-500"
                          }`}>
                            {stage.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Save Status */}
            {saveStatus !== "idle" && (
              <Alert className={`mt-4 ${
                saveStatus === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}>
                {saveStatus === "success" ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                {/* <AlertDescription className={
                  saveStatus === "success" ? "text-green-800" : "text-red-800"
                }>
                  {saveStatus === "success" 
                    ? "Stage saved successfully!" 
                    : "Failed to save. Please try again."}
                </AlertDescription> */}
              </Alert>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {stages[currentStage - 1]?.name}
                    </CardTitle>
                    <p className="text-gray-600">
                      {stages[currentStage - 1]?.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">
                    Stage {currentStage} of {stages.length}
                  </Badge>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="p-6">
                {renderStage()}
              </CardContent>

              <Separator />

              <CardFooter className="flex justify-between p-6">
                <div>
                  {isSaving && (
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                      Saving changes...
                    </span>
                  )}
                </div>
                
                <div className="flex gap-3">
                  {currentStage > 1 && (
                    <Button
                      variant="outline"
                      onClick={handlePreviousStage}
                      disabled={isSaving}
                    >
                      Previous
                    </Button>
                  )}
                  
                  {currentStage < stages.length ? (
                    <Button
                      onClick={handleNextStage}
                      disabled={isSaving}
                      className="gap-2"
                    >
                      Next Stage
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFinalSubmit}
                      disabled={isSaving}
                      className="gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Submit Profile
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>

            {/* Stage Indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setCurrentStage(stage.id)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentStage === stage.id
                      ? "bg-primary w-8"
                      : completedStages.includes(stage.id)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                  title={stage.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}