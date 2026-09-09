"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useAppStore } from "@/lib/store";

export default function AccountPage() {
  const user = useAppStore((s) => s.currentUser);
  const deleteAccount = useAppStore((s) => s.deleteAccount);
  const router = useRouter();

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-4xl">Account</h1>
      <p className="mt-2 text-sm text-muted">{user?.email}</p>
      <div className="mt-8 hairline rounded-3xl bg-white/40 p-6">
        <h2 className="text-2xl">Delete everything</h2>
        <p className="mt-2 text-sm text-muted">
          Apple and privacy rules require a client-visible full deletion path. This
          clears the local demo account and all workspaces on this device. When Supabase
          is connected, this should cascade profiles, storage, and auth.users.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => {
            if (confirm("Delete this account and every event on this device?")) {
              deleteAccount();
              router.push("/");
            }
          }}
        >
          Delete account
        </Button>
      </div>
    </main>
  );
}
