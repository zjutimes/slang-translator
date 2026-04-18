"use client";

import { Upload, Image as ImageIcon, Eraser, Download, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CleanupHeaderProps {
  className?: string;
}

export function CleanupHeader({ className }: CleanupHeaderProps) {
  return (
    <header className={cn("w-full py-4 px-6 flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Eraser className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-foreground">cleanup.pictures</span>
      </div>
      <nav className="flex items-center gap-6">
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          How it works
        </a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Pricing
        </a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          API
        </a>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </nav>
    </header>
  );
}
