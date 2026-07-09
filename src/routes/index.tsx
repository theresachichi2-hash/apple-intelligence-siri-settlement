import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Scale,
  Calendar,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Shield,
  ChevronRight,
  AlertCircle,
  Apple,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Apple Intelligence & Siri Settlement — File Your Claim" },
      { name: "description", content: "Welcome to the official Apple Intelligence & Siri Settlement (2026) claim portal. Check your eligibility and file your claim today." },
      { property: "og:title", content: "Apple Intelligence & Siri Settlement — File Your Claim" },
      { property: "og:description", content: "Welcome to the official Apple Intelligence & Siri Settlement (2026) claim portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-card">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Apple className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Apple Intelligence & Siri Settlement
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              Case No. 5:24-cv-01258 · United States District Court, N.D. California
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="min-w-[200px] text-base">
                File Your Claim
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="min-w-[200px] text-base">
                Check Eligibility
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Deadline to file: October 15, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Key Dates Bar */}
      <section className="border-b bg-card/50">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Claim Deadline</p>
                <p className="text-sm font-semibold text-foreground">October 15, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Settlement Amount</p>
                <p className="text-sm font-semibold text-foreground">$95,000,000</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Final Approval Hearing</p>
                <p className="text-sm font-semibold text-foreground">December 3, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Column — Info */}
          <div className="lg:col-span-2 space-y-10">
            {/* About the Settlement */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">About This Settlement</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                This settlement resolves claims that Apple Inc. recorded, retained, and shared Siri audio interactions
                without adequate user consent or disclosure between 2014 and 2024. Apple denies any wrongdoing.
                The Court has not decided who is right.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Under the settlement, Apple has agreed to pay $95 million to establish a fund for eligible class members,
                as well as to implement enhanced disclosures and user controls for voice assistant privacy.
              </p>
            </section>

            <Separator />

            {/* Who is Eligible */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Who Is Eligible?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                If you purchased an eligible iPhone model (iPhone X through iPhone 17 Pro Max) between June 10, 2024, and March 29, 2026, you may qualify to submit a claim, subject to the final approval of the settlement by the court.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                You may be eligible if you are a person in the United States who, between October 1, 2014 and
                December 31, 2024, owned or used an Apple device with Siri enabled and whose voice interactions
                may have been inadvertently triggered or recorded.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Owned an iPhone, iPad, Apple Watch, Mac, HomePod, or Apple TV with Siri",
                  "Had Siri enabled at any time during the eligibility period",
                  "Experienced unintended Siri activations (e.g., accidental trigger recordings)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Estimated Compensation */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Estimated Compensation</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Eligible claimants may receive between $980 and $12,000 per eligible device, depending on the total number of approved claims and the final terms approved by the court.
              </p>
            </section>

            <Separator />

            {/* Payment Estimates */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">How Much Could I Receive?</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Standard Claim</CardTitle>
                    <CardDescription>One device / one claim</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold text-foreground">Up to $20</p>
                    <p className="mt-1 text-xs text-muted-foreground">Per eligible device, up to 5 devices</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Documented Claim</CardTitle>
                    <CardDescription>With supporting documentation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold text-foreground">Up to $100</p>
                    <p className="mt-1 text-xs text-muted-foreground">Per device, up to 5 devices</p>
                  </CardContent>
                </Card>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Actual payment amounts will depend on the number of valid claims filed and may be adjusted
                proportionally. Payments will be made after the Court grants final approval and any appeals are resolved.
              </p>
            </section>

            <Separator />

            {/* Payment Process */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Payment Process
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                After a claim is reviewed and approved, settlement funds will be processed in accordance with the court-approved payment procedures. Once the funds have been transferred to the claimant's designated wallet address, they may be accessed through the linked wallet account, subject to the settlement's final approval and distribution schedule.
              </p>
            </section>

            <Separator />

            {/* Timeline */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Important Dates</h2>
              <div className="mt-4 space-y-0">
                {[
                  { date: "January 15, 2026", label: "Notice Period Begins", status: "completed" },
                  { date: "March 1, 2026", label: "Claim Filing Opens", status: "completed" },
                  { date: "October 15, 2026", label: "Claim Filing Deadline", status: "upcoming" },
                  { date: "December 3, 2026", label: "Final Approval Hearing", status: "upcoming" },
                ].map((event, i, arr) => (
                  <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-3 w-3 rounded-full",
                          event.status === "completed" ? "bg-primary" : "border-2 border-primary bg-background"
                        )}
                      />
                      {i < arr.length - 1 && <div className="mt-1 h-full w-px bg-border" />}
                    </div>
                    <div className="-mt-1">
                      <p className="text-sm font-medium text-foreground">{event.label}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column — CTA & Docs */}
          <div className="space-y-6">
            <Card className="border-2 border-primary/20 bg-primary/[0.02]">
              <CardHeader>
                <CardTitle className="text-base">Ready to File?</CardTitle>
                <CardDescription>
                  Have your Apple ID and device information ready. Most claims take under 5 minutes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">Start Your Claim</Button>
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  File for Family Members
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Settlement Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Long Form Settlement Agreement",
                  "Notice of Class Action Settlement",
                  "Exclusion & Objection Form",
                  "Proof of Claim Form",
                  "FAQ",
                ].map((doc, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    {doc}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Settlement Administrator</strong>
                  <br />
                  Siri Settlement Administrator
                  <br />
                  P.O. Box 1234, San Francisco, CA 94102
                </p>
                <p>
                  <strong className="text-foreground">Call</strong>
                  <br />
                  1-800-555-0199 (toll-free)
                </p>
                <p>
                  <strong className="text-foreground">Email</strong>
                  <br />
                  info@siri-settlement.com
                </p>
              </CardContent>
            </Card>

            <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div>
                <p className="text-xs font-medium text-foreground">Important Legal Notice</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  This is a summary of the proposed settlement. For complete terms, please review the
                  Long Form Settlement Agreement and court filings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-muted-foreground">
              &copy; 2026 Siri Settlement Administrator. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-foreground transition-colors">Court Documents</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
