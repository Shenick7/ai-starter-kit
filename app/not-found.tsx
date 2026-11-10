import Link from "next/link";
export default function NotFound() {
  return <div className="prose"><h1>Page not found</h1><p>Try <Link href="/search">searching for a tool</Link> or go <Link href="/">home</Link>.</p></div>;
}
