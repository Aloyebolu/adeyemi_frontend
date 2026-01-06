"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/hooks/useNotification";
import { useSuggestionFetcher } from "@/hooks/useSuggestionFetcher";
import { useDataFetcher } from "@/lib/dataFetcher";
import debounce from "lodash.debounce";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePage } from "@/hooks/usePage";

type RecipientType = "all" | "students" | "lecturers" | "hods" | "deans";
type ChannelType = "both" | "whatsapp" | "email";

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
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<ChannelType>("both");
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [whatsappPreview, setWhatsappPreview] = useState("");
  const [emailPreview, setEmailPreview] = useState("");
  
  const { setPage } = usePage();
  
  useEffect(() => {
    setPage("Messaging");
  }, []);

  function getTimeGreeting() {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Good morning! ☀️";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon! 🌤️";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening! 🌙";
    } else {
      return "Good night! 🌃";
    }
  }

  // Apply template
  const applyTemplate = (template: Template | null) => {
    setSelectedTemplate(template);
    if (!template) {
      setMessage("");
      setWhatsappPreview("");
      setEmailPreview("");
      return;
    }

    // Replace variables for preview
    const fakeUser = { 
      "user.name": "Muna", 
      email: "muna@example.com", 
      department: "Computer Science", 
      portal_url: "https://portal.example.com",
      timeGreeting: getTimeGreeting() 
    };

    const replaceVariables = (text: string) =>
      text.replace(/\{\{(.*?)\}\}/g, (_, key) => fakeUser[key.trim()] || "");

    const whatsappContent = replaceVariables(template.whatsapp_template || "");
    const emailContent = replaceVariables(template.email_template || "");
    
    setWhatsappPreview(whatsappContent);
    setEmailPreview(emailContent);
    
    // Disable message editing by not setting the message state
    // The textarea will be disabled anyway
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

  const handleSend = async () => {
    if (!selectedTemplate) {
      addNotification({ message: "Please select a template", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        type: channel,
        templateId: selectedTemplate._id,
        target: recipientType,
      };

      const { data } = await fetchData("notifications/send", "POST", payload);
      addNotification({
        message: data.message || "Message sent successfully",
        variant: "success",
      });
      setSelectedTemplate(null);
    } catch (err) {
      console.error(err);
      addNotification({ 
        message: err?.message || "Error sending message", 
        variant: "error" 
      });
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
            <Select
              value={recipientType}
              onValueChange={(value) => setRecipientType(value as RecipientType)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select Recipient Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Recipients</SelectLabel>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="students">All Students</SelectItem>
                  <SelectItem value="lecturers">All Lecturers</SelectItem>
                  <SelectItem value="hods">All HODs</SelectItem>
                  <SelectItem value="deans">All Deans</SelectItem>

                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Channel */}
          <div>
            <Label>Channel</Label>
            <Select
              value={channel}
              onValueChange={(value) => {
                setChannel(value as ChannelType);
                if (selectedTemplate) applyTemplate(selectedTemplate);
              }}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select Channel" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Channel</SelectLabel>
                  <SelectItem value="both">Both (WhatsApp & Email)</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp Only</SelectItem>
                  <SelectItem value="email">Email Only</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Template Selection */}
          <div>
            <Label>Template</Label>
            <Select
              value={selectedTemplate?._id || ""}
              onValueChange={(value) => {
                const template = templates.find((t) => t._id === value) || null;
                applyTemplate(template);
              }}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select Template" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Templates</SelectLabel>
                  {templates.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Message Editor */}
          <div>
            <Label>Message</Label>
            <textarea
              value={selectedTemplate ? "Message is auto-filled from template" : ""}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={selectedTemplate ? "Template selected - editing disabled" : "Select a template to auto-fill message"}
              className="w-full border rounded-lg p-2 mt-1 min-h-[120px] bg-gray-50"
              disabled={!!selectedTemplate}
            />
          </div>

          {/* Previews */}
          <div className="space-y-4">
            <div className="bg-background2 border rounded-lg p-3">
              <Label>WhatsApp Preview</Label>
              <div className="text-sm text-text mt-1 whitespace-pre-line">
                {whatsappPreview || "WhatsApp preview will appear here when a template is selected..."}
              </div>
            </div>
            <div className="bg-background2 border rounded-lg p-3">
              <Label>Email Preview</Label>
              <div
                className="text-sm text-gray-700 mt-1 max-h-200 overflow-auto p-2 bg-background2 rounded"
                dangerouslySetInnerHTML={{
                  __html: emailPreview || "Email preview will appear here when a template is selected...",
                }}
              />
            </div>
          </div>

          {/* Send Button */}
          <Button
            className="bg-primary text-white"
            onClick={handleSend}
            disabled={loading || !selectedTemplate}
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}