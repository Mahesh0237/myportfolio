import AuthCheck from "@/components/auth/AuthCheck";
import MyAccountHeader from "@/components/myaccount/header/MyAccountHeader";
import { cookies } from "next/headers";
import React from "react";

async function layout({ children }) {
  const cookieStore = await cookies();
  const uuid = cookieStore.get('uuid')?.value;
  const is_logged = cookieStore.get('is_logged')?.value;
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header with fixed height */}
      <AuthCheck uuid={uuid} is_logged={is_logged} href={`/login`}>
        <div className="sticky h-fit z-10">
          <MyAccountHeader
            user_uid={uuid}
          />
        </div>

        {/* Content below the header */}
        <div className={`h-full overflow-y-auto`} >
          {children}
        </div>
      </AuthCheck>
    </div>
  );
}

export default layout;
