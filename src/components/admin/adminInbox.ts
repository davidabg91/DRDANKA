"use client";

/**
 * „Непрочетено“ в админ менюто — покупки (`purchases`) и оценки (`reviews`)
 * със `seenByAdmin: false`. Сървърът (покупки) и клиентът (оценки) ги пишат
 * като нови; админ панелът ги маркира видени, когато ги отвори.
 */

import { useEffect, useRef, useState } from "react";
import { collection, doc, onSnapshot, query, where, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type InboxCollection = "purchases" | "reviews";

/** Брой невидени записи — за баджа в менюто. */
export function useUnseenCount(name: InboxCollection, enabled: boolean): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    return onSnapshot(
      query(collection(db, name), where("seenByAdmin", "==", false)),
      (snap) => setCount(snap.size),
      () => setCount(0)
    );
  }, [name, enabled]);
  return enabled ? count : 0;
}

/**
 * При отваряне на панела: запомня кои записи са нови (за да светят, докато
 * панелът е отворен) и ги маркира видени в базата.
 */
export function useMarkSeenOnOpen(name: InboxCollection): Set<string> {
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const marked = useRef(new Set<string>());
  useEffect(() => {
    return onSnapshot(query(collection(db, name), where("seenByAdmin", "==", false)), (snap) => {
      const ids = snap.docs.map((d) => d.id).filter((id) => !marked.current.has(id));
      if (!ids.length) return;
      ids.forEach((id) => marked.current.add(id));
      setFresh((prev) => new Set([...prev, ...ids]));
      const batch = writeBatch(db);
      ids.forEach((id) => batch.update(doc(db, name, id), { seenByAdmin: true }));
      batch.commit().catch(() => ids.forEach((id) => marked.current.delete(id)));
    });
  }, [name]);
  return fresh;
}

export function formatDateTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("bg-BG", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
