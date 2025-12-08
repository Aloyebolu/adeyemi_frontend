// components/edit-profile/stages/AcademicInfoStage.tsx
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import NigerianUniversities from "@/data/nigerian-universities";
// import NigerianSecondarySchools from "@/data/nigerian-secondary-schools";

interface AcademicInfoStageProps {
  data: any;
  onUpdate: (data: any) => void;
}

export default function AcademicInfoStage({ data, onUpdate }: AcademicInfoStageProps) {
  const handleChange = (field: string, value: any) => {
    onUpdate({
      academicInfo: {
        ...data.academicInfo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="matricNumber">Matriculation Number *</Label>
          <Input
            id="matricNumber"
            value={data.academicInfo.matricNumber}
            onChange={(e) => handleChange("matricNumber", e.target.value)}
            placeholder="e.g., AFUED/SCI/22/001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="faculty">Faculty *</Label>
          <Select
            value={data.academicInfo.faculty}
            onValueChange={(value) => handleChange("faculty", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select faculty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Science">Faculty of Science</SelectItem>
              <SelectItem value="Arts">Faculty of Arts</SelectItem>
              <SelectItem value="Education">Faculty of Education</SelectItem>
              <SelectItem value="Social Sciences">Faculty of Social Sciences</SelectItem>
              <SelectItem value="Management Sciences">Faculty of Management Sciences</SelectItem>
              <SelectItem value="Engineering">Faculty of Engineering</SelectItem>
              <SelectItem value="Law">Faculty of Law</SelectItem>
              <SelectItem value="Medicine">Faculty of Medicine</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Input
            id="department"
            value={data.academicInfo.department}
            onChange={(e) => handleChange("department", e.target.value)}
            placeholder="e.g., Computer Science"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="program">Program *</Label>
          <Input
            id="program"
            value={data.academicInfo.program}
            onChange={(e) => handleChange("program", e.target.value)}
            placeholder="e.g., B.Sc Computer Science"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="level">Level *</Label>
          <Select
            value={data.academicInfo.level}
            onValueChange={(value) => handleChange("level", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">100 Level</SelectItem>
              <SelectItem value="200">200 Level</SelectItem>
              <SelectItem value="300">300 Level</SelectItem>
              <SelectItem value="400">400 Level</SelectItem>
              <SelectItem value="500">500 Level</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="modeOfEntry">Mode of Entry *</Label>
          <Select
            value={data.academicInfo.modeOfEntry}
            onValueChange={(value) => handleChange("modeOfEntry", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select mode of entry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTME">UTME</SelectItem>
              <SelectItem value="Direct Entry">Direct Entry</SelectItem>
              <SelectItem value="Transfer">Transfer</SelectItem>
              <SelectItem value="Remedial">Remedial</SelectItem>
              <SelectItem value="Pre-Degree">Pre-Degree</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jambRegNumber">JAMB Registration Number *</Label>
          <Input
            id="jambRegNumber"
            value={data.academicInfo.jambRegNumber}
            onChange={(e) => handleChange("jambRegNumber", e.target.value)}
            placeholder="e.g., 12345678AA"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jambScore">JAMB Score *</Label>
          <Input
            id="jambScore"
            type="number"
            min="120"
            max="400"
            value={data.academicInfo.jambScore}
            onChange={(e) => handleChange("jambScore", parseInt(e.target.value))}
            placeholder="Enter JAMB score"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="secondarySchool">Secondary School Attended *</Label>
        {/* <Select
          value={data.academicInfo.secondarySchool}
          onValueChange={(value) => handleChange("secondarySchool", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select secondary school" />
          </SelectTrigger>
          <SelectContent>
            {NigerianSecondarySchools.map((school) => (
              <SelectItem key={school} value={school}>
                {school}
              </SelectItem>
            ))}
            <SelectItem value="Other">Other (Specify below)</SelectItem>
          </SelectContent>
        </Select> */}
        {data.academicInfo.secondarySchool === "Other" && (
          <Input
            className="mt-2"
            placeholder="Enter secondary school name"
            value={data.academicInfo.secondarySchoolCustom || ""}
            onChange={(e) => handleChange("secondarySchoolCustom", e.target.value)}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="secondarySchoolYear">Year of Graduation *</Label>
          <Select
            value={data.academicInfo.secondarySchoolYear}
            onValueChange={(value) => handleChange("secondarySchoolYear", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {data.academicInfo.modeOfEntry === "Direct Entry" && (
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-semibold">Direct Entry Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="previousInstitution">Previous Institution</Label>
              <Input
                id="previousInstitution"
                value={data.academicInfo.previousInstitution || ""}
                onChange={(e) => handleChange("previousInstitution", e.target.value)}
                placeholder="Name of previous institution"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousQualification">Qualification Obtained</Label>
              <Input
                id="previousQualification"
                value={data.academicInfo.previousQualification || ""}
                onChange={(e) => handleChange("previousQualification", e.target.value)}
                placeholder="e.g., ND, HND, NCE"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}