import React from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function SignUpForm() {
  const [file, setFile] = React.useState(null);

  const handleFileChange = (evt) => {
    setFile(evt.target.files[0]);
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
  
    const formData = new FormData();
    formData.append("excel", file);
  
    try {
      const response = await axios.post("http://localhost:5000/api/convert", formData, {
        responseType: 'blob', // Ensure response is treated as a blob
      });
      toast.success('File uploaded successfully!');

  
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
  
      // Create a link element and click it to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.pdf'); // Set the filename
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      window.URL.revokeObjectURL(url);
      link.parentNode.removeChild(link);
  
      console.log("Upload success");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  
    // Clear the file input
    setFile(null);
  };
  

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Upload Excel File</h1>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Convert Now!</button>
      </form>
    </div>
  );
}

export default SignUpForm;
