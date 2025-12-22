// components/edit-profile/stages/MedicalInfoStage.tsx
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface MedicalInfoStageProps {
  data: any;
  onUpdate: (data: any) => void;
}

export default function MedicalInfoStage({ data, onUpdate }: MedicalInfoStageProps) {
  const handleChange = (field: string, value: any) => {
    onUpdate({
      medicalInfo: {
        ...data.medicalInfo,
        [field]: value,
      },
    });
  };

  const handleToggle = (field: string, value: boolean) => {
    handleChange(field, value);
    if (!value) {
      // Clear the related field when toggled off
      const clearFields: Record<string, string> = {};
      switch (field) {
        case 'hasAllergies':
          clearFields.allergies = '';
          break;
        case 'hasChronicConditions':
          clearFields.chronicConditions = '';
          break;
        case 'hasDisabilities':
          clearFields.disabilities = '';
          break;
        case 'onMedications':
          clearFields.medications = '';
          break;
      }
      onUpdate({
        medicalInfo: {
          ...data.medicalInfo,
          ...clearFields,
        },
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Medical Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Medical Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Blood Group *</Label>
            <Select
              value={data.medicalInfo.bloodGroup}
              onValueChange={(value) => handleChange("bloodGroup", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genotype">Genotype *</Label>
            <Select
              value={data.medicalInfo.genotype}
              onValueChange={(value) => handleChange("genotype", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select genotype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AA">AA</SelectItem>
                <SelectItem value="AS">AS</SelectItem>
                <SelectItem value="SS">SS</SelectItem>
                <SelectItem value="AC">AC</SelectItem>
                <SelectItem value="CC">CC</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={data.medicalInfo.height || ""}
              onChange={(e) => handleChange("height", e.target.value)}
              placeholder="Enter height in cm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={data.medicalInfo.weight || ""}
              onChange={(e) => handleChange("weight", e.target.value)}
              placeholder="Enter weight in kg"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Medical Conditions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Medical Conditions</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Do you have any allergies? *</Label>
              <p className="text-sm text-gray-600">Include food, drug, or environmental allergies</p>
            </div>
            <Switch
              checked={data.medicalInfo.hasAllergies || false}
              onCheckedChange={(checked) => handleToggle("hasAllergies", checked)}
            />
          </div>
          {data.medicalInfo.hasAllergies && (
            <Textarea
              value={data.medicalInfo.allergies || ""}
              onChange={(e) => handleChange("allergies", e.target.value)}
              placeholder="Describe your allergies in detail..."
              rows={3}
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Chronic medical conditions? *</Label>
              <p className="text-sm text-gray-600">e.g., Asthma, Diabetes, Hypertension, etc.</p>
            </div>
            <Switch
              checked={data.medicalInfo.hasChronicConditions || false}
              onCheckedChange={(checked) => handleToggle("hasChronicConditions", checked)}
            />
          </div>
          {data.medicalInfo.hasChronicConditions && (
            <Textarea
              value={data.medicalInfo.chronicConditions || ""}
              onChange={(e) => handleChange("chronicConditions", e.target.value)}
              placeholder="Describe your chronic conditions..."
              rows={3}
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Physical disabilities? *</Label>
              <p className="text-sm text-gray-600">Any physical challenges or disabilities</p>
            </div>
            <Switch
              checked={data.medicalInfo.hasDisabilities || false}
              onCheckedChange={(checked) => handleToggle("hasDisabilities", checked)}
            />
          </div>
          {data.medicalInfo.hasDisabilities && (
            <Textarea
              value={data.medicalInfo.disabilities || ""}
              onChange={(e) => handleChange("disabilities", e.target.value)}
              placeholder="Describe any disabilities..."
              rows={3}
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Currently on medication? *</Label>
              <p className="text-sm text-gray-600">Regular medications you're taking</p>
            </div>
            <Switch
              checked={data.medicalInfo.onMedications || false}
              onCheckedChange={(checked) => handleToggle("onMedications", checked)}
            />
          </div>
          {data.medicalInfo.onMedications && (
            <Textarea
              value={data.medicalInfo.medications || ""}
              onChange={(e) => handleChange("medications", e.target.value)}
              placeholder="List medications with dosage..."
              rows={3}
            />
          )}
        </div>
      </div>

      <Separator />

      {/* Healthcare Provider */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Healthcare Provider Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="doctorName">Primary Doctor's Name</Label>
            <Input
              id="doctorName"
              value={data.medicalInfo.doctorName || ""}
              onChange={(e) => handleChange("doctorName", e.target.value)}
              placeholder="Dr. John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctorPhone">Doctor's Phone</Label>
            <Input
              id="doctorPhone"
              value={data.medicalInfo.doctorPhone || ""}
              onChange={(e) => handleChange("doctorPhone", e.target.value)}
              placeholder="+234 801 234 5678"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hospitalName">Hospital/Clinic Name</Label>
            <Input
              id="hospitalName"
              value={data.medicalInfo.hospitalName || ""}
              onChange={(e) => handleChange("hospitalName", e.target.value)}
              placeholder="General Hospital"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insuranceProvider">Health Insurance Provider</Label>
            <Input
              id="insuranceProvider"
              value={data.medicalInfo.insuranceProvider || ""}
              onChange={(e) => handleChange("insuranceProvider", e.target.value)}
              placeholder="NHIS, HMO Name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hospitalAddress">Hospital Address</Label>
          <Textarea
            id="hospitalAddress"
            value={data.medicalInfo.hospitalAddress || ""}
            onChange={(e) => handleChange("hospitalAddress", e.target.value)}
            placeholder="Full hospital address"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insuranceNumber">Insurance Policy Number</Label>
          <Input
            id="insuranceNumber"
            value={data.medicalInfo.insuranceNumber || ""}
            onChange={(e) => handleChange("insuranceNumber", e.target.value)}
            placeholder="Policy/ID Number"
          />
        </div>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
          <div className="text-sm text-yellow-700">
            <p className="font-medium">Medical Information Disclaimer</p>
            <p>This information is collected for emergency purposes only. It will be kept confidential and accessed only by authorized medical personnel when necessary for your care.</p>
          </div>
        </div>
      </div>
    </div>
  );
}