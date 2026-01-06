import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { BookOpen, Calendar, Hash, Layers, School, Type, FileText, ExternalLink } from "lucide-react";

interface CourseDetailsProps {
  selectedCourse: {
    title: string;
    courseCode: string;
    unit: number;
    level: string;
    semester: string;
    type: string;
    borrowed?: boolean;
    borrowed_department?: { name: string };
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export const CourseDetails = ({ selectedCourse }: CourseDetailsProps) => {
  // Icon mapping for different fields
  const fieldIcons = {
    title: BookOpen,
    courseCode: Hash,
    unit: Layers,
    level: School,
    semester: Calendar,
    type: Type,
    description: FileText,
    borrowed: ExternalLink
  };

  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Main detail fields with enhanced data
  const detailFields = [
    {
      label: "Course Title",
      value: selectedCourse.name,
      icon: fieldIcons.title,
      className: "text-lg font-semibold text-gray-900"
    },
    {
      label: "Course Code",
      value: selectedCourse.code,
      icon: fieldIcons.courseCode,
      className: "font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded"
    },
    {
      label: "Unit",
      value: `${selectedCourse.unit} Unit${selectedCourse.unit !== 1 ? 's' : ''}`,
      icon: fieldIcons.unit,
      className: "text-green-600"
    },
    {
      label: "Level",
      value: selectedCourse.level,
      icon: fieldIcons.level,
      className: "text-purple-600"
    },
    {
      label: "Semester",
      value: `Semester ${selectedCourse.semester}`,
      icon: fieldIcons.semester,
      className: "text-orange-600"
    },
    {
      label: "Type",
      value: selectedCourse.borrowed ? (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <ExternalLink className="w-3 h-3 mr-1" />
          Borrowed ({selectedCourse.type})
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-gray-50 text-gray-700">
          {selectedCourse.type}
        </Badge>
      ),
      icon: fieldIcons.type
    }
  ];

  return (
    <div className="h-[200vh] overflow-scroll ">

      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Course Details
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Complete information about {selectedCourse.courseCode}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge 
            variant={selectedCourse.borrowed ? "default" : "secondary"}
            className={selectedCourse.borrowed ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
          >
            {selectedCourse.borrowed ? "Borrowed Course" : "Regular Course"}
          </Badge>
        </div>
      </div>

      {/* Main Details Card */}
      <Card className="border-l-4 border-l-blue-500 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detailFields.map((field, index) => {
              const IconComponent = field.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {field.label}
                    </p>
                    <div className={field.className}>
                      {field.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Borrowed Department Info */}
          {selectedCourse.borrowed && selectedCourse.borrowed_department && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3">
                <ExternalLink className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-900 mb-1">
                    Borrowed From Department 
                  </p>
                  <p className="text-purple-700 font-semibold">
                    {selectedCourse.borrowed_department}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Description Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
          </div>
          <div className="prose prose-sm max-w-none">
            {selectedCourse.description ? (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedCourse.description}
              </p>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No description provided for this course.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metadata Section */}
      {(selectedCourse.createdAt || selectedCourse.updatedAt) && (
        <Card className="bg-gray-50 border-0">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
              {selectedCourse.createdAt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3 h-3" />
                  <span>Created: {formatDate(selectedCourse.createdAt)}</span>
                </div>
              )}
              {selectedCourse.updatedAt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3 h-3" />
                  <span>Last Updated: {formatDate(selectedCourse.updatedAt)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
          <div className="text font-bold text-blue-600">{selectedCourse.unit}</div>
          <div className="text-xs text-gray-500 mt-1">Units</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
          <div className="text font-bold text-green-600">{selectedCourse.level}</div>
          <div className="text-xs text-gray-500 mt-1">Level</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
          <div className="text font-bold text-purple-600">{selectedCourse.semester}</div>
          <div className="text-xs text-gray-500 mt-1">Semester</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
          <div className="text font-bold text-orange-600">
            {selectedCourse.borrowed ? 'Borrowed' : 'Regular'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Type</div>
        </div>
      </div>
    </div>
    // <div className="h-[200vh] bg-gradient-to-b from-blue-100 to-red-100 p-4">
    //   <h2>Test Content</h2>
    //   {Array.from({ length: 50 }).map((_, i) => (
    //     <div key={i} className="p-2 border-b">Item {i + 1}</div>
    //   ))}
    // </div>
  );
};

