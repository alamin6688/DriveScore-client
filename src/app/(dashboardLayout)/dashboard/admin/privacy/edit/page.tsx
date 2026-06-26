"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Heading2, 
  Heading3, 
  Type, 
  Eraser,
  Undo,
  Redo,
  Save,
  X
} from "lucide-react";
import { getPrivacyPolicy, savePrivacyPolicy } from "@/utils/privacyPolicy";
import { appAlert } from "@/utils/appAlert";

export default function AdminPrivacyPolicyEditor() {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize content on mount
  useEffect(() => {
    if (mounted && editorRef.current) {
      editorRef.current.innerHTML = getPrivacyPolicy();
    }
  }, [mounted]);

  const handleCommand = (command: string, value: string = "") => {
    if (typeof document !== "undefined") {
      document.execCommand(command, false, value);
    }
  };

  const handleAddLink = () => {
    if (typeof window !== "undefined") {
      const url = window.prompt("Enter link URL:", "https://");
      if (url) {
        handleCommand("createLink", url);
      }
    }
  };

  const handleSave = () => {
    if (!editorRef.current) return;
    setSaving(true);
    try {
      const htmlContent = editorRef.current.innerHTML;
      savePrivacyPolicy(htmlContent);
      
      appAlert.fire({
        icon: "success",
        title: "Policy Saved",
        text: "Privacy Policy updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/dashboard/admin/privacy");
    } catch (error) {
      appAlert.fire({
        icon: "error",
        title: "Save Failed",
        text: "Could not save the privacy policy. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/admin/privacy");
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D13900]"></div>
      </div>
    );
  }

  // Common button class for toolbar formatting buttons
  const toolbarBtnClass = "p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center cursor-pointer select-none";

  return (
    <div className="max-w-4xl mx-auto pb-12 select-none">
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] overflow-hidden">
        
        {/* Editor Toolbar Header */}
        <div className="bg-gray-50/75 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1 items-center">
            
            {/* Typography Blocks */}
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCommand("formatBlock", "<h2>")}
              title="Heading 2 (Section Title)"
            >
              <Heading2 className="w-5 h-5 stroke-2" />
            </button>
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCommand("formatBlock", "<h3>")}
              title="Heading 3 (Sub-section)"
            >
              <Heading3 className="w-5 h-5 stroke-2" />
            </button>
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCommand("formatBlock", "<p>")}
              title="Normal Paragraph"
            >
              <Type className="w-5 h-5 stroke-2" />
            </button>

            <div className="h-6 w-1px bg-gray-200 mx-1" />

            {/* Inline Formatting */}
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCommand("bold")}
              title="Bold"
            >
              <Bold className="w-5 h-5 stroke-2" />
            </button>
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCommand("italic")}
              title="Italic"
            >
              <Italic className="w-5 h-5 stroke-2" />
            </button>
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCommand("underline")}
              title="Underline"
            >
              <Underline className="w-5 h-5 stroke-2" />
            </button>

            <div className="h-6 w-1px bg-gray-200 mx-1" />

            {/* Lists */}
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCommand("insertUnorderedList")}
              title="Bullet List"
            >
              <List className="w-5 h-5 stroke-2" />
            </button>
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCommand("insertOrderedList")}
              title="Numbered List"
            >
              <ListOrdered className="w-5 h-5 stroke-2" />
            </button>

            <div className="h-6 w-1px bg-gray-200 mx-1" />

            {/* Links & Clear */}
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleAddLink}
              title="Insert Link"
            >
              <LinkIcon className="w-5 h-5 stroke-2" />
            </button>
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCommand("removeFormat")}
              title="Clear Formatting"
            >
              <Eraser className="w-5 h-5 stroke-2" />
            </button>

            <div className="h-6 w-1px bg-gray-200 mx-1" />

            {/* Undo / Redo */}
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCommand("undo")}
              title="Undo"
            >
              <Undo className="w-5 h-5 stroke-2" />
            </button>
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCommand("redo")}
              title="Redo"
            >
              <Redo className="w-5 h-5 stroke-2" />
            </button>
          </div>

          <div className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1.5 rounded-lg select-none">
            HTML Editor
          </div>
        </div>

        {/* ContentEditable Editor Area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[500px] max-h-[700px] overflow-y-auto px-6 sm:px-10 py-8 bg-white focus:outline-none focus:ring-1 focus:ring-[#D13900]/10 border-t border-gray-100 rich-text-content custom-editor-scrollbar select-text"
        />

        {/* Editor Bottom Actions */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 sm:px-10 py-5 flex items-center justify-end gap-3 select-none">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            disabled={saving}
          >
            <X className="w-4 h-4 text-gray-500" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#D13900] hover:bg-[#b03000] text-white text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex items-center gap-1.5"
            disabled={saving}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
