"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Copy, Trash2, FolderOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FilePreviewList } from "@/components/widgets/FilePreviewList";
import { FileViewerModal } from "@/components/widgets/FileViewerModal";
import { ShareFilePreviewList } from "@/components/widgets/ShareFilePreviewList";
import { RemoteFileViewerModal } from "@/components/widgets/RemoteFileViewerModal";
import { useAuth } from "@/contexts/AuthProvider";
import {
  pickPrimaryNearbyShare,
  useShareSession,
  type NearbyShare,
} from "@/contexts/ShareSessionProvider";
import type { ShareFile } from "@/lib/supabase/types";
import {
  createDroppedFile,
  DroppedFile,
  FILE_INPUT_ACCEPT,
} from "@/lib/file-utils";

export const CLIPBOARD_WIDTH =
  "w-full max-w-[min(100%,960px)] sm:max-w-[min(100%,1100px)] md:max-w-[min(100%,1200px)]";

type ContentSource = "idle" | "own" | "nearby";

interface SharedClipboardWidgetProps {
  className?: string;
}

export function SharedClipboardWidget({
  className = "",
}: SharedClipboardWidgetProps) {
  const { isGuest, maxRadiusKm } = useAuth();
  const {
    saving,
    saveMessage,
    saveError,
    saveShare,
    clearShare,
    myShare,
    nearbyShares,
  } = useShareSession();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<DroppedFile[]>([]);
  const [viewingFile, setViewingFile] = useState<DroppedFile | null>(null);
  const [viewingRemoteFile, setViewingRemoteFile] = useState<ShareFile | null>(
    null
  );
  const [contentSource, setContentSource] = useState<ContentSource>("idle");
  const [viewingNearby, setViewingNearby] = useState<NearbyShare | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hydratedFromSession = useRef(false);

  const primaryNearby = useMemo(
    () => pickPrimaryNearbyShare(nearbyShares),
    [nearbyShares]
  );

  const hasOwnShare =
    Boolean(myShare?.text_content.trim()) || (myShare?.files.length ?? 0) > 0;

  useEffect(() => {
    if (!myShare || hydratedFromSession.current) return;
    if (myShare.text_content) setText(myShare.text_content);
    if (myShare.text_content.trim() || myShare.files.length > 0) {
      setContentSource("own");
    }
    hydratedFromSession.current = true;
  }, [myShare]);

  useEffect(() => {
    if (contentSource === "own") return;

    if (hasOwnShare) {
      if (myShare?.text_content.trim()) {
        setText(myShare.text_content);
      } else {
        setText("");
      }
      setViewingNearby(null);
      setContentSource("own");
      return;
    }

    if (
      primaryNearby &&
      (primaryNearby.text_content.trim() || primaryNearby.files.length > 0)
    ) {
      setText(
        primaryNearby.text_content.trim() ? primaryNearby.text_content : ""
      );
      setViewingNearby(primaryNearby);
      setContentSource("nearby");
      return;
    }

    if (contentSource === "nearby") {
      setText("");
      setViewingNearby(null);
      setContentSource("idle");
    }
  }, [
    contentSource,
    hasOwnShare,
    myShare?.text_content,
    myShare?.files.length,
    primaryNearby?.id,
    primaryNearby?.text_content,
    primaryNearby?.files.length,
    primaryNearby?.updated_at,
  ]);

  useEffect(() => {
    if (contentSource !== "own") return;
    if (text.trim() || files.length > 0) return;
    if (!hasOwnShare) return;

    const timer = window.setTimeout(() => {
      void clearShare().then(() => {
        setContentSource("idle");
      });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [text, files, contentSource, hasOwnShare, clearShare]);

  useEffect(() => {
    if (
      contentSource === "own" &&
      !hasOwnShare &&
      !text.trim() &&
      files.length === 0
    ) {
      setContentSource("idle");
    }
  }, [contentSource, hasOwnShare, text, files]);

  const remoteFiles =
    contentSource === "nearby" && viewingNearby
      ? viewingNearby.files
      : contentSource === "own" && files.length === 0 && myShare
        ? myShare.files
        : [];

  const addFiles = (incoming: File[]) => {
    setContentSource("own");
    setViewingNearby(null);
    setFiles((prev) => [...prev, ...incoming.map(createDroppedFile)]);
  };

  const handleCopy = async () => {
    if (text) await navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    if (contentSource === "nearby") {
      setText("");
      setViewingNearby(null);
      setViewingRemoteFile(null);
      setContentSource("idle");
      return;
    }

    setText("");
    setFiles([]);
    setViewingFile(null);
    setViewingRemoteFile(null);
    setContentSource("idle");
    if (hasOwnShare) void clearShare();
  };

  const handleTextChange = (value: string) => {
    if (contentSource === "nearby") {
      setContentSource("own");
      setViewingNearby(null);
      setViewingRemoteFile(null);
    } else if (contentSource === "idle") {
      setContentSource("own");
    }
    setText(value);
  };

  const handleRemoveFile = (id: string) => {
    setContentSource("own");
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setViewingFile((current) => (current?.id === id ? null : current));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setContentSource("own");
    setViewingNearby(null);
    await saveShare({
      text,
      files: files.map((item) => item.file),
    });
  };

  const sourceLabel =
    contentSource === "nearby" && viewingNearby
      ? `From ${viewingNearby.displayName}${
          viewingNearby.distanceKm < 0.1
            ? " · very close"
            : ` · ${viewingNearby.distanceKm.toFixed(1)} KM`
        }`
      : contentSource === "own" && hasOwnShare
        ? "Your share is live nearby"
        : null;

  return (
    <>
      <div
        className={`mx-auto flex min-h-0 flex-col ${CLIPBOARD_WIDTH} ${className}`}
      >
        <Card
          padding="md"
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl p-4 shadow-md sm:rounded-2xl sm:p-6"
        >
          <div className="mb-2 flex shrink-0 items-center justify-between">
            <div className="flex flex-col">
              <span className="text-label-caps text-muted-light">
                SHARED CLIPBOARD
              </span>
              <span className="text-[10px] text-muted-light">
                {sourceLabel ??
                  (isGuest
                    ? `Guest mode · up to ${maxRadiusKm} KM`
                    : `Registered · up to ${maxRadiusKm} KM`)}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg p-1.5 text-muted-light transition-colors hover:bg-background hover:text-muted"
                aria-label="Clear clipboard"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg p-1.5 text-muted-light transition-colors hover:bg-background hover:text-muted"
                aria-label="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Type or paste text here to share instantly with nearby devices..."
            className="min-h-[220px] w-full flex-1 resize-none bg-transparent text-sm leading-5 text-foreground placeholder:text-muted-light outline-none sm:min-h-[clamp(100px,22vh,180px)]"
          />

          {files.length > 0 ? (
            <FilePreviewList
              files={files}
              onRemove={handleRemoveFile}
              onView={setViewingFile}
              compact
            />
          ) : (
            <ShareFilePreviewList
              files={remoteFiles}
              onView={setViewingRemoteFile}
              compact
            />
          )}
        </Card>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl border-2 border-dashed border-primary/50 bg-primary-light/40 px-3 py-3 transition-colors hover:border-primary hover:bg-primary-light/70 sm:mt-3 sm:justify-center sm:gap-3 sm:px-4"
        >
          <FolderOpen className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
          <div className="text-left">
            <span className="block text-sm font-semibold leading-tight text-primary">
              Drop files
            </span>
            <span className="text-xs text-primary/80">
              Images, PDF & more — or click to browse
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={FILE_INPUT_ACCEPT}
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {(saveMessage || saveError) && (
          <p
            className={[
              "mt-2 text-center text-xs",
              saveError ? "text-danger" : "text-success",
            ].join(" ")}
          >
            {saveError ?? saveMessage}
          </p>
        )}

        <Button
          variant="primary"
          fullWidth
          disabled={saving || (!text.trim() && files.length === 0)}
          onClick={handleSave}
          className="mt-2 h-11 shrink-0 rounded-full text-sm sm:mt-3 sm:h-12"
        >
          {saving ? "Sharing..." : "Share nearby"}
        </Button>
      </div>

      <FileViewerModal
        item={viewingFile}
        onClose={() => setViewingFile(null)}
      />

      <RemoteFileViewerModal
        file={viewingRemoteFile}
        onClose={() => setViewingRemoteFile(null)}
      />
    </>
  );
}
