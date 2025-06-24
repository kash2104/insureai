
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { AuroraBackground } from '../components/ui/aurorabackground';
import { TextGenerateEffect } from '../components/ui/textgenerate';
import { BackgroundGradient } from '../components/ui/backgroundgradient';


const UploadIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-500 mb-3"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

function InsuranceUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
   const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const pageTitle = "Upload Your Medical Insurance";
  const pageSubtitle = "Securely upload your insurance documents. We accept PDF, JPG, and PNG formats.";
  const taskId = localStorage.getItem('task_id');

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      console.log("Selected file:", event.target.files[0]);
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      console.log("Dropped file:", e.dataTransfer.files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  const ws = new WebSocket('ws://localhost:4000'); // Adjust the URL as needed
    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({
        action: 'subscribe',
        task_id: taskId,  // This must match the ID used on backend
      }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message:', event.data);
      if (message.task_id === taskId) {
        console.log('WebSocket result:', message.result);
        setResult(message.result);
      }
    };

  const handleSubmit = async() => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const response = await fetch(`http://localhost:4000/api/v1/extract`,{
            method: 'POST',
            credentials: 'include', // Include cookies in the request
            body: formData,
        })
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
        
      }
    } else {
      alert("Please select a file first.");
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
      >
        <div className="text-center mb-8 md:mb-12">
          <TextGenerateEffect
            words={pageTitle}
            className="text-3xl md:text-5xl font-bold text-neutral-700 dark:text-white"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-3 text-md md:text-lg text-neutral-600 dark:text-neutral-300 "
          >
            {pageSubtitle}
          </motion.p>
        </div>

        <BackgroundGradient
          className="rounded-[22px] w-full max-w-lg p-6 md:p-10 bg-white dark:bg-zinc-900 shadow-xl"
          containerClassName="w-full max-w-lg"
        >
          <div
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer
              ${isDragging ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'}
              transition-colors duration-200 ease-in-out`}
            onClick={handleUploadAreaClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <UploadIcon className={`w-12 h-12 mb-4 transition-colors duration-200 ease-in-out ${isDragging ? 'text-blue-500 dark:text-blue-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
            {selectedFile ? (
              <div className="text-center">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  File Selected:
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 break-all">
                  {selectedFile.name}
                </p>
              </div>
            ) : (
              <p className={`text-sm text-center ${isDragging ? 'text-blue-600 dark:text-blue-300' : 'text-neutral-500 dark:text-neutral-400'}`}>
                Drag & drop your file here, or{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  click to browse
                </span>
              </p>
            )}
            <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-600">
              Max file size: 5MB
            </p>
          </div>
        </BackgroundGradient>

        {selectedFile && (
          <motion.button
            onClick={handleSubmit}
            className="mt-8 px-8 py-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transform transition-transform duration-200 ease-in-out cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Upload Document
          </motion.button>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 w-full max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 md:p-10"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-neutral-700 dark:text-white">
              Personalized Plan Recommendations
            </h2>
            <div className="prose dark:prose-invert max-w-none text-sm md:text-base">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </motion.div>
        )}
        {!result && selectedFile && (
          <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
            Processing your document... Please wait.
          </p>
        )}
      </motion.div>
    </AuroraBackground>
  );
}

export default InsuranceUploadPage;
