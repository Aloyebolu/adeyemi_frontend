"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/hooks/useNotification";
import { useDataFetcher } from "@/lib/dataFetcher";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/Badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import { Search, Plus, Trash2, Edit, Eye, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { usePage } from "@/hooks/usePage";

export default function AdminTemplatePage() {
  const { addNotification } = useNotifications();
  const { fetchData } = useDataFetcher();

  const [templates, setTemplates] = useState<any[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp_template: "",
    email_template: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("");
  const [copiedVar, setCopiedVar] = useState("");
    const { setPage } = usePage()
    useEffect(() => {
      setPage("Messaging Templates")
    }, []);

  // Enhanced university-specific variables with categories
  const variableCategories = [
    {
      category: "User Information",
      variables: [
        { 
          name: "user.name", 
          description: "User's name",
          example: "John"
        },
      ]
    },
    // {
    //   category: "Academic Information",
    //   variables: [
    //     { 
    //       name: "academic.major", 
    //       description: "Student's academic major",
    //       example: "Computer Science"
    //     },
    //     { 
    //       name: "academic.minor", 
    //       description: "Student's academic minor",
    //       example: "Mathematics"
    //     },
    //     { 
    //       name: "academic.college", 
    //       description: "College or school name",
    //       example: "College of Engineering"
    //     },
    //     { 
    //       name: "academic.department", 
    //       description: "Department name",
    //       example: "Computer Science Department"
    //     },
    //     { 
    //       name: "academic.level", 
    //       description: "Academic level (Freshman, Sophomore, etc.)",
    //       example: "Senior"
    //     },
    //     { 
    //       name: "academic.graduation_year", 
    //       description: "Expected graduation year",
    //       example: "2025"
    //     },
    //     { 
    //       name: "academic.gpa", 
    //       description: "Current GPA",
    //       example: "3.75"
    //     },
    //     { 
    //       name: "academic.credits_completed", 
    //       description: "Number of credits completed",
    //       example: "120"
    //     }
    //   ]
    // },
    // {
    //   category: "Course & Enrollment",
    //   variables: [
    //     { 
    //       name: "course.code", 
    //       description: "Course code",
    //       example: "CS-101"
    //     },
    //     { 
    //       name: "course.name", 
    //       description: "Course full name",
    //       example: "Introduction to Programming"
    //     },
    //     { 
    //       name: "course.section", 
    //       description: "Course section number",
    //       example: "01"
    //     },
    //     { 
    //       name: "course.professor", 
    //       description: "Professor/instructor name",
    //       example: "Dr. Smith"
    //     },
    //     { 
    //       name: "course.classroom", 
    //       description: "Classroom location",
    //       example: "Science Building Room 201"
    //     },
    //     { 
    //       name: "course.schedule", 
    //       description: "Class schedule",
    //       example: "Mon/Wed 10:00-11:30 AM"
    //     }
    //   ]
    // },
    // {
    //   category: "Financial",
    //   variables: [
    //     { 
    //       name: "financial.tuition_balance", 
    //       description: "Outstanding tuition balance",
    //       example: "$2,500.00"
    //     },
    //     { 
    //       name: "financial.payment_due_date", 
    //       description: "Next payment due date",
    //       example: "March 15, 2024"
    //     },
    //     { 
    //       name: "financial.aid_status", 
    //       description: "Financial aid status",
    //       example: "Awarded"
    //     },
    //     { 
    //       name: "financial.scholarship_amount", 
    //       description: "Scholarship award amount",
    //       example: "$5,000.00"
    //     }
    //   ]
    // },
    {
      category: "University & Dates",
      variables: [
        // { 
        //   name: "university.name", 
        //   description: "University official name",
        //   example: "Tech University"
        // },
        // { 
        //   name: "university.website", 
        //   description: "University website URL",
        //   example: "https://techuniversity.edu"
        // },
        { 
          name: "timeGreeting", 
          description: "Time-based greeting (Morning/Afternoon/Evening)",
          example: "Good morning! ☀️"
        },
        // { 
        //   name: "current.date", 
        //   description: "Current date",
        //   example: "January 15, 2024"
        // },
        // { 
        //   name: "semester.start_date", 
        //   description: "Semester start date",
        //   example: "January 22, 2024"
        // },
        // { 
        //   name: "semester.end_date", 
        //   description: "Semester end date",
        //   example: "May 10, 2024"
        // },
        { 
          name: "portal_url", 
          description: "University portal URL",
          example: "https://portal.techuniversity.edu"
        }
      ]
    }
  ];

  // Flatten all variables for validation
  const allVariables = variableCategories.flatMap(cat => 
    cat.variables.map(v => v.name)
  );

  const [invalidVars, setInvalidVars] = useState<string[]>([]);
  const [validVars, setValidVars] = useState<string[]>([]);

  // Extract variables from text
  const extractVariables = (text: string) => {
    const matches = text.match(/{{\s*[\w.]+\s*}}/g);
    return matches ? matches.map((m) => m.replace(/{{\s*|\s*}}/g, "")) : [];
  };

  // Validate variables
  const validateVariables = (whatsapp: string, email: string) => {
    const allVars = [...extractVariables(whatsapp), ...extractVariables(email)];
    const invalids = allVars.filter((v) => !allVariables.includes(v));
    const valids = allVars.filter((v) => allVariables.includes(v));
    setInvalidVars([...new Set(invalids)]);
    setValidVars([...new Set(valids)]);
  };

  // Insert variable into template
  const insertVariable = (variableName: string, field: 'whatsapp_template' | 'email_template') => {
    const variable = `{{${variableName}}}`;
    const currentValue = formData[field];
    const newValue = currentValue + (currentValue ? ' ' : '') + variable;
    handleChange(field, newValue);
    setSelectedVariable("");
  };

  // Copy variable to clipboard
  const copyVariable = (variableName: string) => {
    const variable = `{{${variableName}}}`;
    navigator.clipboard.writeText(variable);
    setCopiedVar(variableName);
    setTimeout(() => setCopiedVar(""), 2000);
    addNotification({
      message: `Copied ${variable} to clipboard`,
      variant: "success",
    });
  };

  const loadTemplates = async () => {
    try {
      const { data } = await fetchData("notifications/templates", "GET");
      setTemplates(data || []);
    } catch (err) {
      console.error(err);
      addNotification({
        message: "Failed to load templates",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleChange = (key: string, value: string) => {
    const newForm = { ...formData, [key]: value };
    setFormData(newForm);
    validateVariables(newForm.whatsapp_template, newForm.email_template);
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setFormData({ name: "", whatsapp_template: "", email_template: "" });
    setInvalidVars([]);
    setValidVars([]);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      addNotification({ message: "Template name is required", variant: "error" });
      return;
    }

    const payload = {
      ...formData,
      variables: validVars,
    };

    setLoading(true);
    try {
      if (editingTemplate) {
        await fetchData(
          `notifications/templates`,
          "PUT",
          payload,
          { params: `${editingTemplate._id}` }
        );
        addNotification({
          message: "Template updated successfully",
          variant: "success",
        });
      } else {
        await fetchData("notifications/templates", "POST", payload);
        addNotification({
          message: "Template created successfully",
          variant: "success",
        });
      }
      resetForm();
      loadTemplates();
    } catch (err) {
      console.error(err);
      addNotification({
        message: err?.message || "Error saving template",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      whatsapp_template: template.whatsapp_template,
      email_template: template.email_template,
    });
    validateVariables(template.whatsapp_template, template.email_template);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      await fetchData(`notifications/templates`, "DELETE", {}, { params: `${id}` });
      addNotification({
        message: "Template deleted successfully",
        variant: "success",
      });
      loadTemplates();
    } catch (err) {
      console.error(err);
      addNotification({ message: "Error deleting template", variant: "error" });
    }
  };

  // Filter templates based on search
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.whatsapp_template?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.email_template?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600 mt-2">Create and manage notification templates for WhatsApp and Email</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Template Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-xl shadow-sm border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                {editingTemplate ? "Edit Template" : "Create New Template"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Template Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. Course Registration Confirmation"
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium">WhatsApp Content</Label>
                    <span className="text-xs text-gray-500">{formData.whatsapp_template.length} characters</span>
                  </div>
                  <Textarea
                    value={formData.whatsapp_template}
                    onChange={(e) => handleChange("whatsapp_template", e.target.value)}
                    placeholder="Hello {{student.first_name}}, your course {{course.name}} has been confirmed!"
                    className={`min-h-[120px] rounded-lg ${
                      invalidVars.length > 0 ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium">Email Content (HTML allowed)</Label>
                    <span className="text-xs text-gray-500">{formData.email_template.length} characters</span>
                  </div>
                  <Textarea
                    value={formData.email_template}
                    onChange={(e) => handleChange("email_template", e.target.value)}
                    placeholder={`<p>Dear {{student.first_name}},</p><p>Welcome to {{course.name}}!</p>`}
                    className={`min-h-[150px] rounded-lg ${
                      invalidVars.length > 0 ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>

                {/* Variable Validation Status */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {invalidVars.length === 0 && validVars.length > 0 && (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-medium">All variables are valid</span>
                      </>
                    )}
                    {invalidVars.length > 0 && (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-red-700 font-medium">Invalid variables detected</span>
                      </>
                    )}
                  </div>
                  
                  {validVars.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Valid Variables:</p>
                      <div className="flex flex-wrap gap-2">
                        {validVars.map((v) => (
                          <Badge key={v} variant="success" className="text-xs">
                            {`{{${v}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {invalidVars.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-700 mb-2">Invalid Variables:</p>
                      <div className="flex flex-wrap gap-2">
                        {invalidVars.map((v) => (
                          <Badge key={v} variant="destructive" className="text-xs">
                            {`{{${v}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="rounded-lg"
                  >
                    {loading
                      ? "Saving..."
                      : editingTemplate
                      ? "Update Template"
                      : "Create Template"}
                  </Button>
                  {editingTemplate && (
                    <Button variant="outline" onClick={resetForm} className="rounded-lg">
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template List */}
          <Card className="rounded-xl shadow-sm border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
              <div className="flex justify-between items-center">
                <CardTitle>Existing Templates</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-lg"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No templates found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {template.variables?.length || 0} variables
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p className="line-clamp-2">
                              <span className="font-medium">WhatsApp:</span> {template.whatsapp_template || "N/A"}
                            </p>
                            <p className="line-clamp-2">
                              <span className="font-medium">Email:</span> {template.email_template?.replace(/<[^>]*>/g, '') || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(template)}
                            className="rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(template._id)}
                            className="rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Variable Panel */}
        <div className="space-y-6">
          <Card className="rounded-xl shadow-sm border-0 sticky top-6">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Available Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Quick Insert */}
              <div className="space-y-3 mb-6">
                <Label className="text-sm font-medium">Quick Insert</Label>
                <Select value={selectedVariable} onValueChange={setSelectedVariable}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select a variable to insert" />
                  </SelectTrigger>
                  <SelectContent>
                    {variableCategories.map((category) =>
                      category.variables.map((variable) => (
                        <SelectItem key={variable.name} value={variable.name}>
                          {variable.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(selectedVariable, 'whatsapp_template')}
                    disabled={!selectedVariable}
                    className="rounded-lg flex-1"
                  >
                    Add to WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(selectedVariable, 'email_template')}
                    disabled={!selectedVariable}
                    className="rounded-lg flex-1"
                  >
                    Add to Email
                  </Button>
                </div>
              </div>

              {/* Variable Browser */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Variable Browser</Label>
                <Accordion type="multiple" className="space-y-3">
                  {variableCategories.map((category) => (
                    <AccordionItem key={category.category} value={category.category} className="border rounded-lg">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium text-sm">{category.category}</span>
                          <Badge variant="outline" className="text-xs">
                            {category.variables.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <div className="space-y-2">
                          {category.variables.map((variable) => (
                            <Dialog key={variable.name}>
                              <DialogTrigger asChild>
                                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {`{{${variable.name}}}`}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {variable.description}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyVariable(variable.name);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    {copiedVar === variable.name ? (
                                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="rounded-lg max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                      {`{{${variable.name}}}`}
                                    </code>
                                  </DialogTitle>
                                  <DialogDescription>
                                    <div className="space-y-3 mt-4">
                                      <div>
                                        <p className="font-medium text-gray-700">Description:</p>
                                        <p className="text-sm text-gray-600">{variable.description}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700">Example:</p>
                                        <p className="text-sm text-gray-600">{variable.example}</p>
                                      </div>
                                      <div className="flex gap-2 pt-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => insertVariable(variable.name, 'whatsapp_template')}
                                          className="rounded-lg"
                                        >
                                          Add to WhatsApp
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => insertVariable(variable.name, 'email_template')}
                                          className="rounded-lg"
                                        >
                                          Add to Email
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => copyVariable(variable.name)}
                                          className="rounded-lg"
                                        >
                                          {copiedVar === variable.name ? "Copied!" : "Copy"}
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}