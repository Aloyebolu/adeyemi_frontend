"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/hooks/useNotification";
import { useDataFetcher } from "@/lib/dataFetcher";
import { Textarea } from "@/components/ui/textarea";

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

  // Approved dynamic variables (expandable later)
  const validVariables = [
    "user.name",
    "user.email",
    "user.department",
    "user.department.course_count",
    "course.name",
    "course.code",
    "portal_url"
  ];

  const [invalidVars, setInvalidVars] = useState<string[]>([]);
  const [validVars, setValidVars] = useState<string[]>([]);

  // --- Helper to extract {{variables}} ---
  const extractVariables = (text: string) => {
    const matches = text.match(/{{\s*[\w.]+\s*}}/g);
    return matches ? matches.map((m) => m.replace(/{{\s*|\s*}}/g, "")) : [];
  };

  // --- Validate variables ---
  const validateVariables = (whatsapp: string, email: string) => {
    const allVars = [...extractVariables(whatsapp), ...extractVariables(email)];
    const invalids = allVars.filter((v) => !validVariables.includes(v));
    const valids = allVars.filter((v) => validVariables.includes(v));
    setInvalidVars([...new Set(invalids)]);
    setValidVars([...new Set(valids)]);
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
      addNotification({ message: "name is required", variant: "error" });
      return;
    }

    // send both valid and invalid variables for backend logging/validation
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

  return (
    <main className="max-w-5xl mx-auto py-10 space-y-10">
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">
            {editingTemplate ? "Edit Template" : "Create New Template"}
          </h2>

          <div className="space-y-4">
            <div>
              <Label>name</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Result Announcement"
              />
            </div>

            <div>
              <Label>WhatsApp Content</Label>
              <Textarea
                value={formData.whatsapp_template}
                onChange={(e) => handleChange("whatsapp_template", e.target.value)}
                placeholder="Use {{user.name}}, {{course.title}}, etc."
                className={`min-h-[100px] ${
                  invalidVars.length > 0 ? "border-red-400" : "border-green-400"
                }`}
              />
            </div>

            <div>
              <Label>Email Content (HTML allowed)</Label>
              <Textarea
                value={formData.email_template}
                onChange={(e) => handleChange("email_template", e.target.value)}
                placeholder="<p>Hello {{user.name}}, your result is ready!</p>"
                className={`min-h-[100px] ${
                  invalidVars.length > 0 ? "border-red-400" : "border-green-400"
                }`}
              />
            </div>

            {/* ✅ Variable Validation Section */}
            <div className="space-y-2 text-sm">
              {validVars.length > 0 && (
                <p className="text-green-600">
                  ✅ Valid Variables: {validVars.join(", ")}
                </p>
              )}
              {invalidVars.length > 0 && (
                <p className="text-red-600">
                  ⚠️ Invalid Variables: {invalidVars.join(", ")}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingTemplate
                  ? "Update Template"
                  : "Create Template"}
              </Button>
              {editingTemplate && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template List */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Existing Templates</h2>

          {templates.length === 0 ? (
            <p className="text-gray-500">No templates available.</p>
          ) : (
            <div className="space-y-3">
              {templates.map((t) => (
                <div
                  key={t._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-gray-600">
                      WhatsApp: {t.whatsapp_template?.slice(0, 40) || "N/A"}...
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: {t.email_template?.slice(0, 40) || "N/A"}...
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(t)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(t._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
