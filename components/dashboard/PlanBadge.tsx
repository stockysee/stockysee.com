"use client";

interface PlanBadgeProps {
  plan: string;
  className?: string;
}

export const PlanBadge = ({ plan, className = "" }: PlanBadgeProps) => {
  const getPlanConfig = (planName: string) => {
    const p = planName?.toLowerCase() || "basic";
    
    if (p.includes("premium")) {
      return { bg: "from-red-500 to-rose-600", text: "text-white shadow-red-500/20" };
    }
    if (p.includes("pro") || p.includes("standard pro") || p.includes("standart pro")) {
      return { bg: "from-blue-700 to-blue-800", text: "text-white shadow-blue-700/20" };
    }
    if (p.includes("standard") || p.includes("standart")) {
      return { bg: "from-blue-400 to-blue-500", text: "text-white shadow-blue-400/20" };
    }
    if (p.includes("basic+")) {
      return { bg: "from-yellow-400 to-amber-500", text: "text-amber-950 shadow-yellow-500/20" };
    }
    return { bg: "from-slate-200 to-slate-300", text: "text-slate-700 shadow-slate-300/20" };
  };

  const config = getPlanConfig(plan);

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[7px] md:text-[8px] font-black uppercase tracking-[0.15em] bg-gradient-to-br ${config.bg} ${config.text} shadow-lg ${className}`}>
      {plan || "Basic"}
    </span>
  );
};
