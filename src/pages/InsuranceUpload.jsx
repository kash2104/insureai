import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "../components/ui/aurorabackground";
import { TextGenerateEffect } from "../components/ui/textgenerate";
import { BackgroundGradient } from "../components/ui/backgroundgradient";
import MarkdownRenderer from "../components/Markdownrenderer";
import useSocket from "../hooks/useSocket";

const UploadIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={
      className ||
      "w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-500 mb-3"
    }
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

const Spinner = () => (
  <div className="flex justify-center items-center my-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
  </div>
);

function InsuranceUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const pageTitle = "Upload Your Medical Insurance";
  const pageSubtitle =
    "Securely upload your insurance documents. We accept PDF, JPG, and PNG formats.";
  // const taskId = localStorage.getItem("task_id");
  // console.log(localStorage.getItem("task_id"));
  const { socket, sendMessage, taskId } = useSocket();

  useEffect(() => {
    if (!taskId && !isProcessing) return;
    if (result && !isProcessing) return;

    // const ws = new WebSocket(`ws://${import.meta.env.VITE_IP_ADDRESS}:4000`);

    // ws.onopen = () => {
    //   if (taskId) {
    //     ws.send(JSON.stringify({
    //       action: 'subscribe',
    //       task_id: taskId,
    //     }));
    //   }
    // };
    if (socket) {
      sendMessage();
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (taskId && message.task_id === taskId) {
          setResult(message.result);
          setIsProcessing(false);
        } else if (!taskId && message.result) {
          setResult(message.result);
          setIsProcessing(false);
        }
      };
    }
  }, [socket, taskId]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setResult(null);
      setIsProcessing(false);
    }
  };

  const handleUploadAreaClick = () => {
    if (!isProcessing) fileInputRef.current?.click();
  };

  const handleDragEvents = (e, type) => {
    if (isProcessing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(type === "enter" || type === "over");
  };

  const handleDrop = (e) => {
    if (isProcessing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setResult(null);
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      setResult(null);
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/extract`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        const uploadResponseData = await response.json();
        if (!response.ok) {
          throw new Error(uploadResponseData.message || `Upload failed`);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
        setIsProcessing(false);
      }
    } else {
      alert("Please select a file first.");
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="relative flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pt-16 md:pt-24 w-full"
      >
        <div className="text-center mb-8 md:mb-12 w-full max-w-3xl">
          <TextGenerateEffect
            words={pageTitle}
            className="text-3xl md:text-5xl font-bold text-neutral-700 dark:text-white"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-3 text-md md:text-lg text-neutral-600 dark:text-neutral-300"
          >
            {pageSubtitle}
          </motion.p>
        </div>

        {result && !isProcessing ? (
          <motion.div
            key="results-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="my-6 p-6 md:p-8 bg-white dark:bg-zinc-800/90 rounded-xl shadow-2xl w-full max-w-3xl"
          >
            <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-neutral-100 text-center">
              Analysis Results
            </h2>
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <MarkdownRenderer content={result} />
            </div>
            <div className="mt-8 text-center">
              <motion.button
                onClick={handleClear}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Upload Another Document
              </motion.button>
            </div>
          </motion.div>
        ) : isProcessing ? (
          <motion.div
            key="processing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="my-10 p-10"
          >
            <Spinner />
            <p className="mt-4 text-center text-neutral-600 dark:text-neutral-300">
              Processing your document...
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="upload-form-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg"
          >
            <BackgroundGradient
              className="rounded-[22px] w-full p-6 md:p-10 bg-white dark:bg-zinc-900 shadow-xl"
              containerClassName="w-full"
            >
              <div
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl
                  ${
                    isDragging
                      ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                      : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500"
                  }
                  ${
                    isProcessing
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-pointer"
                  }
                  transition-colors duration-200 ease-in-out`}
                onClick={handleUploadAreaClick}
                onDragEnter={(e) => handleDragEvents(e, "enter")}
                onDragLeave={(e) => handleDragEvents(e, "leave")}
                onDragOver={(e) => handleDragEvents(e, "over")}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={isProcessing}
                />
                <UploadIcon
                  className={`w-12 h-12 mb-4 ${
                    isDragging
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-neutral-400 dark:text-neutral-500"
                  }`}
                />
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
                  <p
                    className={`text-sm text-center ${
                      isDragging
                        ? "text-blue-600 dark:text-blue-300"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
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
              <div className="text-center">
                <motion.button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="mt-8 px-8 py-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transform transition-transform duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={{ scale: isProcessing ? 1 : 1.05 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {isProcessing ? "Processing..." : "Upload Document"}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AuroraBackground>
  );
}

export default InsuranceUploadPage;
