import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Apple, Check, ChevronLeft, ShieldCheck } from "lucide-react";

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
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Claim Submitted</CardTitle>
              <CardDescription>
                Thank you. Your claim for <strong className="text-foreground">{selectedAmount}</strong> has been received and will be reviewed by the Settlement Administrator.
                You will receive a confirmation email shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/"><Button variant="outline">Return Home</Button></Link>
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
                  {AMOUNTS.map((amount) => (
                    <div key={amount} className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value={amount} id={amount} className="shrink-0" />
                      <Label htmlFor={amount} className="flex-1 cursor-pointer text-base font-semibold text-foreground">
                        {amount}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

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
