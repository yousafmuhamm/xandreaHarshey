"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect that silently falls back to useEffect on the server,
 * avoiding the React SSR warning while keeping pre-paint setup on the client
 * (so GSAP can set initial states before first paint).
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
