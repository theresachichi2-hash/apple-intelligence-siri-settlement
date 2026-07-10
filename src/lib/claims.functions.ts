import { createServerFn } from "@tanstack/react-start";

export type ClaimDevice = { model: string; serial: string; purchaseDate: string };

export type ClaimSubmissionInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  devices: ClaimDevice[];
  ownedDevice: string;
  receivedNotice: string;
  signature: string;
  notes: string;
  withdrawalOption: string;
};

export const submitClaim = createServerFn({ method: "POST" })
  .inputValidator((data: ClaimSubmissionInput) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("claim_submissions").insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      devices: data.devices,
      owned_device: data.ownedDevice,
      received_notice: data.receivedNotice,
      signature: data.signature,
      notes: data.notes,
      withdrawal_option: data.withdrawalOption,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export type StoredClaim = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  devices: ClaimDevice[];
  owned_device: string | null;
  received_notice: string | null;
  signature: string | null;
  notes: string | null;
  withdrawal_option: string | null;
  created_at: string;
};

export const getAllClaims = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }): Promise<{ ok: true; claims: StoredClaim[] } | { ok: false }> => {
    const expected = process.env.APPLE_INTELLIGENCE_PASSWORD;
    if (!expected || data.password !== expected) return { ok: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("claim_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { ok: true, claims: (rows ?? []) as StoredClaim[] };
  });