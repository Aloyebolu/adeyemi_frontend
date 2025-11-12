"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/Badge";

type Announcement = {
  id: string;
  title: string;
  message: string;
  audience: string;
  createdAt: string;
  pinned: boolean;
};

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Semester Exams",
      message: "Semester exams start next Monday. Check your timetable!",
      audience: "students",
      createdAt: "2025-11-10",
      pinned: true,
    },
    {
      id: "2",
      title: "System Maintenance",
      message:
        "Portal will be offline for 2 hours tonight due to maintenance.",
      audience: "all",
      createdAt: "2025-11-09",
      pinned: false,
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "all",
  });

  const handlePost = () => {
    const newAnnouncement = {
      id: String(Date.now()),
      ...form,
      createdAt: new Date().toISOString(),
      pinned: false,
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setForm({ title: "", message: "", audience: "all" });
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <div className="flex justify-between items-center">
            <select
              className="border rounded-md p-2"
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
            >
              <option value="all">All Users</option>
              <option value="students">Students</option>
              <option value="staff">Staff</option>
              <option value="admins">Admins</option>
            </select>
            <Button onClick={handlePost}>Post</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {announcements.map((a) => (
          <Card
            key={a.id}
            className={`p-3 ${a.pinned ? "border-yellow-400 border-2" : ""}`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{a.title}</CardTitle>
                <Badge>{a.audience}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{a.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(a.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
