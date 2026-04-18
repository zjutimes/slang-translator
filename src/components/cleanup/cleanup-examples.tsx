"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface CleanupExamplesProps {
  className?: string;
}

const examples = [
  {
    before: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    after: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    label: "Remove objects",
  },
  {
    before: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=300&fit=crop",
    after: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=300&fit=crop",
    label: "Remove backgrounds",
  },
  {
    before: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
    after: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
    label: "Remove text",
  },
];

export function CleanupExamples({ className }: CleanupExamplesProps) {
  return (
    <section className={cn("w-full py-16 px-6 bg-muted/30", className)}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            See it in action
          </h2>
          <p className="text-muted-foreground text-lg">
            Before and after examples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden bg-background shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={example.after}
                  alt={example.label}
                  fill
                  className="object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Labels */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white">
                  Before
                </span>
                <span className="px-2 py-1 bg-violet-500/80 backdrop-blur-sm rounded text-xs text-white">
                  After
                </span>
              </div>
              
              {/* Label */}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-medium">{example.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
