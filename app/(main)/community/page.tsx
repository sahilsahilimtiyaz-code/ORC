import Link from "next/link";
import { Heart, MessageCircle, Users } from "lucide-react";
import PageHead from "@/components/PageHead";
import { COMMUNITY_POSTS } from "@/lib/mockData";
import { PhotoAvatar, Reveal } from "@/components/ui";

export default function CommunityPage() {
  return (
    <div>
      <PageHead
        eyebrow="THE FORUM"
        title="Community"
        lead="Discuss rankings, share insights, and connect with other members."
        right={
          <Link href="/profile" className="btn btn-gold !text-[13px]">
            Sign in to Post
          </Link>
        }
      />
      <div className="mt-6 rounded-2xl border-l-[3px] border-gold bg-black/30 px-5 py-4 text-[13px] leading-relaxed text-neutral-400">
        One post per day. Comments: one per discussion per day, at least one minute apart. Admins are
        exempt. Accounts using inappropriate language are blocked from community actions.
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {COMMUNITY_POSTS.map((p, i) => (
          <Reveal key={p.author} delay={i * 60}>
            <article className="panel panel-hover p-5">
              <div className="flex items-center gap-3">
                <PhotoAvatar name={p.author} seed={i * 3 + 2} size={38} />
                <div>
                  <div className="text-[14px] font-bold text-white">{p.author}</div>
                  <div className="text-[11px] text-neutral-600">{p.ago} ago</div>
                </div>
                <Users size={13} className="ml-auto text-neutral-700" />
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-neutral-300">{p.body}</p>
              <div className="mt-3 flex items-center gap-5 text-[12px] text-neutral-600">
                <span className="inline-flex items-center gap-1.5 text-neutral-500"><Heart size={13} /> sample</span>
                <span className="inline-flex items-center gap-1.5 transition-colors hover:text-white"><MessageCircle size={13} /> Reply</span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-[11.5px] text-neutral-600">
        Placeholder posts from lib/mockData.ts. Posting is disabled in the sample rebuild.
      </p>
    </div>
  );
}
