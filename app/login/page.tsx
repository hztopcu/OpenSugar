import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;
  const redirectTo = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <LoginForm error={error} redirectTo={redirectTo} />
    </main>
  );
}
