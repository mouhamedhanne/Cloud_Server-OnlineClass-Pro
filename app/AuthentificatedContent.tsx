import { getAuthSession } from "@/src/lib/auth";
import Link from "next/link";
import Container from "@/components/elements/Container";
import { LayoutHeader, LayoutTitle } from "@/src/components/Layout/Layout";

export type AuthenticatedContentProps = { session: any };

const AuthenticatedContent: React.FC<AuthenticatedContentProps> = async ({
  session,
}: any) => {
  return (
    <LayoutHeader>
      <LayoutTitle>Here we go</LayoutTitle>
    </LayoutHeader>
  );
};

export default AuthenticatedContent;
