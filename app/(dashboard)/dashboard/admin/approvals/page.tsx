"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Search, ClipboardList } from "lucide-react";
import theme from "@/styles/theme";
import { usePage } from "@/hooks/usePage";

/**
 * Admin Result Approval Page
 * Consumes: theme.colors.primary, theme.colors.accent, textOnPrimary, surfaceElevated
 */
export default function AdminApprovalsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const {setPage} = usePage()
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔹 Fetch results
  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/results?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResults(data || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
  };

  useEffect(() => {
    setPage("Result Approval")
    fetchResults();
  }, [filter]);

  // 🔹 Approve result
  const handleApprove = async (id: string) => {
    if (!confirm("Approve this result?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/results/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to approve result");
      alert("Result approved successfully ✅");
      fetchResults();
    } catch (err) {
      console.error(err);
      alert("Error approving result");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reject result
  const handleReject = async (id: string) => {
    if (!confirm("Reject this result?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/results/${id}/reject`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to reject result");
      alert("Result rejected ❌");
      fetchResults();
    } catch (err) {
      console.error(err);
      alert("Error rejecting result");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Search filter
  const filtered = results.filter(
    (r) =>
      r.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      r.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.lecturer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto min-h-screen">

      {/* Filters */}
      <Card className="mb-6 rounded-xl shadow-md">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-3">
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              className={`min-h-[2.5rem] ${filter === "pending" ? "bg-primary text-on-primary" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              className={`min-h-[2.5rem] ${filter === "approved" ? "bg-primary text-on-primary" : ""}`}
              onClick={() => setFilter("approved")}
            >
              Approved
            </Button>
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              className={`min-h-[2.5rem] ${filter === "rejected" ? "bg-primary text-on-primary" : ""}`}
              onClick={() => setFilter("rejected")}
            >
              Rejected
            </Button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search course or lecturer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results table */}
      <Card className="rounded-xl shadow-md">
        <CardContent className="p-4">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">No {filter} results found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-surfaceElevated border-b">
                  <tr className="text-left">
                    <th className="p-2">Course Code</th>
                    <th className="p-2">Course Title</th>
                    <th className="p-2">Lecturer</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((result, idx) => (
                    <tr key={result._id || idx} className="border-b hover:bg-gray-50 transition">
                      <td className="p-2 font-medium">{result.courseCode}</td>
                      <td className="p-2">{result.courseTitle}</td>
                      <td className="p-2">{result.lecturer}</td>
                      <td className="p-2 capitalize">{result.status}</td>
                      <td className="p-2 text-center flex justify-center gap-2">
                        {filter === "pending" && (
                          <>
                            <button
                              className="inline-flex items-center px-2 py-1 text-xs border rounded-md text-green-600 border-green-400"
                              onClick={() => handleApprove(result._id)}
                            >
                              <CheckCircle size={14} className="mr-1" /> Approve
                            </button>
                            <button
                              className="inline-flex items-center px-2 py-1 text-xs border rounded-md text-red-600 border-red-400"
                              onClick={() => handleReject(result._id)}
                            >
                              <XCircle size={14} className="mr-1" /> Reject
                            </button>
                          </>
                        )}
                        {filter !== "pending" && (
                          <span className="text-gray-400 italic">No actions available</span>
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
