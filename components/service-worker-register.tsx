"use client";
import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/service-worker.js");
      });
    }
  }, []);
  return null;
}
