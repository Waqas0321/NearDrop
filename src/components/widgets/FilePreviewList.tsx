"use client";

import { useEffect, useState } from "react";
import { FileText, File, Film, Music, X } from "lucide-react";
import {
  DroppedFile,
  formatFileSize,
  getFileCategory,
  FileCategory,
} from "@/lib/file-utils";

interface FilePreviewListProps {
  files: DroppedFile[];
  onRemove: (id: string) => void;
  onView: (item: DroppedFile) => void;
  compact?: boolean;
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

function FilePreviewTile({
  item,
  previewUrl,
  onRemove,
  onView,
  compact = false,
}: {
  item: DroppedFile;
  previewUrl?: string;
  onRemove: (id: string) => void;
  onView: (item: DroppedFile) => void;
  compact?: boolean;
}) {
  const category = getFileCategory(item.file);
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
            onClick={() => onView(item)}
            title={`${item.file.name} (${formatFileSize(item.file.size)})`}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isImage && previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={item.file.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <FileTypeIcon
                category={category}
                className={compact ? "h-4 w-4" : "h-5 w-5"}
              />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
            className={[
              "absolute right-1 top-1 z-10 flex items-center justify-center rounded-full bg-foreground text-white shadow-md ring-1 ring-card",
              compact ? "h-4 w-4" : "h-5 w-5",
            ].join(" ")}
            aria-label={`Remove ${item.file.name}`}
          >
            <X className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} strokeWidth={2.5} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onView(item)}
          className="w-full border-t border-border-light px-1 py-0.5 text-left"
        >
          <p className="truncate text-[10px] font-medium leading-tight text-foreground">
            {item.file.name}
          </p>
          {!compact && (
            <p className="text-[7px] text-muted-light">
              {formatFileSize(item.file.size)}
            </p>
          )}
        </button>
      </div>
    </div>
  );
}

export function FilePreviewList({
  files,
  onRemove,
  onView,
  compact = false,
}: FilePreviewListProps) {
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(
    new Map()
  );

  useEffect(() => {
    const urls = new Map<string, string>();

    files.forEach((item) => {
      if (getFileCategory(item.file) === "image") {
        urls.set(item.id, URL.createObjectURL(item.file));
      }
    });

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

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
        {files.map((item) => (
          <FilePreviewTile
            key={item.id}
            item={item}
            previewUrl={previewUrls.get(item.id)}
            onRemove={onRemove}
            onView={onView}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}
