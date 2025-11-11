"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/hooks/useNotification";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useDialog } from "@/context/DialogContext";
import { usePage } from "@/hooks/usePage";

const VALID_SEMESTERS = ["First Semester", "Second Semester"];

export default function SemesterSettingsPage() {
  const { addNotification } = useNotifications();
  const [name, setName] = useState(VALID_SEMESTERS[0]);
  const [session, setSession] = useState("");
  const [sessions, setSessions] = useState<string[]>([]);
  const [activeSemester, setActiveSemester] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [regOpen, setRegOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const {fetchData} = useDataFetcher();
  const {openDialog, closeDialog} = useDialog();
  const {setPage} = usePage()

  // 🔢 Generate session options (2 years backward and forward)
  useEffect(() => {
    const year = new Date().getFullYear();
    const range: string[] = [];
    for (let y = year - 2; y <= year + 2; y++) {
      range.push(`${y}/${y + 1}`);
    }
    setSessions(range.reverse());
  }, []);

  // 🧩 Fetch active semester
  const fetchActiveSemester = async () => {
    setLoading(true);
    try {
      const {data} = await fetchData("semester/active");
      setActiveSemester(data);
      setRegOpen(data.registrationOpen || false);
      setResultOpen(data.resultOpen || false);
    } catch {
      setActiveSemester(null);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    setPage("Semester Settings");
    fetchActiveSemester();
  }, []);

  // ✅ Validate session (consecutive years)
  const validateSession = (session: string) => {
    const match = session.match(/^(\d{4})\/(\d{4})$/);
    if (!match) return false;
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);
    return end - start === 1;
  };

  // 🚀 Start new semester
  const handleStartSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !session) {
      addNotification({ message: "Semester name and session are required.", variant: "error" });
      return;
    }

    if (!VALID_SEMESTERS.includes(name)) {
      addNotification({ message: "Invalid semester name.", variant: "error" });
      return;
    }

    if (!validateSession(session)) {
      addNotification({
        message: "Session must be consecutive years in YYYY/YYYY format (e.g. 2024/2025).",
        variant: "error",
      });
      return;
    }

    // ⛔ Prevent starting a new one while active exists
    if (activeSemester?.isActive) {
      addNotification({
        message: "Close the current active semester before starting a new one.",
        variant: "warning",
      });
      return;
    }

    if (!confirm(`Are you sure you want to start ${name} (${session})?`)) return;

    setLoading(true);
    try {
      const { data, response } = await fetchData("semester/start", "POST", { name, session });
      if (response?.ok) {
        addNotification({ message: data.message || "Semester started!", variant: "success" });
        fetchActiveSemester();
      } else {
        addNotification({ message: data.message || "Failed to start semester", variant: "error" });
      }
    } catch {
      addNotification({ message: "Error starting semester", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Toggle registration
  const handleToggleRegistration = async (status: boolean) => {
    if (!activeSemester?.isActive) {
      addNotification({ message: "No active semester found.", variant: "warning" });
      return;
    }
    setLoading(true);
    try {
      const { data, response } = await fetchData("semester/registration", "PATCH", { status });
      if (response?.ok) {
        addNotification({ message: data.message || "Registration status updated", variant: "success" });
        await fetchActiveSemester();
      } else {
        addNotification({ message: data.message || "Failed to update registration", variant: "error" });
      }
    } catch {
      addNotification({ message: "Error updating registration", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 📊 Toggle result publication
  const handleToggleResult = async (status: boolean) => {
    if (!activeSemester?.isActive) {
      addNotification({ message: "No active semester found.", variant: "warning" });
      return;
    }
    setLoading(true);
    try {
      const { data, response } = await fetchData("semester/result-publication", "PATCH", { status });
      if (response?.ok) {
        addNotification({ message: data.message || "Result publication status updated", variant: "success" });
        await fetchActiveSemester();
      } else {
        addNotification({ message: data.message || "Failed to update result publication", variant: "error" });
      }
    } catch {
      addNotification({ message: "Error updating result publication", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 🔴 Set semester inactive
  const handleSetInactive = async () => {
    if (!activeSemester?.isActive) {
      addNotification({ message: "No active semester to deactivate.", variant: "warning" });
      return;
    }
    openDialog("confirm", {
      title: "Confirm Deactivation",
      message: "Are you sure you want to set the current semester as inactive?",
      onConfirm: async()=>{
        setLoading(true);
    try {
      const { data, response } = await fetchData("semester/deactivate", "PATCH", { id: activeSemester._id });
      if (response?.ok) {
        addNotification({ message: data.message || "Semester set to inactive.", variant: "success" });
        await fetchActiveSemester();
      } else {
        // addNotification({ message: data.message || "Failed to deactivate semester", variant: "error" });
      addNotification({ message: error?.message ? error.message : "Failed to deactivate semester", variant: "error" });

      }
    } catch(error){
      addNotification({ message: error?.message ? error.message : "Failed to deactivate semester", variant: "error" });
    } finally {
      setLoading(false);
    }
      },
      oncancel: ()=> {
        return;
      }
    });

  };

  return (
    <main className="max-w-2xl mx-auto min-h-screen py-8 space-y-8">
      {/* 🧠 Start New Semester */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Start New Semester</h2>
          <form onSubmit={handleStartSemester} className="space-y-4">
            <div>
              <Label>Semester Name</Label>
              <select
                className="w-full border border-[#D1D5DB] rounded-lg p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || activeSemester?.isActive}
              >
                {VALID_SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Session</Label>
              <select
                className="w-full border border-[#D1D5DB] rounded-lg p-2"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                disabled={loading || activeSemester?.isActive}
              >
                <option value="">Select session</option>
                {sessions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              disabled={loading || activeSemester?.isActive}
              className="bg-primary text-white px-6 py-2"
            >
              {loading ? "Processing..." : "Start Semester"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 📚 Active Semester Info */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Current Active Semester</h2>
          {activeSemester ? (
            <div className="space-y-2">
              <div><b>Name:</b> {activeSemester.name}</div>
              <div><b>Session:</b> {activeSemester.session}</div>
              <div><b>Started:</b> {activeSemester.startDate ? new Date(activeSemester.startDate).toLocaleDateString() : "-"}</div>
              <div><b>Status:</b> {activeSemester.isActive ? "🟢 Active" : "🔴 Inactive"}</div>
            </div>
          ) : (
            <div>No active semester found.</div>
          )}
        </CardContent>
      </Card>

      {/* ⚙️ Semester Controls */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Semester Controls</h2>
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={() => handleToggleRegistration(!regOpen)}
              className={regOpen ? "bg-red-600 text-white" : "bg-green-600 text-white"}
              disabled={loading || !activeSemester?.isActive}
            >
              {regOpen ? "Close Registration" : "Open Registration"}
            </Button>
            <Button
              onClick={() => handleToggleResult(!resultOpen)}
              className={resultOpen ? "bg-red-600 text-white" : "bg-green-600 text-white"}
              disabled={loading || !activeSemester?.isActive}
            >
              {resultOpen ? "Close Result Publication" : "Open Result Publication"}
            </Button>
            <Button
              onClick={handleSetInactive}
              className="bg-gray-600 text-white"
              disabled={loading || !activeSemester?.isActive}
            >
              Set Semester Inactive
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
