import { getAuthSession } from "@/src/lib/auth";
import Link from "next/link";
import Container from "@/components/elements/Container";
import { LayoutHeader, LayoutTitle } from "@/src/components/Layout/Layout";
import LevelsPage from "./levels/page";

export type AuthenticatedContentProps = { session: any };

const AuthenticatedContent: React.FC<AuthenticatedContentProps> = async ({
  session,
}: any) => {
  return (
    <LevelsPage />
  );
};

export default AuthenticatedContent;
