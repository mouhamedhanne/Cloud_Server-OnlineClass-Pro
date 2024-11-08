import { getAuthSession } from "@/src/lib/auth";
import AuthenticatedContent from "@/app/AuthentificatedContent";
import Login from "@/app/login/page";

export default async function HomePage() {
  const session = await getAuthSession();

  if (session?.user) {
    return <AuthenticatedContent session={session} />;
  }
  return <Login />;
}
