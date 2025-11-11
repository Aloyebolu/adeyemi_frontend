"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { FileText, Search, CheckCircle, XCircle, Download } from "lucide-react";
import theme from "@/styles/theme";
import { usePage } from "@/hooks/usePage";

/**
 * Admin Transcript Requests Page
 * Consumes: theme.colors.primary, accent, surfaceElevated, textOnPrimary
 */
export default function AdminTranscriptsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const {setPage} = usePage()

  // 🔹 Fetch transcript requests
  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/transcripts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data || []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    }
  };

  useEffect(() => {
    setPage("Transcript Requests")
    fetchRequests();
  }, []);

  // 🔹 Approve transcript
  const handleApprove = async (id: string) => {
    if (!confirm("Approve this transcript request?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/transcripts/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to approve transcript");
      alert("Transcript approved successfully ✅");
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Error approving transcript");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reject transcript
  const handleReject = async (id: string) => {
    if (!confirm("Reject this transcript request?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/transcripts/${id}/reject`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to reject transcript");
      alert("Transcript rejected ❌");
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Error rejecting transcript");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Generate / Download PDF
  const handleDownload = async (id: string) => {
    try {
      const res = await fetch(`/api/transcripts/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Transcript_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error generating transcript PDF");
    }
  };

  // 🔹 Search filter
  const filtered = requests.filter(
    (r) =>
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.matricNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto  min-h-screen">

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search by name or matric no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Requests Table */}
      <Card className="rounded-xl shadow-md">
        <CardContent className="p-4">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">No transcript requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-surfaceElevated border-b">
                  <tr className="text-left">
                    <th className="p-2">Student</th>
                    <th className="p-2">Matric No</th>
                    <th className="p-2">Department</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req, idx) => (
                    <tr
                      key={req._id || idx}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-2">{req.studentName}</td>
                      <td className="p-2">{req.matricNo}</td>
                      <td className="p-2">{req.department}</td>
                      <td className="p-2 capitalize">{req.status}</td>
                      <td className="p-2 text-center flex justify-center gap-2">
                        {req.status === "pending" && (
                          <>
                            <button
                              className="inline-flex items-center px-2 py-1 text-xs border rounded-md text-green-600 border-green-400"
                              onClick={() => handleApprove(req._id)}
                            >
                              <CheckCircle size={14} className="mr-1" /> Approve
                            </button>
                            <button
                              className="inline-flex items-center px-2 py-1 text-xs border rounded-md text-red-600 border-red-400"
                              onClick={() => handleReject(req._id)}
                            >
                              <XCircle size={14} className="mr-1" /> Reject
                            </button>
                          </>
                        )}
                        {req.status === "approved" && (
                          <button
                            className="inline-flex items-center px-2 py-1 text-xs border rounded-md text-primary border-primary"
                            onClick={() => handleDownload(req._id)}
                          >
                            <Download size={14} className="mr-1" /> Download PDF
                          </button>
                        )}
                        {req.status === "rejected" && (
                          <span className="text-gray-400 italic">Rejected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
