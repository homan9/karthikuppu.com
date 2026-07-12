import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import styles from "./EssayList.module.css";

/**
 * The list of essay titles on the landing page. Each item is a link with a
 * subtle color + weight shift on hover to signal it's clickable.
 * Tweak its look in EssayList.module.css.
 */
export function EssayList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.slug} className={styles.item}>
          <Link href={`/${post.slug}`} className={styles.link}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
