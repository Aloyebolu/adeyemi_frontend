// components/edit-profile/stages/ContactInfoStage.tsx
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import NigerianStatesLGAs from "@/data/nigerian-states-lgas";
import { useState } from "react";

interface ContactInfoStageProps {
  data: any;
  onUpdate: (data: any) => void;
}

export default function ContactInfoStage({ data, onUpdate }: ContactInfoStageProps) {
  const [sameAsPermanent, setSameAsPermanent] = useState(
    data.contactInfo.residentialAddress === data.contactInfo.permanentAddress
  );

  const handleChange = (field: string, value: any) => {
    onUpdate({
      contactInfo: {
        ...data.contactInfo,
        [field]: value,
      },
    });
  };

  const handleSameAsPermanent = (checked: boolean) => {
    setSameAsPermanent(checked);
    if (checked) {
      onUpdate({
        contactInfo: {
          ...data.contactInfo,
          residentialAddress: data.contactInfo.permanentAddress,
          residentialCity: data.contactInfo.permanentCity,
          residentialState: data.contactInfo.permanentState,
          residentialLGA: data.contactInfo.permanentLGA,
        },
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Permanent Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Permanent Home Address</h3>
        <div className="space-y-2">
          <Label htmlFor="permanentAddress">Full Address *</Label>
          <Textarea
            id="permanentAddress"
            value={data.contactInfo.permanentAddress}
            onChange={(e) => handleChange("permanentAddress", e.target.value)}
            placeholder="House number, street, town/village"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="permanentCity">City/Town *</Label>
            <Input
              id="permanentCity"
              value={data.contactInfo.permanentCity}
              onChange={(e) => handleChange("permanentCity", e.target.value)}
              placeholder="Enter city or town"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permanentState">State *</Label>
            <Select
              value={data.contactInfo.permanentState}
              onValueChange={(value) => handleChange("permanentState", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(NigerianStatesLGAs).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="permanentLGA">LGA *</Label>
            <Select
              value={data.contactInfo.permanentLGA}
              onValueChange={(value) => handleChange("permanentLGA", value)}
              disabled={!data.contactInfo.permanentState}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                {data.contactInfo.permanentState && 
                  NigerianStatesLGAs[data.contactInfo.permanentState]?.map((lga: string) => (
                    <SelectItem key={lga} value={lga}>
                      {lga}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Residential Address */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Current Residential Address</h3>
          <div className="flex items-center space-x-2">
            <Switch
              checked={sameAsPermanent}
              onCheckedChange={handleSameAsPermanent}
            />
            <Label>Same as Permanent Address</Label>
          </div>
        </div>

        {!sameAsPermanent && (
          <>
            <div className="space-y-2">
              <Label htmlFor="residentialAddress">Full Address *</Label>
              <Textarea
                id="residentialAddress"
                value={data.contactInfo.residentialAddress}
                onChange={(e) => handleChange("residentialAddress", e.target.value)}
                placeholder="House number, street, area"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="residentialCity">City/Town *</Label>
                <Input
                  id="residentialCity"
                  value={data.contactInfo.residentialCity}
                  onChange={(e) => handleChange("residentialCity", e.target.value)}
                  placeholder="Enter city or town"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="residentialState">State *</Label>
                <Select
                  value={data.contactInfo.residentialState}
                  onValueChange={(value) => handleChange("residentialState", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(NigerianStatesLGAs).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="residentialLGA">LGA *</Label>
                <Select
                  value={data.contactInfo.residentialLGA}
                  onValueChange={(value) => handleChange("residentialLGA", value)}
                  disabled={!data.contactInfo.residentialState}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select LGA" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.contactInfo.residentialState && 
                      NigerianStatesLGAs[data.contactInfo.residentialState]?.map((lga: string) => (
                        <SelectItem key={lga} value={lga}>
                          {lga}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Primary Phone Number *</Label>
            <Input
              id="phoneNumber"
              value={data.contactInfo.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="+234 801 234 5678"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternativePhone">Alternative Phone Number</Label>
            <Input
              id="alternativePhone"
              value={data.contactInfo.alternativePhone}
              onChange={(e) => handleChange("alternativePhone", e.target.value)}
              placeholder="+234 802 345 6789"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Primary Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.contactInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="student@afued.edu.ng"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternativeEmail">Alternative Email</Label>
            <Input
              id="alternativeEmail"
              type="email"
              value={data.contactInfo.alternativeEmail}
              onChange={(e) => handleChange("alternativeEmail", e.target.value)}
              placeholder="alternative@example.com"
            />
          </div>
        </div>
      </div>

      {/* Next of Kin */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Next of Kin Information</h3>
        <p className="text-sm text-gray-600">
          Person to be contacted in case of emergency (if different from parents/guardian)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nextOfKinName">Full Name *</Label>
            <Input
              id="nextOfKinName"
              value={data.contactInfo.nextOfKinName}
              onChange={(e) => handleChange("nextOfKinName", e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextOfKinRelationship">Relationship *</Label>
            <Input
              id="nextOfKinRelationship"
              value={data.contactInfo.nextOfKinRelationship}
              onChange={(e) => handleChange("nextOfKinRelationship", e.target.value)}
              placeholder="e.g., Parent, Sibling, Spouse"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nextOfKinPhone">Phone Number *</Label>
            <Input
              id="nextOfKinPhone"
              value={data.contactInfo.nextOfKinPhone}
              onChange={(e) => handleChange("nextOfKinPhone", e.target.value)}
              placeholder="+234 801 234 5678"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextOfKinAddress">Address</Label>
            <Input
              id="nextOfKinAddress"
              value={data.contactInfo.nextOfKinAddress}
              onChange={(e) => handleChange("nextOfKinAddress", e.target.value)}
              placeholder="Enter address"
            />
          </div>
        </div>
      </div>
    </div>
  );
}