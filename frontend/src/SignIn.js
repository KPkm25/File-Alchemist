import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignInForm() {
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (evt) => {
    setFile(evt.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("xml", file);

    try {
      await axios.post("https://alchemist-api.vercel.app/api/upload", formData);
      toast.success('File uploaded successfully!');
      setUploadSuccess(true);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error('Upload Failed!');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get("https://alchemist-api.vercel.app/api/export", {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exported.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error('Download Failed!');
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Upload an XML File</h1>
        {!uploadSuccess && (
          <>
            <input type="file" accept=".xml" onChange={handleFileChange} required />
            <button onClick={handleUpload}>Upload</button>
          </>
        )}
        {uploadSuccess && (
          <button onClick={handleDownload}>Download Excel File</button>
        )}
      </form>
    </div>
  );
}

export default SignInForm;
