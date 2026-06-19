"use client";

import { useEffect, useState } from "react";
import { X, Download, FileText, File } from "lucide-react";
import {
  DroppedFile,
  formatFileSize,
  getFileCategory,
} from "@/lib/file-utils";

interface FileViewerModalProps {
  item: DroppedFile | null;
  onClose: () => void;
}

export function FileViewerModal({ item, onClose }: FileViewerModalProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!item) {
      setObjectUrl(null);
      return;
    }

    const url = URL.createObjectURL(item.file);
    setObjectUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [item]);

  useEffect(() => {
    if (!item) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item || !objectUrl) return null;

  const category = getFileCategory(item.file);
  const { file } = item;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-overlay-strong p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-card shadow-lg sm:max-h-[92vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-light px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0 pr-4">
            <p className="truncate text-sm font-semibold text-foreground">
              {file.name}
            </p>
            <p className="text-xs text-muted">
              {formatFileSize(file.size)}
              {file.type ? ` · ${file.type}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={objectUrl}
              download={file.name}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-foreground"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-auto bg-background p-4">
          {category === "image" && (
            <img
              src={objectUrl}
              alt={file.name}
              className="max-h-[75vh] max-w-full rounded-lg object-contain"
            />
          )}

          {category === "pdf" && (
            <iframe
              src={objectUrl}
              title={file.name}
              className="h-[75vh] w-full rounded-lg border border-border-light bg-card"
            />
          )}

          {category === "video" && (
            <video
              src={objectUrl}
              controls
              className="max-h-[75vh] max-w-full rounded-lg"
            >
              Your browser does not support video playback.
            </video>
          )}

          {category === "audio" && (
            <div className="flex w-full max-w-md flex-col items-center gap-6 py-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-light">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <audio src={objectUrl} controls className="w-full">
                Your browser does not support audio playback.
              </audio>
            </div>
          )}

          {category === "other" && (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-surface-muted">
                <File className="h-12 w-12 text-muted" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {file.name}
                </p>
                <p className="mt-1 text-sm text-muted">
                  Preview not available for this file type
                </p>
              </div>
              <a
                href={objectUrl}
                download={file.name}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                Download file
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
