import { AuthProvider } from "@/contexts/AuthContext";
import React from "react";
import MainApp from "./MainApp";
export default function HomeScreen() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}