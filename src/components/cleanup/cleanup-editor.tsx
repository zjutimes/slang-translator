"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Eraser, Undo, Redo, Download, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CleanupEditorProps {
  imageUrl: string;
  onUndo?: () => void;
  onRedo?: () => void;
  onReset?: () => void;
  onDownload?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  className?: string;
}

export function CleanupEditor({
  imageUrl,
  onUndo,
  onRedo,
  onReset,
  onDownload,
  canUndo,
  canRedo,
  className,
}: CleanupEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [brushHistory, setBrushHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize canvas with image
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !imageUrl) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Set canvas size to image natural size
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Calculate scale to fit container
      const container = containerRef.current;
      if (container) {
        const containerWidth = container.clientWidth - 48; // padding
        const containerHeight = container.clientHeight - 48;
        const scaleX = containerWidth / img.naturalWidth;
        const scaleY = containerHeight / img.naturalHeight;
        setZoom(Math.min(scaleX, scaleY, 1));
      }

      // Draw image
      ctx.drawImage(img, 0, 0);
      setIsLoaded(true);
      
      // Save initial state
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setBrushHistory([imageData]);
      setHistoryIndex(0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Get canvas coordinates from mouse event
  const getCanvasCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  // Draw eraser stroke
  const drawErase = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [brushSize]);

  // Save current state to history
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = brushHistory.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setBrushHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [brushHistory, historyIndex]);

  // Mouse event handlers
  const handlePointerDown = useCallback(
    (e: React.MouseEvent) => {
      const coords = getCanvasCoords(e);
      if (!coords) return;

      setIsDrawing(true);
      drawErase(coords.x, coords.y);
    },
    [getCanvasCoords, drawErase]
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing) return;
      const coords = getCanvasCoords(e);
      if (!coords) return;
      drawErase(coords.x, coords.y);
    },
    [isDrawing, getCanvasCoords, drawErase]
  );

  const handlePointerUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  }, [isDrawing, saveToHistory]);

  // Undo/Redo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const newIndex = historyIndex - 1;
      ctx.putImageData(brushHistory[newIndex], 0, 0);
      setHistoryIndex(newIndex);
      onUndo?.();
    }
  }, [historyIndex, brushHistory, onUndo]);

  const handleRedo = useCallback(() => {
    if (historyIndex < brushHistory.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const newIndex = historyIndex + 1;
      ctx.putImageData(brushHistory[newIndex], 0, 0);
      setHistoryIndex(newIndex);
      onRedo?.();
    }
  }, [historyIndex, brushHistory, onRedo]);

  // Reset
  const handleReset = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || brushHistory.length === 0) return;

    ctx.putImageData(brushHistory[0], 0, 0);
    setHistoryIndex(0);
    onReset?.();
  }, [brushHistory, onReset]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {/* Brush Size */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
            <Eraser className="w-4 h-4 text-muted-foreground" />
            <input
              type="range"
              min="5"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24 accent-primary"
            />
            <span className="text-xs text-muted-foreground w-8">{brushSize}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRedo}
            disabled={historyIndex >= brushHistory.length - 1}
          >
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom */}
          <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
            <ZoomIn className="w-4 h-4" />
          </Button>

          {/* Download */}
          <Button onClick={onDownload} className="gap-2 ml-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden flex items-center justify-center bg-[#1a1a1a] p-6"
      >
        <div
          className="relative shadow-2xl"
          style={{
            transform: `scale(${zoom})`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <canvas
            ref={canvasRef}
            className={cn(
              "max-w-full max-h-full cursor-crosshair",
              isDrawing ? "cursor-none" : "cursor-default"
            )}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
          />
          
          {/* Brush Preview */}
          {isDrawing && (
            <div
              className="absolute w-4 h-4 bg-white/50 rounded-full pointer-events-none"
              style={{
                transform: "translate(-50%, -50%)",
                width: brushSize,
                height: brushSize,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
