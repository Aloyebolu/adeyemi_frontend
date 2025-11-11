"use client"
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ---------------------------------------------------------
// AI Assistant Prototype (Single-file React component)
// - Dark theme UI
// - Separate sidebar with button to return to main dashboard
// - Simulated LLM JSON responses that the frontend pattern-detector understands
// - Mock backend fetches
// - Table, Chart, and CSV file export demonstrations
// ---------------------------------------------------------

// Usage notes (short):
// - This is a single-file demo component. Drop into a React app (Vite or Next).
// - Requires Tailwind CSS for styling and `recharts` for charts.
// - Install: `npm i recharts`
// - Tailwind: make sure tailwind is configured in your project.

// ------------------------ Mock Data & Helpers ------------------------
const MOCK_DB = {
  students: [
    { id: "S001", name: "Ada Lovelace", gender: "Female", department: "Computer Science", year: 2, gpa: 4.5 },
    { id: "S002", name: "Alan Turing", gender: "Male", department: "Computer Science", year: 3, gpa: 4.8 },
    { id: "S003", name: "Grace Hopper", gender: "Female", department: "Computer Engineering", year: 4, gpa: 4.6 },
    { id: "S004", name: "Katherine Johnson", gender: "Female", department: "Mathematics", year: 3, gpa: 4.7 },
    { id: "S005", name: "Tim Berners-Lee", gender: "Male", department: "Computer Science", year: 1, gpa: 4.2 },
  ],
  lecturers: [
    { id: "L01", name: "Dr. Smith", faculty: "Science", dept: "Computer Science", email: "smith@uni.edu" },
    { id: "L02", name: "Prof. Ada", faculty: "Engineering", dept: "Computer Engineering", email: "ada@uni.edu" },
  ],
};

function sleep(ms = 500) {
  return new Promise((res) => setTimeout(res, ms));
}

async function mockApiFetch({ collection, filters }) {
  // simulate latency
  await sleep(600);
  const data = MOCK_DB[collection] || [];
  if (!filters || Object.keys(filters).length === 0) return data;
  // simple filter matcher (exact values)
  return data.filter((row) => {
    return Object.entries(filters).every(([k, v]) => {
      if (v === "__exists__") return row[k] !== undefined;
      return String(row[k]).toLowerCase() === String(v).toLowerCase();
    });
  });
}

function jsonToCsv(rows) {
  if (!rows || rows.length === 0) return "";
  const cols = Object.keys(rows[0]);
  const lines = [cols.join(",")];
  for (const r of rows) {
    lines.push(cols.map((c) => JSON.stringify(r[c] ?? "")).join(","));
  }
  return lines.join("\n");
}

// ------------------------ Simulated LLM Responses ------------------------
// In a real system, these would come from an LLM service which is given the DB schema.
const SIMULATED_LLM_RESPONSES = [
  {
    label: "Show student list (CS)",
    json: `{
  "action": "fetch",
  "collection": "students",
  "filters": { "department": "Computer Science" },
  "display": "table"
}`,
  },
  {
    label: "Show enrollment by department (chart)",
    json: `{
  "action": "fetch",
  "collection": "students",
  "aggregation": "group_by",
  "group_by": "department",
  "display": "bar_chart",
  "value_field": "count"
}`,
  },
  {
    label: "Download lecturers list (CSV)",
    json: `{
  "action": "fetch",
  "collection": "lecturers",
  "display": "file",
  "file_type": "csv",
  "filename": "lecturers.csv"
}`,
  },
  {
    label: "Plain text answer",
    json: `{
  "action": "answer",
  "text": "There are 3 departments in the mock dataset: Computer Science, Computer Engineering, Mathematics.",
  "display": "text"
}`,
  },
];

// ------------------------ Main Component ------------------------
export default function AiAssistantPrototype() {
  const [open, setOpen] = useState(true); // whether assistant panel is open
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [displayType, setDisplayType] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [infoText, setInfoText] = useState("");

  useEffect(() => {
    // initial welcome
    setMessages([
      { from: "assistant", text: "Hello — I'm the AI Assistant prototype. Choose a sample LLM response to simulate." },
    ]);
  }, []);

  function appendMessage(msg) {
    setMessages((m) => [...m, msg]);
  }

  async function handleSimulatedLlm(jsonString) {
    appendMessage({ from: "llm", text: jsonString });
    let parsed = null;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      appendMessage({ from: "assistant", text: "LLM returned invalid JSON." });
      return;
    }

    // Pattern detection & action routing
    switch (parsed.action) {
      case "fetch":
        await handleFetchAction(parsed);
        break;
      case "answer":
        setDisplayType("text");
        setInfoText(parsed.text || "");
        appendMessage({ from: "assistant", text: parsed.text || "" });
        break;
      default:
        appendMessage({ from: "assistant", text: "Action not recognized in LLM response." });
    }
  }

  async function handleFetchAction(parsed) {
    setBusy(true);
    setFetchedData(null);
    setChartData(null);
    setInfoText("");

    // If aggregation requested (simple group_by -> count)
    if (parsed.aggregation === "group_by") {
      const raw = await mockApiFetch({ collection: parsed.collection, filters: parsed.filters || {} });
      // group by field
      const map = {};
      for (const r of raw) {
        const key = r[parsed.group_by] || "Unknown";
        map[key] = (map[key] || 0) + 1;
      }
      const chart = Object.entries(map).map(([k, v]) => ({ name: k, value: v }));
      setChartData(chart);
      setDisplayType(parsed.display || "bar_chart");
      appendMessage({ from: "assistant", text: `Fetched aggregation and prepared ${parsed.display}.` });
      setBusy(false);
      return;
    }

    // normal fetch
    const rows = await mockApiFetch({ collection: parsed.collection, filters: parsed.filters || {} });
    setFetchedData(rows);
    setDisplayType(parsed.display || "table");
    appendMessage({ from: "assistant", text: `Fetched ${rows.length} records from ${parsed.collection}.` });

    // file export
    if (parsed.display === "file") {
      if (parsed.file_type === "csv") {
        const csv = jsonToCsv(rows);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = parsed.filename || "export.csv";
        a.click();
        URL.revokeObjectURL(url);
        appendMessage({ from: "assistant", text: `CSV download triggered (${parsed.filename}).` });
      }
    }

    setBusy(false);
  }

  // ---------------- Render helpers ----------------
  function RenderTable({ rows }) {
    if (!rows || rows.length === 0) return <div className="p-4">No rows to display.</div>;
    const cols = Object.keys(rows[0]);
    return (
      <div className="overflow-auto p-2">
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c} className="px-3 py-2 text-left text-xs opacity-80">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                {cols.map((c) => (
                  <td key={c} className="px-3 py-2 text-xs">
                    {String(r[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function RenderBarChart({ data }) {
    if (!data) return <div className="p-4">No chart data.</div>;
    return (
      <div className="h-64 p-2">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  function RenderPieChart({ data }) {
    if (!data) return null;
    return (
      <div className="h-64 p-2">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
              {data.map((_, i) => (
                <Cell key={i} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-white font-sans">
      <div className="flex">
        {/* Main Dashboard stub */}
        <div className="w-3/4 p-6">
          <div className="bg-[#071126] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">University Dashboard (Main)</h1>
              <button
                onClick={() => setOpen((s) => !s)}
                className="bg-white/5 px-4 py-2 rounded hover:bg-white/10"
              >
                Toggle AI Assistant
              </button>
            </div>
            <p className="mt-4 text-sm opacity-80">This area represents the main dashboard. The AI Assistant opens as a separate panel to the right.</p>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-4 bg-[#081228] rounded-xl">Widget A (placeholder)</div>
              <div className="p-4 bg-[#081228] rounded-xl">Widget B (placeholder)</div>
              <div className="p-4 bg-[#081228] rounded-xl">Widget C (placeholder)</div>
            </div>

            <div className="mt-6 p-4 bg-[#071224] rounded-xl text-sm opacity-80">
              Use this prototype to demonstrate the AI assistant. Click the sample LLM responses on the right to simulate behavior.
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className={`w-1/4 h-screen transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
          <div className="h-full bg-gradient-to-b from-[#0d1322] to-[#071224] border-l border-white/5 p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">AI Assistant (Dark)</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Return to main dashboard pressed')}
                  className="text-xs px-3 py-1 bg-white/5 rounded hover:bg-white/10"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-4 flex-1 overflow-auto">
              <div className="mb-4">
                <div className="text-xs opacity-80">Simulated LLM responses (click to run)</div>
                <div className="mt-2 flex flex-col gap-2">
                  {SIMULATED_LLM_RESPONSES.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSimulatedLlm(s.json)}
                      className="text-left p-2 bg-white/3 rounded hover:bg-white/6 text-sm"
                    >
                      <div className="font-medium">{s.label}</div>
                      <div className="mt-1 text-xs opacity-70 whitespace-pre-wrap">{s.json}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs opacity-80">Conversation</div>
                <div className="mt-2 space-y-2">
                  {messages.map((m, i) => (
                    <div key={i} className={`p-2 rounded ${m.from === 'assistant' ? 'bg-white/4' : 'bg-white/6'}`}>
                      <div className="text-xs opacity-80">{m.from}</div>
                      <div className="text-sm mt-1 whitespace-pre-wrap">{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs opacity-80">Results</div>
                <div className="mt-2 bg-[#06111f] rounded p-2 min-h-[160px]">
                  {busy && <div className="text-sm opacity-70">Loading...</div>}

                  {!busy && displayType === "table" && <RenderTable rows={fetchedData} />}
                  {!busy && displayType === "bar_chart" && <RenderBarChart data={chartData} />}
                  {!busy && displayType === "pie_chart" && <RenderPieChart data={chartData} />}
                  {!busy && displayType === "text" && (
                    <div className="p-2 text-sm">{infoText}</div>
                  )}

                  {!busy && !displayType && <div className="p-2 text-sm opacity-70">No result yet. Run a simulated LLM response.</div>}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs opacity-70">Prototype notes: read-only mock database, simulated LLM, JSON pattern detection, table/chart/file outputs.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
