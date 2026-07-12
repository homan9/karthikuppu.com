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

        <p>
          <span className="landing__name">Karthik Uppu</span>
        </p>

        <p>
          I&apos;m exploring a new instrument that lets us share equity in our
          success across life &ndash; so that we can incentivize people to help
          us succeed across everything we do, rather than only with individual
          ideas (companies). Because it takes a village.
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
