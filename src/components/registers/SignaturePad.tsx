"use client";

/**
 * Дъска за електронен подпис — потребителят рисува подписа си с мишка/пръст.
 * Връща PNG data URL, който после се вгражда автоматично в печатните карти.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { Eraser, Check, PenLine } from "lucide-react";

export default function SignaturePad({
  initial,
  onSave,
}: {
  initial?: string;
  onSave: (dataUrl: string | null) => void | Promise<void>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [saving, setSaving] = useState(false);

  // Инициализация на платното + зареждане на съществуващ подпис.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0A1F18";
    if (initial) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, cssW, cssH);
        setHasInk(true);
      };
      img.src = initial;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    drawing.current = true;
    last.current = pos(e);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !last.current) return;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    setHasInk(true);
  };

  const end = () => {
    drawing.current = false;
    last.current = null;
  };

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    setHasInk(false);
  }, []);

  const save = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaving(true);
    try {
      await onSave(hasInk ? canvas.toDataURL("image/png") : null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative rounded-2xl border-2 border-dashed border-brand-green/25 bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="w-full h-40 touch-none cursor-crosshair block"
        />
        {!hasInk && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-brand-dark/25 text-sm flex items-center gap-2">
              <PenLine className="h-4 w-4" /> Подпишете се тук
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={clear}
          className="text-[10px] font-black uppercase px-3.5 py-2 rounded-xl border border-brand-green/15 text-brand-dark/60 hover:border-brand-gold cursor-pointer flex items-center gap-1.5"
        >
          <Eraser className="h-3.5 w-3.5" /> Изчисти
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="text-[10px] font-black uppercase px-4 py-2 rounded-xl bg-brand-green text-white border-0 cursor-pointer flex items-center gap-1.5 shadow-md disabled:opacity-60"
        >
          <Check className="h-3.5 w-3.5" /> Запази подписа
        </button>
      </div>
    </div>
  );
}
