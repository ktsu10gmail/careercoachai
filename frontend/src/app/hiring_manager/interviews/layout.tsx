import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hiring Manager Interview Dashboard",
  description:
    "Review pre-vetted candidate dossiers, resume match evidence, pre-screening notes, and submit hiring-manager recommendations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HiringManagerInterviewsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

