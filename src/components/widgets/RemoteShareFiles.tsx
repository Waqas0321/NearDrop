"use client";

import { useEffect, useState } from "react";
import { Download, FileText, File, Film, Music } from "lucide-react";
import type { ShareFile } from "@/lib/supabase/types";
import { formatFileSize } from "@/lib/file-utils";
import { useShareSession } from "@/contexts/ShareSessionProvider";

function fileCategory(mime: string | null): "image" | "pdf" | "video" | "audio" | "other" {
  if (mime?.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  if (mime?.startsWith("video/")) return "video";
  if (mime?.startsWith("audio/")) return "audio";
  return "other";
}

function FileIcon({ mime }: { mime: string | null }) {
  const category = fileCategory(mime);
  const props = { className: "h-5 w-5 shrink-0", strokeWidth: 1.5 };

  switch (category) {
    case "pdf":
      return <FileText {...props} className="h-5 w-5 shrink-0 text-red-500" />;
    case "video":
      return <Film {...props} className="h-5 w-5 shrink-0 text-purple-500" />;
    case "audio":
      return <Music {...props} className="h-5 w-5 shrink-0 text-orange-500" />;
    default:
      return <File {...props} className="h-5 w-5 shrink-0 text-muted" />;
  }
}

function RemoteFileRow({ file }: { file: ShareFile }) {
  const { downloadSharedFile } = useShareSession();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const category = fileCategory(file.file_type);

  useEffect(() => {
    if (category !== "image") return;

    let cancelled = false;
    void downloadSharedFile(file).then((url) => {
      if (!cancelled) setPreviewUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [category, downloadSharedFile, file]);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const url = await downloadSharedFile(file);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.file_name;
      anchor.rel = "noopener noreferrer";
      anchor.click();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg bg-background/60 px-2 py-1.5">
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={file.file_name}
          className="h-10 w-10 shrink-0 rounded object-cover"
        />
      ) : (
        <FileIcon mime={file.file_type} />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-foreground">{file.file_name}</p>
        <p className="text-[10px] text-muted-light">{formatFileSize(file.file_size)}</p>
      </div>
      <button
        type="button"
        onClick={() => void handleDownload()}
        disabled={loading}
        className="rounded-md p-1.5 text-muted-light transition-colors hover:bg-background hover:text-primary"
        aria-label={`Download ${file.file_name}`}
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}

interface RemoteShareFilesProps {
  files: ShareFile[];
  label?: string;
}

export function RemoteShareFiles({ files, label }: RemoteShareFilesProps) {
  if (files.length === 0) return null;

  return (
    <div className="mt-2 border-t border-border/60 pt-2">
      {label && (
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-light">
          {label}
        </p>
      )}
      <div className="flex flex-col gap-1">
        {files.map((file) => (
          <RemoteFileRow key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
