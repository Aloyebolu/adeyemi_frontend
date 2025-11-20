"use client";

import { useState, useRef, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { 
  Send, 
  User, 
  Bot, 
  Loader2, 
  Download, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  BookOpen,
  Database
} from "lucide-react";

interface AIMessage {
  type: string;
  content?: string;
  columns?: string[];
  rows?: any[][];
  items?: string[];
  style?: string;
  chartType?: string;
  data?: Record<string, number>;
  timestamp?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AIPage() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load query history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ai-query-history");
    if (saved) {
      setQueryHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (query: string) => {
    const newHistory = [query, ...queryHistory.filter(q => q !== query)].slice(0, 10);
    setQueryHistory(newHistory);
    localStorage.setItem("ai-query-history", JSON.stringify(newHistory));
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-conversation-${new Date().getTime()}.json`;
    link.click();
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const sendQuery = async () => {
    if (!inputRef.current?.value.trim()) return;
    
    const query = inputRef.current.value.trim();
    inputRef.current.value = "";
    setLoading(true);
    saveToHistory(query);

    // Add user message
    const userMessage: AIMessage = {
      type: "user",
      content: query,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("API request failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data: AIMessage = JSON.parse(line);
            data.timestamp = Date.now();

            if (data.type === "callback") {
              setLoading(true);
            } else {
              setMessages(prev => [...prev, data]);
              setLoading(false);
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, {
        type: "error",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now()
      }]);
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery();
    }
  };

  const renderMessage = (msg: AIMessage, index: number) => {
    const isUser = msg.type === "user";
    
    if (isUser) {
      return (
        <div key={index} className="flex justify-end mb-4">
          <div className="flex items-start gap-2 max-w-[80%]">
            <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none">
              <p className="text-sm">{msg.content}</p>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-white" />
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === "error") {
      return (
        <div key={index} className="flex justify-start mb-4">
          <div className="flex items-start gap-2 max-w-[80%]">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-red-100 border border-red-300 p-3 rounded-2xl rounded-tl-none">
              <p className="text-sm text-red-800">{msg.content}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="flex justify-start mb-6">
        <div className="flex items-start gap-3 max-w-[80%]">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
              {renderMessageContent(msg, index)}
              
              {/* Copy button for text content */}
              {msg.content && (
                <button
                  onClick={() => copyToClipboard(msg.content!, index)}
                  className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check size={12} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMessageContent = (msg: AIMessage, index: number) => {
    switch (msg.type) {
      case "text":
        return <p className="text-gray-800 leading-relaxed">{msg.content}</p>;
      
      case "h1":
        return <h1 className="text-3xl font-bold text-gray-900 mb-2">{msg.content}</h1>;
      
      case "h2":
        return <h2 className="text-2xl font-bold text-gray-900 mb-2">{msg.content}</h2>;
      
      case "h3":
        return <h3 className="text-xl font-semibold text-gray-800 mb-2">{msg.content}</h3>;
      
      case "h4":
        return <h4 className="text-lg font-semibold text-gray-800 mb-1">{msg.content}</h4>;
      
      case "h5":
        return <h5 className="text-base font-semibold text-gray-800 mb-1">{msg.content}</h5>;
      
      case "h6":
        return <h6 className="text-sm font-semibold text-gray-700 mb-1">{msg.content}</h6>;
      
      case "list":
        return msg.style === "ordered" ? (
          <ol className="list-decimal ml-6 my-2 space-y-1">
            {msg.items?.map((item, i) => <li key={i} className="text-gray-700">{item}</li>)}
          </ol>
        ) : (
          <ul className="list-disc ml-6 my-2 space-y-1">
            {msg.items?.map((item, i) => <li key={i} className="text-gray-700">{item}</li>)}
          </ul>
        );
      
      case "table":
        return (
          <div className="overflow-x-auto my-3">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  {msg.columns?.map((col, i) => (
                    <th key={i} className="border-b border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {msg.rows?.map((row, r) => (
                  <tr key={r} className={r % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {row.map((cell, c) => (
                      <td key={c} className="border-b border-gray-200 px-4 py-2 text-sm text-gray-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case "chart":
        if (!msg.data) return null;
        
        const chartData = Object.entries(msg.data).map(([key, value]) => ({ 
          name: key, 
          value 
        }));

        const renderChart = () => {
          switch (msg.chartType) {
            case "line":
              return (
                <LineChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              );
            
            case "pie":
              return (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              );
            
            case "area":
              return (
                <AreaChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} />
                </AreaChart>
              );
            
            default:
              return (
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              );
          }
        };

        return (
          <div className="w-full h-64 my-4">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return <p className="text-gray-800">{msg.content}</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Data Assistant</h1>
              <p className="text-gray-600 text-sm">Ask questions about your data</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {messages.length > 0 && (
              <>
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download size={16} />
                  Export
                </button>
                <button
                  onClick={clearConversation}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  Clear
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap size={16} />
                Quick Queries
              </h3>
              <div className="space-y-2">
                {[
                  "Show me sales trends",
                  "Top performing products",
                  "Revenue by category",
                  "Monthly growth rate"
                ].map((query, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (inputRef.current) {
                        inputRef.current.value = query;
                      }
                    }}
                    className="w-full text-left text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>

            {/* Query History */}
            {queryHistory.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen size={16} />
                  Recent Queries
                </h3>
                <div className="space-y-2">
                  {queryHistory.slice(0, 5).map((query, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (inputRef.current) {
                          inputRef.current.value = query;
                        }
                      }}
                      className="w-full text-left text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors truncate"
                      title={query}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Messages Container */}
              <div className="h-[500px] overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Database size={24} className="text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Ask about your data
                      </h3>
                      <p className="text-gray-600 text-sm max-w-sm">
                        Get insights, generate reports, and visualize your data with natural language queries.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map(renderMessage)}
                    {loading && (
                      <div className="flex justify-start mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                            <Bot size={16} className="text-white" />
                          </div>
                          <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Loader2 size={16} className="animate-spin" />
                              <span className="text-sm">Analyzing data...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask a question about your data..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <button
                    onClick={sendQuery}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}