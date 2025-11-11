import { useEffect, useState } from "react";
import { addNotification } from "../utils/notifications";

const SemesterManagement = () => {
  const [activeSemester, setActiveSemester] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regOpen, setRegOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);

  // Fetch current active semester (used for all fetches)
  const fetchActiveSemester = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/semester/active");
      if (res.ok) {
        const data = await res.json();
        setActiveSemester(data);
        setRegOpen(!!data.isRegistrationOpen);
        setResultOpen(!!data.isResultsPublished);
      } else {
        setActiveSemester(null);
      }
    } catch {
      setActiveSemester(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSemester();
  }, []);

  // Start new semester
  const handleStartSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const name = (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value;
    const session = (e.currentTarget.elements.namedItem("session") as HTMLInputElement).value;
    try {
      const res = await fetch("/api/semester/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, session }),
      });
      const data = await res.json();
      if (res.ok) {
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

  // Toggle registration (reuse fetchActiveSemester)
  const handleToggleRegistration = async (status: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/semester/registration", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
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

  // Toggle result publication (reuse fetchActiveSemester)
  const handleToggleResult = async (status: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/semester/result-publication", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
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

  return (
    <div>
      <h1>Semester Management</h1>
      {loading && <p>Loading...</p>}
      {activeSemester && (
        <div>
          <h2>Active Semester: {activeSemester.name}</h2>
          <p>Session: {activeSemester.session}</p>
          <p>Registration: {regOpen ? "Open" : "Closed"}</p>
          <p>Results: {resultOpen ? "Published" : "Not Published"}</p>
        </div>
      )}
      <form onSubmit={handleStartSemester}>
        <input type="text" name="name" placeholder="Semester Name" required />
        <input type="text" name="session" placeholder="Session" required />
        <button type="submit">Start Semester</button>
      </form>
      <button onClick={() => handleToggleRegistration(!regOpen)}>
        {regOpen ? "Close Registration" : "Open Registration"}
      </button>
      <button onClick={() => handleToggleResult(!resultOpen)}>
        {resultOpen ? "Unpublish Results" : "Publish Results"}
      </button>
    </div>
  );
};

export default SemesterManagement;