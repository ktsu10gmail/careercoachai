import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export function GuideLink({
  href,
  label = "Open guide",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      className={buttonVariants({ variant: "outline" })}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <BookOpenIcon className="size-4" />
      {label}
    </Link>
  );
}
