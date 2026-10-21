"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logoutAction } from "@/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Package, ShieldCheck, ChevronDown, UserCheck } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type ProfileData = {
  fullName: string | null;
  role: string;
};

export function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // 1. Initial user check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setProfile({
                fullName: data.full_name,
                role: data.role || "customer",
              });
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    // 2. Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", currentUser.id)
          .single();
        if (data) {
          setProfile({
            fullName: data.full_name,
            role: data.role || "customer",
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <div className="size-8 rounded-full bg-muted/60 animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "h-9 px-3 font-medium text-xs sm:text-sm",
          })}
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className={buttonVariants({
            size: "sm",
            className: "h-9 px-3.5 font-medium text-xs sm:text-sm shadow-sm",
          })}
        >
          Daftar
        </Link>
      </div>
    );
  }

  const displayName =
    profile?.fullName || user.user_metadata?.full_name || user.email?.split("@")[0] || "Pengguna";
  const initial = displayName.charAt(0).toUpperCase();
  const isAdmin = profile?.role === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-muted/70 transition border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Menu Pengguna"
          >
            <div className="size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-xs">
              {initial}
            </div>
            <span className="hidden lg:inline text-xs font-medium max-w-[100px] truncate text-foreground">
              {displayName}
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground mr-1" />
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56 p-1.5">
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between gap-1">
              <p className="text-sm font-semibold leading-none text-foreground truncate">
                {displayName}
              </p>
              {isAdmin ? (
                <Badge className="text-[10px] h-4.5 px-1.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
                  Admin
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 text-muted-foreground">
                  Member
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => router.push("/admin")}
              className="cursor-pointer text-amber-600 dark:text-amber-400 font-medium"
            >
              <ShieldCheck className="size-4 mr-2" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => router.push("/account/orders")}
            className="cursor-pointer"
          >
            <Package className="size-4 mr-2 text-muted-foreground" />
            <span>Pesanan Saya</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/account/profile")}
            className="cursor-pointer"
          >
            <UserCheck className="size-4 mr-2 text-muted-foreground" />
            <span>Profil Akun</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <form action={logoutAction}>
          <DropdownMenuItem
            render={
              <button
                type="submit"
                className="w-full flex items-center text-destructive cursor-pointer"
              >
                <LogOut className="size-4 mr-2" />
                <span>Keluar</span>
              </button>
            }
          />
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
