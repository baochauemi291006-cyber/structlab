"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BookOpen, FlaskConical, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { href: "/#roadmap", label: "Lộ trình", icon: BookOpen },
  { href: "/visualizer", label: "Mô phỏng", icon: FlaskConical },
  { href: "/practice", label: "Luyện tập", icon: BarChart3 },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <span>[</span>
            <i />
            <span>]</span>
          </span>
          <span>StructLab</span>
        </Link>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Điều hướng chính">
          <div className="nav-links">
            {links.map(({ href, label, icon: Icon }) => {
              const baseHref = href.split("#")[0] || "/";
              const active = baseHref !== "/" && pathname.startsWith(baseHref);
              return (
                <Link
                  key={href}
                  href={href}
                  className={active ? "active" : ""}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={17} />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="nav-actions">
            {!loading && user ? (
              <>
                <Link href="/dashboard" className="user-chip" onClick={() => setOpen(false)}>
                  <span>{user.displayName.charAt(0).toUpperCase()}</span>
                  {user.displayName}
                </Link>
                <button type="button" className="button button-ghost button-small" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              !loading && (
                <>
                  <Link href="/login" className="button button-ghost button-small" onClick={() => setOpen(false)}>
                    Đăng nhập
                  </Link>
                  <Link href="/register" className="button button-primary button-small" onClick={() => setOpen(false)}>
                    Tạo tài khoản
                  </Link>
                </>
              )
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
