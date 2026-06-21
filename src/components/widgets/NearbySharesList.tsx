"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useShareSession } from "@/contexts/ShareSessionProvider";
import { RemoteShareFiles } from "@/components/widgets/RemoteShareFiles";
import { CLIPBOARD_WIDTH } from "@/components/widgets/SharedClipboardWidget";

export function NearbySharesList() {
  const { nearbyShares, searching } = useShareSession();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (searching || nearbyShares.length === 0) return null;

  const handleCopyText = async (sessionId: string, text: string) => {
    if (!text.trim()) return;
    await navigator.clipboard.writeText(text);
    setCopiedId(sessionId);
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`mx-auto mt-4 ${CLIPBOARD_WIDTH}`}>
      <p className="mb-2 text-center text-label-caps text-muted-light">
        Nearby shares
      </p>
      <div className="flex flex-col gap-3">
        {nearbyShares.map((share) => (
          <Card key={share.id} padding="md" className="rounded-xl p-4 shadow-sm">
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
              {share.text_content.trim() && (
                <button
                  type="button"
                  onClick={() => void handleCopyText(share.id, share.text_content)}
                  className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs text-primary transition-colors hover:bg-primary-light/50"
                >
                  {copiedId === share.id ? (
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

            {share.text_content.trim() && (
              <p className="whitespace-pre-wrap break-words text-sm leading-5 text-foreground/90">
                {share.text_content}
              </p>
            )}

            <RemoteShareFiles files={share.files} />
          </Card>
        ))}
      </div>
    </div>
  );
}
