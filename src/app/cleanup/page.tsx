"use client";

import { useState, useCallback } from "react";
import {
  CleanupHeader,
  CleanupFooter,
  UploadZone,
  CleanupEditor,
  CleanupFeatures,
  CleanupExamples,
  CleanupPricing,
} from "@/components/cleanup";

export default function CleanupPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    // Create object URL for the uploaded image
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowEditor(true);
    }, 1500);
  }, []);

  const handleReset = useCallback(() => {
    setImageUrl(null);
    setShowEditor(false);
  }, []);

  const handleDownload = useCallback(() => {
    // In a real app, this would export the canvas
    alert("Download functionality would be implemented here");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CleanupHeader />

      <main className="flex-1 flex flex-col">
        {!showEditor ? (
          // Landing View
          <>
            {/* Hero Section */}
            <section className="w-full py-12 md:py-20 px-6 flex flex-col items-center">
              <div className="text-center mb-8 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Remove any object from your pictures
                </h1>
                <p className="text-lg text-muted-foreground">
                  Free, unlimited and open-source. Remove unwanted objects from your images with AI.
                </p>
              </div>

              <UploadZone
                onFileSelect={handleFileSelect}
                isLoading={isProcessing}
                className="mb-8"
              />

              <p className="text-sm text-muted-foreground">
                Powered by{" "}
                <a href="#" className="text-primary hover:underline">
                  Illusion Diffusion
                </a>{" "}
                ·{" "}
                <a href="#" className="text-primary hover:underline">
                  Background Removal API
                </a>
              </p>
            </section>

            {/* Features Section */}
            <CleanupFeatures />

            {/* Examples Section */}
            <CleanupExamples />

            {/* Pricing Section */}
            <CleanupPricing />
          </>
        ) : (
          // Editor View
          <div className="flex-1 flex flex-col">
            <CleanupEditor
              imageUrl={imageUrl!}
              onReset={handleReset}
              onDownload={handleDownload}
              className="flex-1"
            />
          </div>
        )}
      </main>

      <CleanupFooter />
    </div>
  );
}
