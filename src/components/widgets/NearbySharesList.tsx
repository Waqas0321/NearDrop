"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  sortNearbyShares,
  useShareSession,
  type NearbyShare,
} from "@/contexts/ShareSessionProvider";
import { ShareFilePreviewList } from "@/components/widgets/ShareFilePreviewList";
import { RemoteFileViewerModal } from "@/components/widgets/RemoteFileViewerModal";
import { CLIPBOARD_WIDTH } from "@/components/widgets/SharedClipboardWidget";
import type { ShareFile } from "@/lib/supabase/types";

function NearbyShareCard({
  share,
  copied,
  onCopyText,
  onViewFile,
}: {
  share: NearbyShare;
  copied: boolean;
  onCopyText: (text: string) => void;
  onViewFile: (file: ShareFile) => void;
}) {
  const hasText = Boolean(share.text_content.trim());
  const hasFiles = share.files.length > 0;

  return (
    <Card padding="md" className="rounded-xl p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {share.displayName}
          </p>
          <p className="text-[10px] text-muted-light">
            {share.distanceKm < 0.1
              ? "Very close"
              : `${share.distanceKm.toFixed(1)} KM away`}
          </p>
        </div>
        {hasText && (
          <button
            type="button"
            onClick={() => onCopyText(share.text_content)}
            className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs text-primary transition-colors hover:bg-primary-light/50"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy text
              </>
            )}
          </button>
        )}
      </div>

      {hasText && (
        <textarea
          readOnly
          value={share.text_content}
          className="mb-2 min-h-[80px] w-full resize-none rounded-lg border border-border-light bg-background/50 px-3 py-2 text-sm leading-5 text-foreground outline-none"
        />
      )}

      {hasFiles && (
        <ShareFilePreviewList
          files={share.files}
          onView={onViewFile}
          compact
        />
      )}
    </Card>
  );
}

export function NearbySharesList() {
  const { nearbyShares, searching } = useShareSession();
  const [viewingFile, setViewingFile] = useState<ShareFile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visibleShares = useMemo(
    () => sortNearbyShares(nearbyShares),
    [nearbyShares]
  );

  if (searching || visibleShares.length === 0) return null;

  const handleCopyText = async (sessionId: string, text: string) => {
    if (!text.trim()) return;
    await navigator.clipboard.writeText(text);
    setCopiedId(sessionId);
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <div className={`mx-auto mt-4 ${CLIPBOARD_WIDTH}`}>
        <p className="mb-2 text-center text-label-caps text-muted-light">
          Nearby shares ({visibleShares.length})
        </p>
        <div className="flex flex-col gap-3">
          {visibleShares.map((share) => (
            <NearbyShareCard
              key={share.id}
              share={share}
              copied={copiedId === share.id}
              onCopyText={(text) => void handleCopyText(share.id, text)}
              onViewFile={setViewingFile}
            />
          ))}
        </div>
      </div>

      <RemoteFileViewerModal
        file={viewingFile}
        onClose={() => setViewingFile(null)}
      />
    </>
  );
}
