// components/edit-profile/stages/PersonalInfoStage.tsx
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calender";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import NigerianStatesLGAs from "@/data/nigerian-states-lgas";

interface PersonalInfoStageProps {
  data: any;
  onUpdate: (data: any) => void;
}

export default function PersonalInfoStage({ data, onUpdate }: PersonalInfoStageProps) {
  const [date, setDate] = useState<Date>(data.personalInfo.dateOfBirth ? new Date(data.personalInfo.dateOfBirth) : undefined);
  const [selectedState, setSelectedState] = useState(data.personalInfo.stateOfOrigin || "");

  const handleChange = (field: string, value: any) => {
    onUpdate({
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      handleChange("dateOfBirth", selectedDate.toISOString());
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={data.personalInfo.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="Enter first name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={data.personalInfo.middleName}
            onChange={(e) => handleChange("middleName", e.target.value)}
            placeholder="Enter middle name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={data.personalInfo.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                className="p-3 pointer-events-auto"
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select
            value={data.personalInfo.gender}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality *</Label>
          <Select
            value={data.personalInfo.nationality}
            onValueChange={(value) => handleChange("nationality", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nigerian">Nigerian</SelectItem>
              <SelectItem value="Ghanaian">Ghanaian</SelectItem>
              <SelectItem value="Other">Other African</SelectItem>
              <SelectItem value="Non-African">Non-African</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="religion">Religion *</Label>
          <Select
            value={data.personalInfo.religion}
            onValueChange={(value) => handleChange("religion", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select religion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Christianity">Christianity</SelectItem>
              <SelectItem value="Islam">Islam</SelectItem>
              <SelectItem value="Traditional">Traditional</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stateOfOrigin">State of Origin *</Label>
          <Select
            value={selectedState}
            onValueChange={(value) => {
              setSelectedState(value);
              handleChange("stateOfOrigin", value);
              handleChange("lga", ""); // Reset LGA when state changes
            }}
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
          <Label htmlFor="lga">Local Government Area *</Label>
          <Select
            value={data.personalInfo.lga}
            onValueChange={(value) => handleChange("lga", value)}
            disabled={!selectedState}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedState ? "Select LGA" : "Select state first"} />
            </SelectTrigger>
            <SelectContent>
              {selectedState && NigerianStatesLGAs[selectedState]?.map((lga: string) => (
                <SelectItem key={lga} value={lga}>
                  {lga}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maritalStatus">Marital Status *</Label>
        <Select
          value={data.personalInfo.maritalStatus}
          onValueChange={(value) => handleChange("maritalStatus", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select marital status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="Married">Married</SelectItem>
            <SelectItem value="Divorced">Divorced</SelectItem>
            <SelectItem value="Widowed">Widowed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}