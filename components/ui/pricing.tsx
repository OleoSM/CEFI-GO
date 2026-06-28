"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

export interface PricingPlan {
  name: string;
  price: number;
  yearlyPrice: number;
  period: string;
  features: string[];
  excluded?: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
  accent?: string;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({ plans, title, description }: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { x: rect.left / window.innerWidth + rect.width / window.innerWidth / 2, y: rect.top / window.innerHeight },
        colors: ["#A78BFA", "#EC4899", "#F97316", "#22D3EE"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className="w-full">
      {(title || description) && (
        <div className="text-center mb-10 space-y-3">
          {title && (
            <h2 className="text-4xl font-black" style={{ fontFamily: "var(--font-display)" }}>
              {title}
            </h2>
          )}
          {description && <p className="text-white/45 whitespace-pre-line">{description}</p>}
        </div>
      )}

      {/* Toggle mensual / anual */}
      <div className="flex justify-center items-center gap-3 mb-10">
        <span className={`text-sm font-semibold transition-colors ${isMonthly ? "text-white" : "text-white/40"}`}>Mensual</span>
        <Label>
          <Switch ref={switchRef as React.RefObject<HTMLButtonElement>} checked={!isMonthly} onCheckedChange={handleToggle} />
        </Label>
        <span className={`text-sm font-semibold transition-colors ${!isMonthly ? "text-white" : "text-white/40"}`}>
          Anual <span className="text-violet-400 font-bold ml-1">−20%</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -16 : 0,
                    opacity: 1,
                    x: index === 2 ? -20 : index === 0 ? 20 : 0,
                    scale: index === 0 || index === 2 ? 0.95 : 1,
                  }
                : { y: 0, opacity: 1 }
            }
            viewport={{ once: true }}
            transition={{ duration: 1.2, type: "spring", stiffness: 100, damping: 30, delay: 0.1 + index * 0.1 }}
            className={cn(
              "relative rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300",
              plan.isPopular
                ? "bg-gradient-to-b from-violet-950/80 to-[#0B0617] border-2 border-violet-500/50 shadow-2xl shadow-violet-900/30"
                : "bg-white/[0.03] border border-white/8 hover:border-white/15",
              !plan.isPopular && "mt-5"
            )}
          >
            {plan.isPopular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-xs font-bold text-white whitespace-nowrap flex items-center gap-1.5">
                <Star className="h-3 w-3 fill-current" /> Más elegido
              </div>
            )}

            {/* Header */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">{plan.name}</p>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className={`text-5xl font-black ${plan.isPopular ? "gradient-text" : "text-white"}`}>
                  <NumberFlow
                    value={isMonthly ? plan.price : plan.yearlyPrice}
                    format={{ style: "currency", currency: "MXN", minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                    formatter={(v) => `$${v}`}
                    transformTiming={{ duration: 500, easing: "ease-out" }}
                    willChange
                  />
                </span>
                {plan.period && (
                  <span className="text-sm text-white/35 font-medium">/{plan.period}</span>
                )}
              </div>
              <p className="text-xs text-white/30">{isMonthly ? "cobro mensual" : "cobro anual"}</p>
            </div>

            <p className="text-sm text-white/50 leading-relaxed">{plan.description}</p>

            {/* Features */}
            <ul className="space-y-2.5 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/75">
                  <Check className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
              {plan.excluded?.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/25 line-through">
                  <span className="w-4 h-4 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="h-px bg-white/6" />

            <Link
              href={plan.href}
              className={cn(
                "w-full text-center px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-200",
                plan.isPopular
                  ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 shadow-lg shadow-violet-900/30"
                  : "border border-white/12 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {plan.buttonText}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
