import Image from "next/image";
import { getAllPostsMeta } from "@/lib/posts";
import { EssayList } from "@/components/EssayList";

export default function Home() {
  const posts = getAllPostsMeta();

  return (
    <main className="page">
      <div className="landing reveal">
        {/* Profile picture — square, max width 300px */}
        <div className="landing__photo">
          <div className="landing__photo-inner">
            <Image src="/profile.png" alt="Karthik Uppu" fill priority />
          </div>
        </div>

        <p className="landing__name-row">
          <span className="landing__name">Karthik Uppu</span>
          <span className="landing__divider" aria-hidden="true" />
          <a
            className="landing__x"
            href="https://x.com/koopuluri"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Karthik Uppu on X"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </p>

        <p>
          Working on a legal instrument that lets you build a cap table for your
          life &ndash; like you can for a company. Because it takes a village.
        </p>

        <p>
          I&apos;m based out of San Francisco.{" "}
          <a className="landing__contact" href="mailto:koopuluri@gmail.com">
            Let&apos;s chat.
          </a>
        </p>

        <EssayList posts={posts} />
      </div>
    </main>
  );
}
