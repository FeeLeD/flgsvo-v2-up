import React, { FC, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { UserSession } from "lib/types";
import LoadingPage from "./LoadingPage";

type Props = {
  isLoading?: boolean;
  onlyAdmin?: boolean;
};

const PrivateLayout: FC<Props> = ({ isLoading, onlyAdmin, children }) => {
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (
      !loading &&
      (!session ||
        (onlyAdmin &&
          session &&
          !(session.user as UserSession).isAdmin &&
          !loading &&
          !isLoading))
    ) {
      router.push("/");
    }
  }, [session, loading]);

  if (loading || isLoading) {
    return <LoadingPage />;
  }

  if (
    (!onlyAdmin && session) ||
    (onlyAdmin && session && (session.user as UserSession).isAdmin)
  ) {
    return <>{children}</>;
  }

  return null;
};

export default PrivateLayout;
