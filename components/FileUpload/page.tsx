import React, { useState } from "react";

type FileUploadProps = {
  uploadUrl: string; // API endpoint to send the file
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  maxSizeMB?: number;
};

const FileUpload: React.FC<FileUploadProps> = ({
  uploadUrl,
  onSuccess,
  onError,
  maxSizeMB = 10,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only Excel files (.xlsx or .xls) are allowed.");
      setFile(null);
      return;
    }

    // Validate file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size cannot exceed ${maxSizeMB} MB.`);
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed!");
      }

      const data = await response.json();
      onSuccess?.(data);
    } catch (err) {
      setError((err as Error).message);
      onError?.(err);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        {loading ? "Uploading..." : "Upload Excel File"}
      </button>

      {file && !loading && <p>Selected file: {file.name}</p>}
    </div>
  );
};

export default FileUpload;
