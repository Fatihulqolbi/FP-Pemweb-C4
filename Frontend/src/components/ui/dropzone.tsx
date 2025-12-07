"use client";

import { useState, useEffect } from "react";
import * as FileUpload from "@/components/ui/file-upload";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface DropzoneProps {
  label?: string;
  maxSize?: number; // bytes
  allowedTypes?: string[];
  required?: boolean;
  onChange?: (file: File | null) => void;
  defaultValue?: File | string | null;
}

export default function Dropzone({
  label = "Upload File",
  maxSize = 5 * 1024 * 1024,
  allowedTypes = ["image/png", "image/jpeg"],
  required = false,
  onChange,
  defaultValue = null,
}: DropzoneProps) {
  const [file, setFile] = useState<File | null>(
    defaultValue instanceof File ? defaultValue : null,
  );

  const [preview, setPreview] = useState<string | null>(
    typeof defaultValue === "string"
      ? defaultValue
      : defaultValue instanceof File
        ? URL.createObjectURL(defaultValue)
        : null,
  );

  const [error, setError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // --- Sync defaultValue ---
  useEffect(() => {
    if (defaultValue instanceof File) {
      setFile(defaultValue);
      setPreview(URL.createObjectURL(defaultValue));
    } else if (typeof defaultValue === "string") {
      setFile(null);
      setPreview(defaultValue);
    } else {
      setFile(null);
      setPreview(null);
    }
  }, [defaultValue]);

  // Cleanup URL blob
  useEffect(() => {
    return () => {
      if (file instanceof File && preview) URL.revokeObjectURL(preview);
    };
  }, [file, preview]);

  const validateFile = (f: File | null) => {
    if (!f) {
      if (required) setError("This field is required");
      return false;
    }
    if (f.size > maxSize) {
      setError(`Max size ${Math.round(maxSize / 1024 / 1024)}MB`);
      return false;
    }
    if (!allowedTypes.includes(f.type)) {
      setError("Invalid file type");
      return false;
    }
    setError("");
    return true;
  };

  const handleFileChange = (files: File[]) => {
    const f = files[0] ?? null;
    if (!validateFile(f)) {
      handleDelete();
      return;
    }
    if (preview && file instanceof File) {
      URL.revokeObjectURL(preview);
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    onChange?.(f);
  };

  const handleDelete = () => {
    if (preview && file instanceof File) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    onChange?.(null);
    if (required) setError("This field is required");
    else setError("");
  };

  return (
    <div className="w-full space-y-2">
      <Label className="font-mono text-purple-300 text-sm tracking-wide flex items-center gap-1">
        {label} {required && <span className="text-cyan-400">*</span>}
      </Label>

      <FileUpload.Root
        value={file ? [file] : []}
        onValueChange={handleFileChange}
        maxFiles={1}
        maxSize={maxSize}
        className="w-full"
      >
        {!preview && (
          <FileUpload.Dropzone className="p-6 border-2 border-dashed border-cyan-500/30 rounded-xl flex flex-col items-center text-center gap-2 bg-gray-900/30 hover:border-purple-500/50 hover:bg-gray-900/50 transition-all duration-300">
            <Upload className="size-6 text-cyan-400" style={{ filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))' }} />
            <div className="text-sm font-mono text-purple-300 tracking-wide">Drag or click to upload</div>
            <div className="text-xs text-gray-400 font-mono">
              Max {Math.round(maxSize / 1024 / 1024)}MB — Allowed:{" "}
              {allowedTypes.map((t) => t.split("/")[1]).join(", ")}
            </div>
            <FileUpload.Trigger asChild>
              <Button 
                size="sm" 
                className="bg-purple-600/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30 hover:text-cyan-300 font-mono transition-all duration-300"
                style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)' }}
              >
                Choose File
              </Button>
            </FileUpload.Trigger>
          </FileUpload.Dropzone>
        )}

        {preview && !file && (
          <div className="flex items-center gap-3 p-2 border-2 border-cyan-500/30 rounded-md mt-2 bg-gray-900/30 backdrop-blur-sm">
            <div
              className="size-16 rounded-md overflow-hidden cursor-pointer border border-purple-500/30 hover:border-cyan-500/50 transition-all duration-300"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-sm truncate text-cyan-300 font-mono">{preview}</div>

            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 hover:border-red-400/50"
            >
              <X className="size-4" />
            </Button>
          </div>
        )}

        {preview && file && (
          <FileUpload.List className="mt-2">
            <FileUpload.Item
              value={file}
              className="flex items-center gap-3 p-2 border-2 border-cyan-500/30 rounded-md bg-gray-900/30 backdrop-blur-sm"
            >
              <FileUpload.ItemPreview
                className="size-16 rounded-md overflow-hidden cursor-pointer border border-purple-500/30 hover:border-cyan-500/50 transition-all duration-300"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </FileUpload.ItemPreview>

              <div className="flex-1 text-sm truncate text-cyan-300 font-mono">{file?.name}</div>

              <FileUpload.ItemDelete asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 hover:border-red-400/50"
                >
                  <X className="size-4" />
                </Button>
              </FileUpload.ItemDelete>
            </FileUpload.Item>
          </FileUpload.List>
        )}
      </FileUpload.Root>

      {error && <p className="text-red-400 text-xs font-mono tracking-wide">&gt; {error}</p>}

      {lightboxOpen && preview && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={[{ src: preview }]}
        />
      )}
    </div>
  );
}
