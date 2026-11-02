import type { Metadata } from "next";
import { ProfileForm } from "@/components/account/profile-form";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Your profile | GiveAgain" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return null;

  return <ProfileForm user={session.user} />;
}
