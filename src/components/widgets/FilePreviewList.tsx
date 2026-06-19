"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
}: {
  item: DroppedFile;
  previewUrl?: string;
  onRemove: (id: string) => void;
  onView: (item: DroppedFile) => void;
}) {
  const category = getFileCategory(item.file);
  const isImage = category === "image";

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => onView(item)}
        className="flex w-full flex-col overflow-hidden rounded-lg border border-border-light bg-background text-left transition-all hover:border-primary/40 hover:shadow-sm"
      >
        <div className="relative flex h-20 items-center justify-center overflow-hidden bg-surface-muted">
          {isImage && previewUrl ? (
            <Image
              src={previewUrl}
              alt={item.file.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              unoptimized
            />
          ) : (
            <FileTypeIcon category={category} />
          )}
        </div>
        <div className="border-t border-border-light px-2 py-1.5">
          <p className="truncate text-[11px] font-medium text-foreground">
            {item.file.name}
          </p>
          <p className="text-[9px] text-muted-light">
            {formatFileSize(item.file.size)}
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-white opacity-100 shadow-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
        aria-label={`Remove ${item.file.name}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
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
        compact ? "mt-2 max-h-24 overflow-y-auto pt-2" : "mt-4 pt-4",
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
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {files.map((item) => (
          <FilePreviewTile
            key={item.id}
            item={item}
            previewUrl={previewUrls.get(item.id)}
            onRemove={onRemove}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
}
