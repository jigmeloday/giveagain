import type { Metadata } from "next";
import { DashboardStats } from "@/components/admin/dashboard-stats";

export const metadata: Metadata = { title: "Dashboard | GiveAgain admin" };

export default function AdminDashboardPage() {
  return (
    <>
      <div className="border-b border-line p-6 sm:p-10">
        <h2 className="text-[clamp(32px,4vw,48px)]">Dashboard</h2>
      </div>
      <DashboardStats />
    </>
  );
}
