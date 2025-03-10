"use client";

import { LogOut } from "lucide-react"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    router.push("/"); // Redirect to login page
  };

  return (
    <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
