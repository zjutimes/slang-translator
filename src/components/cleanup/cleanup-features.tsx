"use client";

import { Sparkles, Zap, Shield, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card className={cn("border-0 shadow-none bg-transparent", className)}>
      <CardContent className="p-0 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

interface CleanupFeaturesProps {
  className?: string;
}

export function CleanupFeatures({ className }: CleanupFeaturesProps) {
  const features = [
    {
      icon: <Sparkles className="w-7 h-7 text-white" />,
      title: "AI-Powered",
      description: "State-of-the-art AI models to detect and remove unwanted objects",
    },
    {
      icon: <Zap className="w-7 h-7 text-white" />,
      title: "Lightning Fast",
      description: "Process your images in seconds, not minutes",
    },
    {
      icon: <Shield className="w-7 h-7 text-white" />,
      title: "Privacy First",
      description: "Your images never leave your device",
    },
    {
      icon: <ImageIcon className="w-7 h-7 text-white" />,
      title: "All Formats",
      description: "Support for PNG, JPG, GIF, and more",
    },
  ];

  return (
    <section className={cn("w-full py-16 px-6", className)}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How does it work?
          </h2>
          <p className="text-muted-foreground text-lg">
            Remove any object, person, text or watermark from your pictures in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
