import { BarChart3, Calendar, Eye, TrendingUp, Users } from "lucide-react";
import PageHead from "@/components/PageHead";
import { HOT_STATS } from "@/lib/mockData";
import { CountUp, Reveal } from "@/components/ui";

const MEDALS = [
  { label: "AVERAGE DAILY VIEWS", value: 35000, icon: Eye },
  { label: "VIEWS IN 1 MONTH", value: 1000000, icon: TrendingUp },
  ...HOT_STATS.map((s) => ({ label: s.label.toUpperCase(), value: s.value as number, icon: BarChart3 })),
  { label: "CYCLES PUBLISHED", value: 214, icon: Calendar },
].slice(0, 4);

export default function AnalyticsPage() {
  return (
    <div>
      <PageHead
        eyebrow="AUDIENCE & PERFORMANCE · SAMPLE"
        title="Site Analytics"
        lead="Official Chad Rankings — audience and performance overview."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {MEDALS.map((s, i) => (
          <Reveal key={s.label} delay={i * 70}>
            <div className="panel panel-hover relative p-6">
              <span className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl bg-gold/10 text-gold">
                <s.icon size={16} />
              </span>
              <div className="text-[10.5px] font-black tracking-[0.26em] text-gold">{s.label}</div>
              <div className="mt-3">
                <CountUp value={s.value} className="font-display text-[40px] font-bold text-white" />
              </div>
              <div className="mt-3 h-px w-full bg-gradient-to-r from-gold/40 via-white/10 to-transparent" />
              <div className="mt-2 text-[11px] text-neutral-600">Static sample · not live in the rebuild</div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-[11.5px] text-neutral-600">
        The original page rendered live platform analytics; numbers here are illustrative placeholders.
      </p>
    </div>
  );
}
