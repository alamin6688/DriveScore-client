"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";

const ImportDataSection = () => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  return (
    <section id="import-data" className="relative py-24 bg-linear-to-t from-[#FFEBE6] via-white to-white overflow-hidden select-text">

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Badge */}
        <div className="flex justify-center mb-6">
           <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-2xl border-b-2 border-b-red-500/60  bg-white text-xs sm:text-sm font-semibold text-gray-800 shadow-sm select-none"> 
            <Upload className="w-3.5 h-3.5 text-gray-800" /> 
            <span>Import Your Data</span>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-normal text-gray-900 leading-[1.2] tracking-wide mb-5 poppins">
            Upload your Driver Data and watch rankings go live instantly! 
            {/* <br className="hidden sm:inline" />
            Rankings go live instantly. */}
          </h2>
          <p className="text-[13px] sm:text-sm md:text-[15px] text-gray-500/90 leading-relaxed font-medium max-w-2xl mx-auto px-2">
            Upload an Excel spreadsheet with your driver sessions. DriveScore handles score calculation, normalization,
            and leaderboard generation — automatically.
          </p>
        </div>

        {/* Dropzone Container */}
        <div className="max-w-7xl mx-auto">
          <div
            {...getRootProps()}
            className={`relative w-full rounded-[32px] p-12 sm:p-16 text-center bg-white shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300 flex flex-col items-center justify-center cursor-pointer select-none
              ${
                isDragActive
                  ? "border-2 border-dashed border-red-500 bg-red-50/5 scale-[1.01]"
                  : "border border-dashed border-red-500/60 hover:border-red-500 hover:shadow-[0_16px_40px_rgba(0,0,0,0.035)]"
              }`}
          >
            <input {...getInputProps()} />

            {/* Document Icon in Red Box */}
            <div className="w-12 h-12 rounded-[14px] border border-red-500 bg-white flex items-center justify-center text-red-500 mb-5 shadow-sm">
              <FileText className="w-5 h-5 stroke-[1.75]" />
            </div>

            {file ? (
              <div className="space-y-4">
                <p className="text-lg font-bold text-gray-900">
                  Selected File: <span className="text-red-500 font-extrabold">{file.name}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-full transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl sm:text-2xl font-normal text-gray-900 tracking-wide">
                  Drop your Excel Sheet here
                </h3>
                <p className="text-xs sm:text-sm text-gray-405 mt-1.5 font-medium">
                  or click on browse your files
                </p>

                <button
                  type="button"
                  className="mt-8 px-8 py-3 bg-[#D13900] hover:bg-[#b23000] text-white text-xs sm:text-sm font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Choose File
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImportDataSection;
