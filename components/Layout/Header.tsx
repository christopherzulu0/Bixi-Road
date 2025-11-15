'use client'

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  LayoutDashboard,
  Shield,
  Newspaper,
  User,
  Menu,
  X,
  LogOut,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, useClerk, useUser, UserButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  type HeaderUserProfile = {
    role: string;
    isVerifiedMiner: boolean;
    verificationStatus?: string | null;
    loading: boolean;
  };

  const [profile, setProfile] = useState<HeaderUserProfile>({
    role: "buyer",
    isVerifiedMiner: false,
    verificationStatus: undefined,
    loading: false,
  });

  // Prevent hydration mismatch by only rendering pathname-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setProfile({
        role: "buyer",
        isVerifiedMiner: false,
        verificationStatus: undefined,
        loading: false,
      });
      return;
    }

    let cancelled = false;
    setProfile((prev) => ({
      ...prev,
      loading: true,
    }));

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/users/me", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load user profile");
        }
        const data = await response.json();

        if (!cancelled) {
          setProfile({
            role:
              typeof data.role === "string"
                ? data.role.toLowerCase()
                : "buyer",
            isVerifiedMiner: Boolean(data.isVerifiedMiner),
            verificationStatus:
              typeof data.verificationStatus === "string"
                ? data.verificationStatus
                : undefined,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Failed to load user profile", error);
        if (!cancelled) {
          setProfile({
            role: "buyer",
            isVerifiedMiner: false,
            verificationStatus: undefined,
            loading: false,
          });
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [mounted, isLoaded, isSignedIn]);

  const role = profile.role;
  const isVerifiedMiner = profile.isVerifiedMiner;
  const verificationStatus = profile.verificationStatus;

  const ready = mounted && isLoaded;

  const getDashboardUrl = () => {
    if (!isSignedIn) return "/";
    const normalizedRole = (role ?? "").toLowerCase();
    if (normalizedRole === "admin") return "/AdminDashboard";
    if (isVerifiedMiner) return "/MinerDashboard";
    return "/BuyerDashboard";
  };

  const navItems = useMemo(() => {
    const items = [
      { name: "Marketplace", path: "/MarketPlace", icon: ShoppingBag },
      { name: "Market News", path: "/News", icon: Newspaper },
      { name: "How It Works", path: "/HowItWorks", icon: Info },
    ];

    if (isSignedIn && ready) {
      const normalizedRole = (role ?? "").toLowerCase();
      items.push({
        name: normalizedRole === "admin" ? "Admin" : "Dashboard",
        path: getDashboardUrl(),
        icon: LayoutDashboard,
      });

      if (!isVerifiedMiner && normalizedRole !== "admin" && verificationStatus !== "pending") {
        items.push({
          name: "Become a Seller",
          path: "/BecomeSeller",
          icon: Shield,
        });
      }
    }

    return items;
  }, [isSignedIn, role, isVerifiedMiner, verificationStatus, ready]);

  const displayName =
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Account";

  return (
    <header className="bg-[#1A1A1A] border-b border-[#D4AF37]/20 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20 gap-2 md:gap-4">
            {/* Logo - Responsive sizing */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">B</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold text-[#FFFFF0] tracking-tight">BixiRoad</h1>
                <p className="text-xs text-[#D4AF37] font-medium">Africa's Trade Highway</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-[#FFFFF0] tracking-tight">Bixi</h1>
              </div>
            </Link>

            {/* Desktop Navigation - Show on md+ screens (optimized for 1366x768) */}
            <nav 
              className="desktop-nav hidden md:flex items-center gap-2 mx-4" 
              aria-label="Desktop navigation"
            >
            {navItems && navItems.length > 0 ? (
              navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-base transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-[#D4AF37] text-[#1A1A1A]"
                        : "text-[#FFFFF0] hover:bg-[#3E2723] hover:text-[#D4AF37]"
                    }`}
                  >
                    <item.icon 
                      className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#1A1A1A]" : "text-[#FFFFF0]"}`}
                    />
                    <span className={isActive ? "text-[#1A1A1A]" : "text-[#FFFFF0]"}>{item.name}</span>
                  </Link>
                );
              })
            ) : (
              <div className="text-[#FFFFF0] text-sm">Loading...</div>
            )}
          </nav>

          {/* User Menu - Show on md+ screens (optimized for 1366x768) */}
          <div className="desktop-user-menu hidden md:flex items-center gap-3 flex-shrink-0 z-10">
            {ready && isSignedIn ? (
              <div className="flex items-center gap-2 lg:gap-3">
                {isVerifiedMiner && (
                  <div className="hidden lg:flex px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37] rounded-full">
                    <span className="text-xs font-semibold text-[#D4AF37] whitespace-nowrap">✓ CERTIFIED MINER</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 xl:px-4 py-2 bg-[#3E2723] rounded-lg border border-[#D4AF37]/20">
                  <User className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span className="text-xs lg:text-sm font-medium text-[#FFFFF0] truncate max-w-[100px] xl:max-w-[150px]">
                    {displayName}
                  </span>
                </div>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-7 h-7 lg:w-8 lg:h-8",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex gap-2">
                {ready ? (
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A1A] text-xs lg:text-sm px-3 lg:px-4"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                ) : (
                  <div className="px-3 lg:px-4 py-2 bg-[#3E2723] rounded-lg border border-[#D4AF37]/20 text-transparent">
                    Sign In
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Show on screens smaller than md */}
          <button
            className="md:hidden text-[#FFFFF0] hover:text-[#D4AF37] transition-colors p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Responsive drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#3E2723] border-t border-[#D4AF37]/20 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-1 sm:space-y-2">
            {ready ? (
              <>
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg flex items-center gap-3 font-medium text-sm sm:text-base transition-all ${
                        isActive
                          ? "bg-[#D4AF37] text-[#1A1A1A]"
                          : "text-[#FFFFF0] hover:bg-[#1A1A1A]"
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                <div className="border-t border-[#D4AF37]/20 mt-2 sm:mt-3 pt-2 sm:pt-3">
                  {isSignedIn && ready ? (
                    <>
                      {isVerifiedMiner && (
                        <div className="px-3 sm:px-4 py-2 sm:py-2.5 mb-2 bg-[#D4AF37]/10 border border-[#D4AF37] rounded-lg">
                          <span className="text-xs sm:text-sm font-semibold text-[#D4AF37]">✓ CERTIFIED MINER</span>
                        </div>
                      )}
                      <div className="px-3 sm:px-4 py-2 sm:py-2.5 mb-2 flex items-center gap-2 bg-[#1A1A1A] rounded-lg border border-[#D4AF37]/20">
                        <User className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                        <span className="text-sm sm:text-base font-medium text-[#FFFFF0] truncate">{displayName}</span>
                      </div>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          signOut({ redirectUrl: "/" });
                        }}
                        className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg flex items-center gap-3 font-medium text-sm sm:text-base text-[#FFFFF0] hover:bg-[#1A1A1A] transition-colors"
                      >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        Sign Out
                      </button>
                    </>
                  ) : ready ? (
                    <SignInButton mode="modal">
                      <Button
                        variant="outline"
                        className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A1A] text-sm sm:text-base py-2.5 sm:py-3"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="space-y-2">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="px-4 py-3 rounded-lg bg-[#1A1A1A] text-transparent">
                    Loading...
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

