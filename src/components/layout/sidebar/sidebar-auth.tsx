import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CircleUserRoundIcon } from 'lucide-react';

export default function SidebarAuth() {
  const user = useQuery(api.auth.getCurrentUser);

  const image = user?.image;
  const name = user?.name ?? 'Tom Cook';

  return (
    <a
      href="#"
      className="hover:bg-background border-border/50 focus-visible:ring-primary flex items-center border-t border-dashed py-3 pl-4 text-base/6 font-semibold focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
    >
      {image ? (
        <Image alt="" src={image} className="size-8 shrink-0 rounded-full" width={32} height={32} />
      ) : (
        <CircleUserRoundIcon className="size-8 shrink-0 rounded-full" />
      )}
      <span className="sr-only">Your profile</span>
      <span className="ml-2 inline group-data-[state=collapsed]/sidebar:hidden" aria-hidden="true">
        {name}
      </span>
    </a>
  );
}
