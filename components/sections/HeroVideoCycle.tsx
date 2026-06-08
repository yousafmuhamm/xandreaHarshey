"use client";

/**
 * Lightweight hero background that cycles through multiple MP4s in sequence.
 * Uses two <video> elements so only one decodes at a time; the inactive element
 * is paused and its source cleared after each handoff to release decoder memory.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  videos: readonly string[];
  poster: string;
  onError?: () => void;
};

const PRELOAD_LEAD_SECONDS = 2.5;

export default function HeroVideoCycle({ videos, poster, onError }: Props) {
  const reducedMotion = useReducedMotion();
  const [activeSlot, setActiveSlot] = useState(0);
  const [failed, setFailed] = useState(false);

  const slotARef = useRef<HTMLVideoElement>(null);
  const slotBRef = useRef<HTMLVideoElement>(null);
  const slotRefs = useRef([slotARef, slotBRef]);

  const indexRef = useRef(0);
  const activeSlotRef = useRef(0);
  const visibleRef = useRef(true);
  const switchingRef = useRef(false);

  const nextIndex = useCallback(
    (current: number) => (current + 1) % videos.length,
    [videos.length],
  );

  const getSlot = useCallback((slot: number) => slotRefs.current[slot]?.current ?? null, []);

  const unloadVideo = useCallback((el: HTMLVideoElement | null) => {
    if (!el) return;
    el.pause();
    el.removeAttribute("src");
    el.load();
    delete el.dataset.loadedSrc;
  }, []);

  const loadVideo = useCallback(
    (el: HTMLVideoElement | null, src: string, preload: "none" | "metadata" | "auto") => {
      if (!el || el.dataset.loadedSrc === src) return;
      el.preload = preload;
      el.src = src;
      el.dataset.loadedSrc = src;
      el.load();
    },
    [],
  );

  const tryPlay = useCallback(async (el: HTMLVideoElement | null) => {
    if (!el || !visibleRef.current) return;
    el.muted = true;
    try {
      await el.play();
    } catch {
      // Autoplay can fail until the browser has enough buffered data.
    }
  }, []);

  const switchToNext = useCallback(() => {
    if (switchingRef.current || videos.length <= 1) return;
    switchingRef.current = true;

    const outgoingSlot = activeSlotRef.current;
    const incomingSlot = outgoingSlot === 0 ? 1 : 0;
    const incoming = getSlot(incomingSlot);
    const outgoing = getSlot(outgoingSlot);

    indexRef.current = nextIndex(indexRef.current);
    activeSlotRef.current = incomingSlot;
    setActiveSlot(incomingSlot);

    void tryPlay(incoming).finally(() => {
      unloadVideo(outgoing);
      const upcoming = videos[nextIndex(indexRef.current)];
      loadVideo(outgoing, upcoming, "metadata");
      switchingRef.current = false;
    });
  }, [getSlot, loadVideo, nextIndex, tryPlay, unloadVideo, videos]);

  useEffect(() => {
    if (reducedMotion || failed || videos.length === 0) return;

    indexRef.current = 0;
    activeSlotRef.current = 0;
    setActiveSlot(0);

    const first = getSlot(0);
    const second = getSlot(1);

    loadVideo(first, videos[0], "auto");
    if (videos.length > 1) {
      loadVideo(second, videos[1], "metadata");
    }

    void tryPlay(first);

    const onVisibility = (entries: IntersectionObserverEntry[]) => {
      const visible = entries[0]?.isIntersecting ?? true;
      visibleRef.current = visible;

      const active = getSlot(activeSlotRef.current);
      if (!active) return;

      if (visible) {
        void tryPlay(active);
      } else {
        active.pause();
      }
    };

    const observer = new IntersectionObserver(onVisibility, {
      root: null,
      threshold: 0.15,
    });

    const container = first?.parentElement;
    if (container) observer.observe(container);

    return () => {
      observer.disconnect();
      unloadVideo(first);
      unloadVideo(second);
    };
  }, [failed, getSlot, loadVideo, reducedMotion, tryPlay, unloadVideo, videos]);

  const handleTimeUpdate = useCallback(
    (slot: number) => {
      if (slot !== activeSlotRef.current || videos.length <= 1) return;

      const el = getSlot(slot);
      const nextSlot = slot === 0 ? 1 : 0;
      const nextEl = getSlot(nextSlot);
      if (!el || !nextEl || !Number.isFinite(el.duration)) return;

      const remaining = el.duration - el.currentTime;
      if (remaining > PRELOAD_LEAD_SECONDS) return;

      const upcoming = videos[nextIndex(indexRef.current)];
      loadVideo(nextEl, upcoming, "auto");
    },
    [getSlot, loadVideo, nextIndex, videos],
  );

  const handleEnded = useCallback(
    (slot: number) => {
      if (slot !== activeSlotRef.current) return;
      switchToNext();
    },
    [switchToNext],
  );

  const handleError = useCallback(() => {
    setFailed(true);
    onError?.();
  }, [onError]);

  if (reducedMotion || failed || videos.length === 0) return null;

  return (
    <>
      {slotRefs.current.map((ref, slot) => (
        <video
          key={slot}
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: slot === activeSlot ? 1 : 0 }}
          autoPlay={slot === 0}
          muted
          playsInline
          preload={slot === 0 ? "auto" : "metadata"}
          poster={poster}
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          onTimeUpdate={() => handleTimeUpdate(slot)}
          onEnded={() => handleEnded(slot)}
          onError={handleError}
        />
      ))}
    </>
  );
}
