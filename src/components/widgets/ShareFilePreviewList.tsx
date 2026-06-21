"use client";

import { useEffect, useState } from "react";
import { FileText, File, Film, Music } from "lucide-react";
import type { ShareFile } from "@/lib/supabase/types";
import { formatFileSize } from "@/lib/file-utils";
import { useShareSession } from "@/contexts/ShareSessionProvider";

type FileCategory = "image" | "pdf" | "video" | "audio" | "other";

function getShareFileCategory(mime: string | null): FileCategory {
  if (mime?.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  if (mime?.startsWith("video/")) return "video";
  if (mime?.startsWith("audio/")) return "audio";
  return "other";
}

function FileTypeIcon({
  category,
  className,
}: {
  category: FileCategory;
  className?: string;
}) {
  const props = { className: className ?? "h-6 w-6", strokeWidth: 1.5 };

  switch (category) {
    case "pdf":
      return <FileText {...props} className={`${props.className} text-red-500`} />;
    case "video":
      return <Film {...props} className={`${props.className} text-purple-500`} />;
    case "audio":
      return <Music {...props} className={`${props.className} text-orange-500`} />;
    default:
      return <File {...props} className={`${props.className} text-muted`} />;
  }
}

function ShareFilePreviewTile({
  file,
  previewUrl,
  onView,
  compact = false,
}: {
  file: ShareFile;
  previewUrl?: string;
  onView: (file: ShareFile) => void;
  compact?: boolean;
}) {
  const category = getShareFileCategory(file.file_type);
  const isImage = category === "image";

  return (
    <div
      className={[
        "group shrink-0",
        compact ? "w-20" : "w-full min-w-0",
      ].join(" ")}
    >
      <div className="overflow-hidden rounded-md border border-border-light bg-background transition-all hover:border-primary/40 hover:shadow-sm">
        <div
          className={[
            "relative w-full bg-surface-muted",
            compact ? "h-16" : "h-[4.5rem]",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => onView(file)}
            title={`${file.file_name} (${formatFileSize(file.file_size)})`}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isImage && previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={file.file_name}
                className="h-full w-full object-contain"
              />
            ) : (
              <FileTypeIcon
                category={category}
                className={compact ? "h-4 w-4" : "h-5 w-5"}
              />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => onView(file)}
          className="w-full border-t border-border-light px-1 py-0.5 text-left"
        >
          <p className="truncate text-[10px] font-medium leading-tight text-foreground">
            {file.file_name}
          </p>
          {!compact && (
            <p className="text-[7px] text-muted-light">
              {formatFileSize(file.file_size)}
            </p>
          )}
        </button>
      </div>
    </div>
  );
}

interface ShareFilePreviewListProps {
  files: ShareFile[];
  onView: (file: ShareFile) => void;
  compact?: boolean;
}

export function ShareFilePreviewList({
  files,
  onView,
  compact = false,
}: ShareFilePreviewListProps) {
  const { downloadSharedFile } = useShareSession();
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    let cancelled = false;
    const imageFiles = files.filter(
      (file) => getShareFileCategory(file.file_type) === "image"
    );

    void Promise.all(
      imageFiles.map(async (file) => {
        const url = await downloadSharedFile(file);
        return [file.id, url] as const;
      })
    ).then((entries) => {
      if (cancelled) return;
      setPreviewUrls(new Map(entries));
    });

    return () => {
      cancelled = true;
    };
  }, [files, downloadSharedFile]);

  if (files.length === 0) return null;

  return (
    <div
      className={[
        "shrink-0 border-t border-border-light",
        compact ? "mt-2 pt-2" : "mt-4 pt-4",
      ].join(" ")}
    >
      <p
        className={[
          "text-label-caps text-muted-light",
          compact ? "mb-2" : "mb-3",
        ].join(" ")}
      >
        Dropped Files ({files.length})
      </p>
      <div
        className={
          compact
            ? "flex max-h-44 flex-wrap gap-2 overflow-y-auto pt-0.5 pr-0.5"
            : "grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8"
        }
      >
        {files.map((file) => (
          <ShareFilePreviewTile
            key={file.id}
            file={file}
            previewUrl={previewUrls.get(file.id)}
            onView={onView}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}
