"use client";

import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CleanupPricingProps {
  className?: string;
}

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for occasional use",
    features: [
      "3 credits per month",
      "Up to 2MB per image",
      "Standard processing",
      "Community support",
    ],
    notIncluded: [
      "Batch processing",
      "Priority processing",
      "API access",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "9",
    description: "For professionals and creators",
    features: [
      "100 credits per month",
      "Up to 10MB per image",
      "Priority processing",
      "Batch processing",
      "API access",
      "Priority support",
    ],
    notIncluded: [],
    popular: true,
  },
  {
    name: "Unlimited",
    price: "29",
    description: "For teams and heavy users",
    features: [
      "Unlimited credits",
      "Up to 50MB per image",
      "Priority processing",
      "Batch processing",
      "API access",
      "Dedicated support",
      "Custom workflows",
    ],
    notIncluded: [],
    popular: false,
  },
];

export function CleanupPricing({ className }: CleanupPricingProps) {
  return (
    <section className={cn("w-full py-16 px-6", className)}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Start for free, upgrade as you grow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative transition-all hover:shadow-lg",
                plan.popular
                  ? "border-violet-500 shadow-lg shadow-violet-500/10 scale-105"
                  : "border-border"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full text-xs font-medium text-white flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <Button
                  className={cn(
                    "w-full mb-6",
                    plan.popular
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                      : ""
                  )}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-4 h-4 flex items-center justify-center text-muted-foreground/50">—</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
