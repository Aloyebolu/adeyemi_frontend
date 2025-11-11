"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Upload, FileText, Trash2 } from "lucide-react";
import theme from "@/styles/theme";

interface Material {
  id: string;
  title: string;
  filename: string;
  uploaded_at: string;
}

export default function UploadMaterialsPage() {
  const { course_id } = useParams();
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: "1",
      title: "Week 1 - Introduction to AI",
      filename: "intro_to_ai.pdf",
      uploaded_at: "2025-10-01",
    },
    {
      id: "2",
      title: "Week 2 - Neural Networks",
      filename: "neural_networks.pptx",
      uploaded_at: "2025-10-04",
    },
  ]);
  const [newMaterial, setNewMaterial] = useState({ title: "", file: null as File | null });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewMaterial({ ...newMaterial, file: e.target.files[0] });
    }
  };

  const handleUpload = () => {
    if (!newMaterial.title || !newMaterial.file)
      return alert("Please provide a title and select a file.");

    setLoading(true);
    setTimeout(() => {
      setMaterials([
        ...materials,
        {
          id: String(materials.length + 1),
          title: newMaterial.title,
          filename: newMaterial.file?.name || "",
          uploaded_at: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewMaterial({ title: "", file: null });
      setLoading(false);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this material?")) {
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-bg text-text">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Upload className="text-brand" /> {course_id} - Upload Materials
          </h1>
          <p className="text-text-muted">
            Upload and manage course resources for your students.
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-surface border border-border rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Material</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Material Title
            </label>
            <input
              type="text"
              value={newMaterial.title}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, title: e.target.value })
              }
              className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-brand outline-none"
              placeholder="e.g. Week 3 - Deep Learning"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Select File
            </label>
            <input
              type="file"
              accept=".pdf,.pptx,.docx"
              onChange={handleFileChange}
              className="w-full border border-border rounded-lg p-2 bg-bg"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-white transition ${
              loading ? "bg-brand/70 cursor-not-allowed" : "bg-brand hover:bg-brand/90"
            }`}
            style={{ backgroundColor: theme.colors.primary }}
          >
            {loading ? "Uploading..." : "Upload Material"}
          </button>
        </div>
      </div>

      {/* Uploaded Materials */}
      <div className="bg-surface border border-border rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated border-b border-border text-text-muted">
            <tr>
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">File Name</th>
              <th className="text-left p-3">Uploaded On</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m, i) => (
              <tr
                key={m.id}
                className="border-b border-border hover:bg-bg/60 transition-colors"
              >
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium text-brand">{m.title}</td>
                <td className="p-3 flex items-center gap-2">
                  <FileText size={16} /> {m.filename}
                </td>
                <td className="p-3">{m.uploaded_at}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-2 rounded-md hover:bg-accent/10 text-accent"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
