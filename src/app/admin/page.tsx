import React from "react";
import type { Metadata } from "next";
import {
  getAdminSecurityInfo,
  isAuthenticatedAdmin,
  isUsingDefaultAdminPassword,
} from "@/lib/admin-auth";
import { listDemoEnquiries, listSubscriptions } from "@/lib/submissions";
import { getAllArticles } from "@/lib/blog";
import { getSiteSettings } from "@/lib/site-settings";
import {
  AdminDashboard,
  AdminLoginScreen,
} from "@/components/admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Website & Communications Admin Console",
  description:
    "Internal administration portal for reading demo enquiries, managing email subscribers, publishing blog articles, and configuring Plethora website settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const authenticated = await isAuthenticatedAdmin();
  const usingDefaultPassword = isUsingDefaultAdminPassword();

  if (!authenticated) {
    return <AdminLoginScreen usingDefaultPassword={usingDefaultPassword} />;
  }

  const demoEnquiries = listDemoEnquiries();
  const subscriptions = listSubscriptions();
  const articles = getAllArticles({ includeDrafts: true });
  const settings = getSiteSettings();
  const securityInfo = getAdminSecurityInfo();

  return (
    <AdminDashboard
      initialDemoEnquiries={demoEnquiries}
      initialSubscriptions={subscriptions}
      initialArticles={articles}
      initialSettings={settings}
      initialSecurityInfo={securityInfo}
      usingDefaultPassword={usingDefaultPassword}
    />
  );
}
