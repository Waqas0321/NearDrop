"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Trash2, FolderOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FilePreviewList } from "@/components/widgets/FilePreviewList";
import { FileViewerModal } from "@/components/widgets/FileViewerModal";
import { ShareFilePreviewList } from "@/components/widgets/ShareFilePreviewList";
import { RemoteFileViewerModal } from "@/components/widgets/RemoteFileViewerModal";
import { useAuth } from "@/contexts/AuthProvider";
import { useShareSession } from "@/contexts/ShareSessionProvider";
import type { ShareFile } from "@/lib/supabase/types";
import {
  createDroppedFile,
  DroppedFile,
  FILE_INPUT_ACCEPT,
} from "@/lib/file-utils";

export const CLIPBOARD_WIDTH =
  "w-full max-w-[min(100%,960px)] sm:max-w-[min(100%,1100px)] md:max-w-[min(100%,1200px)]";

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
  } = useShareSession();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<DroppedFile[]>([]);
  const [viewingFile, setViewingFile] = useState<DroppedFile | null>(null);
  const [viewingRemoteFile, setViewingRemoteFile] = useState<ShareFile | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hydratedFromSession = useRef(false);

  const hasOwnShare =
    Boolean(myShare?.text_content.trim()) || (myShare?.files.length ?? 0) > 0;

  useEffect(() => {
    if (!myShare || hydratedFromSession.current) return;
    if (myShare.text_content) setText(myShare.text_content);
    hydratedFromSession.current = true;
  }, [myShare]);

  useEffect(() => {
    if (text.trim() || files.length > 0) return;
    if (!hasOwnShare) return;

    const timer = window.setTimeout(() => {
      void clearShare();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [text, files, hasOwnShare, clearShare]);

  const ownRemoteFiles =
    files.length === 0 && myShare ? myShare.files : [];

  const addFiles = (incoming: File[]) => {
    setFiles((prev) => [...prev, ...incoming.map(createDroppedFile)]);
  };

  const handleCopy = async () => {
    if (text) await navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setText("");
    setFiles([]);
    setViewingFile(null);
    setViewingRemoteFile(null);
    if (hasOwnShare) void clearShare();
  };

  const handleRemoveFile = (id: string) => {
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
    await saveShare({
      text,
      files: files.map((item) => item.file),
    });
  };

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
                YOUR SHARE
              </span>
              <span className="text-[10px] text-muted-light">
                {hasOwnShare
                  ? "Your share is live nearby"
                  : isGuest
                    ? `Guest mode · up to ${maxRadiusKm} KM`
                    : `Registered · up to ${maxRadiusKm} KM`}
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
            onChange={(e) => setText(e.target.value)}
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
              files={ownRemoteFiles}
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
