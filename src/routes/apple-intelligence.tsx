import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Apple, Folder, Lock } from "lucide-react";
import { getAllClaims, type StoredClaim } from "@/lib/claims.functions";

export const Route = createFileRoute("/apple-intelligence")({
  head: () => ({
    meta: [
      { title: "Apple Intelligence Folder" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AppleIntelligenceFolder,
});

function AppleIntelligenceFolder() {
  const fetchClaims = useServerFn(getAllClaims);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [claims, setClaims] = useState<StoredClaim[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onUnlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetchClaims({ data: { password } });
      if (!res.ok) {
        setError("Incorrect password.");
      } else {
        setUnlocked(true);
        setClaims(res.claims);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <Apple className="h-5 w-5" /> Apple Intelligence Folder
            </CardTitle>
            <CardDescription>Enter the folder password to view stored claim registrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUnlock} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pw">Password</Label>
                <Input
                  id="pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Unlocking…" : "Open Folder"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            <span className="font-medium">Apple Intelligence Folder</span>
          </div>
          <span className="text-sm text-muted-foreground">{claims.length} record{claims.length === 1 ? "" : "s"}</span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8 space-y-4">
        {claims.length === 0 && (
          <p className="text-sm text-muted-foreground">No claim submissions yet.</p>
        )}
        {claims.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="text-base">
                {c.first_name} {c.last_name}
              </CardTitle>
              <CardDescription>
                Submitted {new Date(c.created_at).toLocaleString()} • {c.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Contact</p>
                <p className="text-muted-foreground">{c.phone || "—"}</p>
                <p className="text-muted-foreground">
                  {c.address}, {c.city}, {c.state} {c.zip}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">Declarations</p>
                <p className="text-muted-foreground">Owned eligible device: {c.owned_device || "—"}</p>
                <p className="text-muted-foreground">Received notice: {c.received_notice || "—"}</p>
                <p className="text-muted-foreground">Signature: {c.signature || "—"}</p>
                <p className="text-muted-foreground">Withdrawal option: {c.withdrawal_option || "—"}</p>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <p className="font-medium text-foreground">Devices ({c.devices?.length ?? 0})</p>
                <ul className="space-y-1 text-muted-foreground">
                  {(c.devices ?? []).map((d, i) => (
                    <li key={i}>
                      • {d.model || "—"} — Serial/IMEI: {d.serial || "—"} — Purchased: {d.purchaseDate || "—"}
                    </li>
                  ))}
                </ul>
              </div>
              {c.notes && (
                <div className="sm:col-span-2 space-y-1">
                  <p className="font-medium text-foreground">Additional Comments</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{c.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}