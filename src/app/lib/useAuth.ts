"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
/* eslint-disable */

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (email: string, password: string) => {
    // Admin login
    if (email === "imransir@gmail.com" && password === "123456") {
      const adminUser = { email, role: "admin", name: "Admin" };
      localStorage.setItem("user", JSON.stringify(adminUser));
      setUser(adminUser);
      router.push("/Portfolio_Handler");
      return;
    }

    // Normal college user login
    const collegeUser = { email, role: "college", name: "College User" };
    localStorage.setItem("user", JSON.stringify(collegeUser));
    setUser(collegeUser);
    alert("Thanks for registering! Our team will contact you soon.\nVisit: https://nesticktech.com or call +92 319 3236529");
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return { user, login, logout };
}
