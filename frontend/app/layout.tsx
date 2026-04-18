import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { ProfileProvider } from "@/lib/profile-context";
import { SavedPortfolioProvider } from "@/lib/saved-portfolio-context";
import { SavedItemsProvider } from "@/lib/saved-items-context";
import { MessagingProvider } from "@/lib/messaging-context";
import { NotificationProvider } from "@/lib/notification-context";
import { UserPostsProvider } from "@/lib/user-posts-context";
import { ToastProvider } from "@/components/ui/toast";
import { BanGuard } from "@/components/auth/ban-guard";
import { iCielCadena, iCielCroncante, iCielShowcase } from "./fonts";
import "./globals.css";
import "./about.css";
import { MainLayoutWrapper } from "@/components/layout/main-layout-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextStepZ - Your first step to the future.",
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${iCielCadena.variable} ${iCielCroncante.variable} ${iCielShowcase.variable} antialiased`}
      >
        <AuthProvider>
          <SavedItemsProvider>
            <MessagingProvider>
              <NotificationProvider>
                <BanGuard>
                  <ProfileProvider>
                    <SavedPortfolioProvider>
                      <UserPostsProvider>
                        <ToastProvider>
                          <MainLayoutWrapper>
                            {children}
                          </MainLayoutWrapper>
                        </ToastProvider>
                      </UserPostsProvider>
                    </SavedPortfolioProvider>
                  </ProfileProvider>
                </BanGuard>
              </NotificationProvider>
            </MessagingProvider>
          </SavedItemsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
