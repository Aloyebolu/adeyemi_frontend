// components/edit-profile/stages/FamilyInfoStage.tsx
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface FamilyInfoStageProps {
  data: any;
  onUpdate: (data: any) => void;
}

export default function FamilyInfoStage({ data, onUpdate }: FamilyInfoStageProps) {
  const handleChange = (field: string, value: any) => {
    onUpdate({
      familyInfo: {
        ...data.familyInfo,
        [field]: value,
      },
    });
  };

  const handleGuardianSameAsParent = (checked: boolean) => {
    const updates: any = { isGuardianSameAsParent: checked };
    
    if (checked) {
      // Auto-fill guardian info with parent info
      updates.guardianName = data.familyInfo.fatherName || data.familyInfo.motherName;
      updates.guardianRelationship = "Parent";
      updates.guardianOccupation = data.familyInfo.fatherOccupation || data.familyInfo.motherOccupation;
      updates.guardianPhone = data.familyInfo.fatherPhone || data.familyInfo.motherPhone;
      updates.guardianEmail = data.familyInfo.fatherEmail || data.familyInfo.motherEmail;
      updates.guardianAddress = data.familyInfo.fatherAddress || data.familyInfo.motherAddress;
    }
    
    onUpdate({
      familyInfo: {
        ...data.familyInfo,
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Father's Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Father's Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fatherName">Full Name *</Label>
            <Input
              id="fatherName"
              value={data.familyInfo.fatherName}
              onChange={(e) => handleChange("fatherName", e.target.value)}
              placeholder="Enter father's full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatherOccupation">Occupation *</Label>
            <Input
              id="fatherOccupation"
              value={data.familyInfo.fatherOccupation}
              onChange={(e) => handleChange("fatherOccupation", e.target.value)}
              placeholder="Enter occupation"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fatherPhone">Phone Number *</Label>
            <Input
              id="fatherPhone"
              value={data.familyInfo.fatherPhone}
              onChange={(e) => handleChange("fatherPhone", e.target.value)}
              placeholder="+234 801 234 5678"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatherEmail">Email Address</Label>
            <Input
              id="fatherEmail"
              type="email"
              value={data.familyInfo.fatherEmail}
              onChange={(e) => handleChange("fatherEmail", e.target.value)}
              placeholder="father@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatherAddress">Address *</Label>
          <Textarea
            id="fatherAddress"
            value={data.familyInfo.fatherAddress}
            onChange={(e) => handleChange("fatherAddress", e.target.value)}
            placeholder="Enter full address"
            rows={3}
            required
          />
        </div>
      </div>

      <Separator />

      {/* Mother's Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mother's Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="motherName">Full Name *</Label>
            <Input
              id="motherName"
              value={data.familyInfo.motherName}
              onChange={(e) => handleChange("motherName", e.target.value)}
              placeholder="Enter mother's full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motherOccupation">Occupation *</Label>
            <Input
              id="motherOccupation"
              value={data.familyInfo.motherOccupation}
              onChange={(e) => handleChange("motherOccupation", e.target.value)}
              placeholder="Enter occupation"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="motherPhone">Phone Number *</Label>
            <Input
              id="motherPhone"
              value={data.familyInfo.motherPhone}
              onChange={(e) => handleChange("motherPhone", e.target.value)}
              placeholder="+234 801 234 5678"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motherEmail">Email Address</Label>
            <Input
              id="motherEmail"
              type="email"
              value={data.familyInfo.motherEmail}
              onChange={(e) => handleChange("motherEmail", e.target.value)}
              placeholder="mother@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="motherAddress">Address *</Label>
          <Textarea
            id="motherAddress"
            value={data.familyInfo.motherAddress}
            onChange={(e) => handleChange("motherAddress", e.target.value)}
            placeholder="Enter full address"
            rows={3}
            required
          />
        </div>
      </div>

      <Separator />

      {/* Guardian Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Guardian Information</h3>
          <div className="flex items-center space-x-2">
            <Switch
              checked={data.familyInfo.isGuardianSameAsParent}
              onCheckedChange={handleGuardianSameAsParent}
            />
            <Label>Same as Parent</Label>
          </div>
        </div>

        {!data.familyInfo.isGuardianSameAsParent && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guardianName">Full Name *</Label>
                <Input
                  id="guardianName"
                  value={data.familyInfo.guardianName}
                  onChange={(e) => handleChange("guardianName", e.target.value)}
                  placeholder="Enter guardian's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianRelationship">Relationship *</Label>
                <Select
                  value={data.familyInfo.guardianRelationship}
                  onValueChange={(value) => handleChange("guardianRelationship", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Sibling">Sibling</SelectItem>
                    <SelectItem value="Uncle">Uncle</SelectItem>
                    <SelectItem value="Aunt">Aunt</SelectItem>
                    <SelectItem value="Grandparent">Grandparent</SelectItem>
                    <SelectItem value="Other Relative">Other Relative</SelectItem>
                    <SelectItem value="Family Friend">Family Friend</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guardianOccupation">Occupation *</Label>
                <Input
                  id="guardianOccupation"
                  value={data.familyInfo.guardianOccupation}
                  onChange={(e) => handleChange("guardianOccupation", e.target.value)}
                  placeholder="Enter occupation"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianPhone">Phone Number *</Label>
                <Input
                  id="guardianPhone"
                  value={data.familyInfo.guardianPhone}
                  onChange={(e) => handleChange("guardianPhone", e.target.value)}
                  placeholder="+234 801 234 5678"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guardianEmail">Email Address</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  value={data.familyInfo.guardianEmail}
                  onChange={(e) => handleChange("guardianEmail", e.target.value)}
                  placeholder="guardian@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianAddress">Address *</Label>
              <Textarea
                id="guardianAddress"
                value={data.familyInfo.guardianAddress}
                onChange={(e) => handleChange("guardianAddress", e.target.value)}
                placeholder="Enter full address"
                rows={3}
                required
              />
            </div>
          </>
        )}
      </div>

      <Separator />

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Contact</h3>
        <p className="text-sm text-gray-600">
          Provide contact information for someone to contact in case of emergency
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactName">Full Name *</Label>
            <Input
              id="emergencyContactName"
              value={data.familyInfo.emergencyContactName}
              onChange={(e) => handleChange("emergencyContactName", e.target.value)}
              placeholder="Enter emergency contact name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
            <Input
              id="emergencyContactPhone"
              value={data.familyInfo.emergencyContactPhone}
              onChange={(e) => handleChange("emergencyContactPhone", e.target.value)}
              placeholder="+234 801 234 5678"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
          <Input
            id="emergencyContactRelationship"
            value={data.familyInfo.emergencyContactRelationship}
            onChange={(e) => handleChange("emergencyContactRelationship", e.target.value)}
            placeholder="e.g., Parent, Sibling, Uncle"
            required
          />
        </div>
      </div>
    </div>
  );
}