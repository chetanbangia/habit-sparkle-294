import { supabase } from "@/integrations/supabase/client";

export interface PlanFeatures {
  interests_per_day: number; // -1 = unlimited
  chat: boolean;
  contact: boolean;
  full_photos: boolean;
  priority?: boolean;
}

export interface ActiveMembership {
  planCode: string;
  planName: string;
  expiresAt: string;
  features: PlanFeatures;
}

const FREE: ActiveMembership = {
  planCode: "free",
  planName: "Free",
  expiresAt: new Date(8640000000000000).toISOString(),
  features: { interests_per_day: 3, chat: false, contact: false, full_photos: false },
};

export async function getActiveMembership(userId: string): Promise<ActiveMembership> {
  const { data } = await supabase
    .from("memberships")
    .select("plan_code, expires_at, status, plans(name, features)")
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .eq("status", "active")
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return FREE;
  const plan = data.plans as unknown as { name: string; features: PlanFeatures } | null;
  return {
    planCode: data.plan_code,
    planName: plan?.name ?? data.plan_code,
    expiresAt: data.expires_at,
    features: plan?.features ?? FREE.features,
  };
}

export function formatINR(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
