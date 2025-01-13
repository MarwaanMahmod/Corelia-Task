import React, { useState, useCallback } from "react";
import { FileText, Upload, FileImage } from "lucide-react";
import logo from "../../images/Corelia.png";


function Home() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles) {
      const newFiles = Array.from(acceptedFiles).map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
      }));
      setFiles(newFiles);
    }
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
    onDrop(e.target.files);
  };

  const handleExportResults = () => {
    files.forEach((file) => {
      const link = document.createElement("a");
      link.href = file.preview;
      link.download = file.name;
      link.click();
    });
  };

  return (
    <div className="container-fluid vh-100 bg-light">
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
                  onClick={handleExportResults}
                >
                  Export Results <FileText size={16} className="ms-2" />
                </button>
              </div>
              <div className="card-body text-center py-5">
                {files.length === 0 ? (
                  <div className="text-muted">
                    <FileText
                      size={48}
                      className="mb-3 mx-auto d-block opacity-50"
                    />
                    <p>Upload a document to see extracted data</p>
                  </div>
                ) : (
                  <div>
                    {files.map((file, index) => (
                      <div key={index} className="mb-3">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="img-fluid mb-2"
                          style={{ maxHeight: "200px" }}
                        />
                        <p className="mb-0">{file.name}</p>
                      </div>
                    ))}
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
                        <span className="ms-auto badge bg-success">
                          Processed
                        </span>
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

export default Home;
