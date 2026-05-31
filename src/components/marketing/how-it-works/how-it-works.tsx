"use client";

import { useState } from "react";
import { Upload, CheckCircle, ShoppingBag, Brush, DollarSign, Package } from "lucide-react";

const FLOWS = {
  buyer: {
    label: "For Buyers",
    heading: "Find art you love.\nWear it tomorrow.",
    steps: [
      {
        icon: ShoppingBag,
        title: "Browse Designs",
        description:
          "Explore thousands of original prints across every aesthetic — minimal, dark, illustrative, abstract, and more.",
      },
      {
        icon: Package,
        title: "Order Your Tee",
        description:
          "Pick your size and garment. We print your chosen design on a premium blank and ship it straight to you.",
      },
      {
        icon: CheckCircle,
        title: "Wear Original Art",
        description:
          "Every piece is printed on demand — no mass production, no warehouse. Your tee is made for you.",
      },
    ],
  },
  designer: {
    label: "For Designers",
    heading: "Upload once.\nEarn forever.",
    steps: [
      {
        icon: Brush,
        title: "Create Your Account",
        description:
          "Register as a designer for free. Set up your profile and studio page in minutes — no approval needed to join.",
      },
      {
        icon: Upload,
        title: "Submit Your Artwork",
        description:
          "Upload your print-ready design. Our team reviews and approves it within 48 hours, then it goes live to thousands of shoppers.",
      },
      {
        icon: DollarSign,
        title: "Earn Every Sale",
        description:
          "You earn 20% royalty on every tee sold with your design. Payouts are automatic. No inventory, no fulfilment, no risk.",
      },
    ],
  },
} as const;

type FlowKey = keyof typeof FLOWS;

export function HowItWorks() {
  const [active, setActive] = useState<FlowKey>("buyer");
  const flow = FLOWS[active];

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-background border-t border-border">

      {/* Header + tab toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20">
        <div>
          <p className="text-tagline text-muted-foreground mb-3">
            How Dripit Works
          </p>
          <h2 className="text-editorial text-[clamp(2rem,5vw,4rem)] leading-none tracking-[-0.03em] font-bold uppercase whitespace-pre-line">
            {flow.heading}
          </h2>
        </div>

        {/* Tab toggle */}
        <div className="flex border border-border h-11 w-fit">
          {(Object.keys(FLOWS) as FlowKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`px-6 text-xs font-semibold uppercase tracking-widest transition-colors ${
                active === key
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {FLOWS[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
        {flow.steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className={`flex flex-col p-8 md:p-10 ${
                i < flow.steps.length - 1
                  ? "border-b md:border-b-0 md:border-r border-border"
                  : ""
              }`}
            >
              {/* Step number + icon */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <div className="h-10 w-10 flex items-center justify-center border border-border">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold tracking-tight text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                {step.description}
              </p>

              {/* Active accent line */}
              {active === "designer" && i === 1 && (
                <div className="mt-6 flex items-center gap-2">
                  <div className="h-px flex-1 bg-brand-purple opacity-40" />
                  <span className="text-[10px] font-medium uppercase tracking-widest text-brand-purple">
                    48hr review
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}