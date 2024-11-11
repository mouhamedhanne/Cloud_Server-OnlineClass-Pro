import Image from "next/image";
import OnlineClassLogo from "@/public/onlineclass.svg";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { getAuthSession } from "@/src/lib/auth";
import { UserNav } from "@/src/features/auth/User";

export const Header = async () => {
  const session = await getAuthSession();

  const user = session?.user;

  if (!user) {
    throw new Error("No session found");
  }

  return (
    <header className="border-b border-b-accent bg-background w-full ">
      <div className="container flex items-center py-2 max-w-[50rem] m-auto gap-1 ">
        <Image
          src={OnlineClassLogo}
          alt="OnlineClass Pro"
          width="60"
          height="60"
          className="mr-auto"
        />
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {session?.user ? <UserNav user={user} /> : null}
        </div>
      </div>
    </header>
  );
};
