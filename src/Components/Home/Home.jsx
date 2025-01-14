//using API

import React, { useState, useCallback } from "react";
import { FileText, Upload, FileImage } from "lucide-react";
import axios from "axios";
import logo from "../../images/Corelia.png";


function App() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const [extractedData, setExtractedData] = useState(null);

  const API_BASE_URL = "http://41.33.149.211:1331";

  const uploadFile = async (file) => {
    try {
      if (!(file instanceof File)) {
        console.error("Invalid file object passed:", file);
        throw new Error("Invalid file object passed to uploadFile.");
      }

      console.log("Uploading file:", file);

      setUploadStatus((prev) => ({ ...prev, [file.name]: "uploading" }));

      const formData = new FormData();
      formData.append("docs", file);

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/ocr?doc_type=ocr&lang=auto`,
        formData
      );

      setUploadStatus((prev) => ({ ...prev, [file.name]: "completed" }));
      setExtractedData(response.data);
      return response.data;
    } catch (error) {
      console.error("Upload error:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
      }

      setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }));
      throw error;
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const filesArray = Array.from(acceptedFiles); 
    console.log("Accepted Files:", filesArray);
  
    const newFiles = filesArray.map((file) => ({
      ...file,
      preview: URL.createObjectURL(file),
    }));
    setFiles(newFiles);
  
    filesArray.forEach((file) => {
      uploadFile(file).catch(console.error);
    });
  }, []);
  
  

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    onDrop(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    const files = e.target.files; 
    onDrop(files); 
  };
  
  const getStatusBadge = (fileName) => {
    const status = uploadStatus[fileName];
    switch (status) {
      case "uploading":
        return <span className="ms-auto badge bg-warning">Uploading...</span>;
      case "completed":
        return <span className="ms-auto badge bg-success">Processed</span>;
      case "error":
        return <span className="ms-auto badge bg-danger">Error</span>;
      default:
        return <span className="ms-auto badge bg-secondary">Pending</span>;
    }
  };

  const handleExport = () => {
    if (extractedData) {
      const blob = new Blob([JSON.stringify(extractedData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "extracted_data.json");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
 <nav className="navbar navbar-light bg-white shadow">
        <div className="container d-flex justify-content-between align-items-cente">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src={logo}
              alt=""
              className="me-2"
              height="75"
            />
          </a>
          <div className="text-end">
            <span className="h4 mb-0 d-block text-primary">
              {" "}
              Qalam Vision <FileText className="me-2" size={24} />{" "}
            </span>
            <span className="text-muted small">
              Arabic Document Intelligence
            </span>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Extracted Data</h5>
                <button
                  className="btn btn-primary"
                  onClick={handleExport}
                  disabled={!extractedData}
                >
                  Export Results <FileText size={16} className="ms-2" />
                </button>
              </div>
              <div className="card-body">
                {!extractedData ? (
                  <div className="text-center py-5 text-muted">
                    <FileText
                      size={48}
                      className="mb-3 mx-auto d-block opacity-50"
                    />
                    <p>Upload a document to see extracted data</p>
                  </div>
                ) : (
                  <div className="bg-light p-4 rounded">
                    <pre
                      className="mb-0"
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {JSON.stringify(extractedData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Upload Documents</h5>
              </div>
              <div className="card-body">
                <div
                  className={`upload-area border-2 border-dashed rounded-3 p-5 text-center ${
                    isDragging ? "border-primary bg-light" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload size={48} className="mb-3 text-primary opacity-50" />
                  <h5>Drag & drop files here</h5>
                  <p className="text-muted mb-3">
                    Support for PDF, PNG, JPG (up to 10MB)
                  </p>
                  <div className="d-flex justify-content-center">
                    <label className="btn btn-outline-primary">
                      <input
                        type="file"
                        className="d-none"
                        onChange={handleFileInput}
                        accept=".pdf,.png,.jpg,.jpeg"
                        multiple
                      />
                      Or click to browse
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-4">
              <div className="card-header">
                <h5 className="mb-0">Processing Status</h5>
              </div>
              <div className="card-body">
                {files.length === 0 ? (
                  <p className="text-muted mb-0">No files uploaded yet</p>
                ) : (
                  <div>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-2"
                      >
                        <FileImage size={20} className="me-2" />
                        <span>{file.name}</span>
                        {getStatusBadge(file.name)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
