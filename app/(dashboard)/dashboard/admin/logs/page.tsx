"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Search, Activity, CalendarClock, User, FileText, CheckCircle } from "lucide-react";
import theme from "@/styles/theme";
import { usePage } from "@/hooks/usePage";
import { Select, SelectContent } from "@/components/ui/select";

/**
 * Admin Activity Logs Page
 * Consumes: theme.colors.primary, accent, surfaceElevated, textOnPrimary
 */
export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const {setPage} = usePage()
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔹 Fetch activity logs
  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setPage("Activity Logs")
    fetchLogs();
  }, []);

  // 🔹 Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || log.type === filter;
    return matchSearch && matchFilter;
  });

  // 🔹 Icon selector
  const getIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User size={16} className="text-primary" />;
      case "semester":
        return <CalendarClock size={16} className="text-blue-500" />;
      case "result":
        return <FileText size={16} className="text-green-600" />;
      case "approval":
        return <CheckCircle size={16} className="text-accent" />;
      default:
        return <Activity size={16} className="text-gray-500" />;
    }
  };

  return (
    <main className="max-w-6xl mx-auto min-h-screen">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search actions or users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Filter:</Label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option value="all"></option>
            <option value="semester">Semester</option>
            <option value="result">Result</option>
            <option value="user">User</option>
            <option value="approval">Approval</option>
          </select>
          <Select>
            <SelectContent>
                All
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="rounded-xl shadow-md">
        <CardContent className="p-4">
          {filteredLogs.length === 0 ? (
            <p className="text-gray-500 text-sm">No logs found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-surfaceElevated border-b">
                  <tr className="text-left">
                    <th className="p-2">Action</th>
                    <th className="p-2">User</th>
                    <th className="p-2">Target</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, i) => (
                    <tr
                      key={i}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-2 flex items-center gap-2">
                        {getIcon(log.type)} {log.action}
                      </td>
                      <td className="p-2">{log.actor}</td>
                      <td className="p-2">{log.target}</td>
                      <td className="p-2 capitalize">{log.type}</td>
                      <td className="p-2 text-gray-500 text-xs">
                        {new Date(log.date).toLocaleString()}
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
