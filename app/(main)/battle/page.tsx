"use client";
import { useState } from "react";
import { Crown, RotateCcw, Swords, Zap } from "lucide-react";
import PageHead from "@/components/PageHead";
import { placeholderName } from "@/lib/mockData";
import { Meter, PhotoAvatar, Reveal, StatueTile } from "@/components/ui";

type C = { name: string; score: number };
const POOL: C[] = Array.from({ length: 16 }, (_, i) => ({
  name: placeholderName((i * 5 + 3) % 64),
  score: Math.round((94 - i * 1.7 + ((i * 13) % 9) / 10) * 10) / 10,
}));
const TOTAL = 15;

export default function BattlePage() {
  const [stage, setStage] = useState<C[]>(POOL);
  const [winners, setWinners] = useState<C[]>([]);
  const [match, setMatch] = useState(1);
  const [flashed, setFlashed] = useState<string | null>(null);

  const roundNo = Math.log2(POOL.length) - Math.log2(stage.length) + 1;
  const champion = stage.length === 1 && winners.length === 0 ? stage[0] : null;
  const a = stage[0];
  const b = stage[1] ?? null;

  const pick = (w: C) => {
    setFlashed(w.name);
    setTimeout(() => setFlashed(null), 620);
    const ws = [...winners, w];
    const rest = stage.slice(2);
    if (rest.length === 0) {
      setWinners([]);
      setStage(ws);
    } else {
      setWinners(ws);
      setStage(rest);
    }
    setMatch((m) => Math.min(m + 1, TOTAL));
  };
  const restart = () => {
    setStage(POOL);
    setWinners([]);
    setMatch(1);
    setFlashed(null);
  };

  return (
    <div>
      <PageHead
        eyebrow="HEAD-TO-HEAD · SINGLE ELIMINATION"
        title="Chad Battle"
        lead="Pick your favorite — last one standing wins. Sixteen contenders enter, the crown exits."
        right={
          <button type="button" onClick={restart} className="btn btn-ghost !text-[12.5px]">
            <RotateCcw size={14} /> Restart
          </button>
        }
      />

      {/* round strip */}
      <div className="mt-8 flex items-center gap-4 rounded-full border border-line bg-black/30 px-5 py-3">
        <span className="flex items-center gap-2 font-display text-[13px] font-bold text-gold">
          <Swords size={14} /> ROUND {roundNo}
        </span>
        <div className="relative flex-1">
          <Meter value={match - 1} max={TOTAL} color="var(--ovr-gold)" />
        </div>
        <span className="font-display text-[13px] text-neutral-400">
          Match {match} of {TOTAL}
        </span>
      </div>

      {champion ? (
        <Reveal>
          <div className="glow-ring relative mt-6 overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-b from-[#191304] to-[#08080b] p-10 text-center">
            <div aria-hidden className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
            <div className="float-y mx-auto w-fit">
              <Crown size={42} className="text-gold-bright" />
            </div>
            <div className="eyebrow mt-4">CHAMPION</div>
            <h2 className="gold-leaf mt-2 font-display text-[clamp(2.6rem,7vw,4rem)] font-black">{champion.name}</h2>
            <p className="mt-3 text-[13px] text-neutral-500">
              Sixteen contenders entered; one stood alone with score {champion.score}. Restart to run it again.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="mt-8 grid items-stretch gap-5 md:grid-cols-[1fr_auto_1fr]">
          {/* left fighter */}
          {a ? <FighterCard c={a} side="A" flashed={flashed} onPick={pick} /> : <div />}
          {/* VS divider */}
          <div className="grid place-items-center py-2 md:py-8">
            <div className="text-center">
              <StatueTile seed={999} gold size={58} />
              <div className="gold-leaf mt-2 font-display text-[30px] font-black tracking-[0.14em]">VS</div>
            </div>
          </div>
          {/* right fighter */}
          {b ? (
            <FighterCard c={b} side="B" flashed={flashed} onPick={pick} />
          ) : (
            <div aria-hidden className="hidden md:block" />
          )}
        </div>
      )}

      <p className="mt-5 text-[11.5px] text-neutral-600">
        Bracket state is memory-only and resets on reload. Names are fictional placeholders.
      </p>
    </div>
  );
}

function FighterCard({
  c,
  side,
  flashed,
  onPick,
}: {
  c: C;
  side: "A" | "B";
  flashed: string | null;
  onPick: (w: C) => void;
}) {
  const hit = flashed === c.name;
  return (
    <button
      type="button"
      onClick={() => onPick(c)}
      className={`panel panel-hover glow-ring relative flex flex-col items-center overflow-hidden p-8 transition-transform active:scale-[0.985] ${
        hit ? "!border-gold/70 shadow-glow-lg" : ""
      }`}
    >
      {hit ? (
        <div className="absolute left-1/2 top-5 -translate-x-1/2 text-gold-bright">
          <Crown size={30} />
        </div>
      ) : null}
      <PhotoAvatar name={c.name} seed={side === "A" ? c.name.length * 3 : c.name.length * 7 + 5} size={132} eager />
      <div className="mt-5 font-display text-[clamp(1.6rem,4vw,2.2rem)] font-black tracking-[0.06em] text-white">
        {c.name}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[12px] text-neutral-500">
        <Zap size={12} className="text-gold" /> Score {c.score}
      </div>
      <div className="mt-6 w-full max-w-56">
        <span className="btn btn-gold pointer-events-none w-full">PICK {side}</span>
      </div>
    </button>
  );
}
