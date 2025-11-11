"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/hooks/useNotification";
import { useSuggestionFetcher } from "@/hooks/useSuggestionFetcher";
import { useDataFetcher } from "@/lib/dataFetcher";
import debounce from "lodash.debounce"; // install lodash.debounce

type RecipientType = "all" | "students" | "lecturers" | "hods" | "specific";
type ChannelType = "whatsapp" | "email";

interface User {
  _id: string;
  name: string;
  role?: string;
  studentId?: string;
  staffId?: string;
}

interface Template {
  _id: string;
  name: string;
  whatsapp_template?: string;
  email_template?: string;
}

export default function AdminNotificationPage() {
  const { addNotification } = useNotifications();
  const { fetchSuggestions } = useSuggestionFetcher();
  const { fetchData } = useDataFetcher();

  const [recipientType, setRecipientType] = useState<RecipientType>("all");
  const [specificRecipient, setSpecificRecipient] = useState<User | null>(null);
  const [recipientQuery, setRecipientQuery] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<ChannelType>("whatsapp");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  // Add to your state
  const [whatsappPreview, setWhatsappPreview] = useState("");
  const [emailPreview, setEmailPreview] = useState("");

  // Update applyTemplate function
  const applyTemplate = (template: Template | null) => {
    setSelectedTemplate(template);
    if (!template) {
      setMessage("");
      setWhatsappPreview("");
      setEmailPreview("");
      return;
    }

    // Replace variables for preview
    const fakeUser = { name: "Muna", email: "muna@example.com", department: "Computer Science", portal_url: "https://portal.example.com" };

    const replaceVariables = (text: string) =>
      text.replace(/\{\{(.*?)\}\}/g, (_, key) => fakeUser[key.trim()] || "");

    setWhatsappPreview(replaceVariables(template.whatsapp_template || ""));
    setEmailPreview(replaceVariables(template.email_template || ""));
    // Also set message depending on current channel for editing
    setMessage(channel === "whatsapp" ? whatsappPreview : emailPreview);
  };

  // Fetch templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const { data } = await fetchData("notifications/templates", "GET");
        setTemplates(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadTemplates();
  }, []);

  // Debounced fetch for recipient suggestions
  const fetchRecipientSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query) return setSuggestions([]);
      try {
        let role = "";
        if (recipientType === "students") role = "student";
        else if (recipientType === "lecturers") role = "lecturer";
        else if (recipientType === "hods") role = "hod";

        const data = await fetchSuggestions(query, role);
        setSuggestions(data);
      } catch (err) {
        console.error(err);
      }
    }, 400), // 400ms debounce
    [recipientType, fetchSuggestions]
  );

  // Handle input change for specific recipient
  const handleRecipientInputChange = (value: string) => {
    setRecipientQuery(value);
    fetchRecipientSuggestions(value);
  };

  // Apply selected template
  // const applyTemplate = (template: Template | null) => {
  //   setSelectedTemplate(template);
  //   if (!template) {
  //     setMessage("");
  //     return;
  //   }
  //   const content =
  //     channel === "whatsapp"
  //       ? template?.whatsapp_content || ""
  //       : template?.email_content || "";
  //   setMessage(content);
  // };

  // Preview message with fake data
  const getPreviewMessage = () => {
    if (!message) return "";
    const fakeUser = { name: "Muna", email: "muna@example.com", department: "Computer Science" };
    return message.replace(/\{\{(.*?)\}\}/g, (_, key) => fakeUser[key.trim()] || "");
  };

  const handleSend = async () => {
    if (!message) {
      addNotification({ message: "Message cannot be empty", variant: "error" });
      return;
    }
    if (recipientType === "specific" && !specificRecipient) {
      addNotification({ message: "Select a recipient", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        type: channel,
        templateId: selectedTemplate?._id || null,
        message,
        target: recipientType,
        recipientId: specificRecipient?._id || null,
      };

      const { data } = await fetchData("notifications/send", "POST", payload);
      addNotification({
        message: data.message || "Message sent successfully",
        variant: "success",
      });
      setMessage("");
      setSpecificRecipient(null);
      setRecipientQuery("");
      setSelectedTemplate(null);
    } catch (err) {
      console.error(err);
      addNotification({ message: err.message || "Error sending message", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto py-8 space-y-8">
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Send Notification</h2>

          {/* Recipient Type */}
          <div>
            <Label>Recipient Type</Label>
            <select
              className="w-full border rounded-lg p-2 mt-1"
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value as RecipientType)}
            >
              <option value="all">All Users</option>
              <option value="students">All Students</option>
              <option value="lecturers">All Lecturers</option>
              <option value="hods">All HODs</option>
              <option value="specific">Specific User</option>
            </select>
          </div>

          {/* Specific Recipient */}
          {recipientType === "specific" && (
            <div>
              <Label>Search Recipient</Label>
              <Input
                placeholder="Type name or ID..."
                value={recipientQuery}
                onChange={(e) => handleRecipientInputChange(e.target.value)}
              />
              {suggestions.length > 0 && (
                <ul className="border rounded mt-1 max-h-48 overflow-auto">
                  {suggestions.map((s) => (
                    <li
                      key={s._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSpecificRecipient(s);
                        setRecipientQuery(s.name);
                        setSuggestions([]);
                      }}
                    >
                      {s.name} ({s.role || s.staffId || s.studentId})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Channel */}
          <div>
            <Label>Channel</Label>
            <select
              className="w-full border rounded-lg p-2 mt-1"
              value={channel}
              onChange={(e) => {
                setChannel(e.target.value as ChannelType);
                if (selectedTemplate) applyTemplate(selectedTemplate);
              }}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
          </div>

          {/* Template Selection */}
          <div>
            <Label>Template</Label>
            <select
              className="w-full border rounded-lg p-2 mt-1"
              value={selectedTemplate?._id || ""}
              onChange={(e) => {
                const template = templates.find((t) => t._id === e.target.value) || null;
                applyTemplate(template);
              }}
            >
              <option value="">Select Template</option>
              {templates.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Message Editor */}
          <div>
            <Label>Message</Label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message or edit the template..."
              className="w-full border rounded-lg p-2 mt-1 min-h-[120px]"
            />
          </div>

          {/* Previews */}
          <div className="space-y-4">
            <div className="bg-green-50 border rounded-lg p-3">
              <Label>WhatsApp Preview</Label>
              <div className="text-sm text-gray-700 mt-1 whitespace-pre-line">{whatsappPreview || "WhatsApp preview will appear here..."}</div>
            </div>

            <div className="bg-blue-50 border rounded-lg p-3">
              <Label>Email Preview</Label>
              <div
                className="text-sm text-gray-700 mt-1"
                dangerouslySetInnerHTML={{ __html: emailPreview || "<p>Email preview will appear here...</p>" }}
              />
            </div>
          </div>


          {/* Send Button */}
          <Button
            className="bg-primary text-white"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
