"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

// Phase 2 stand-in: the gradient Backdrop is the scene for now.
export default function Scene() {
  useEffect(() => {
    useStore.getState().setLoaded(true);
  }, []);
  return null;
}
