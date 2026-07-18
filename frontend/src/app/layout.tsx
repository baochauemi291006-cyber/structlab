import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StructLab | Học cấu trúc dữ liệu tương tác",
    template: "%s | StructLab",
  },
  description: "Học Array, Stack và Queue bằng bài học ngắn, mô phỏng từng bước và quiz dự đoán.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
