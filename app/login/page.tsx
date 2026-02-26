import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;
  // NextAuth credentials hatasında ?error=CredentialsSignin döner
  const showError = error === "CredentialsSignin" || error === "invalid" || error === "missing";
  const redirectTo = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-xl font-semibold">OpenSugar</h1>
          <p className="text-sm text-muted-foreground">Giriş yapın</p>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="callbackUrl" value={redirectTo} />
            {showError && (
              <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                Giriş başarısız. .env.local içinde <strong>APP_USER</strong> ve <strong>APP_PASSWORD</strong> değerlerini kontrol edin.
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı adı</Label>
              <Input id="username" name="username" type="text" required autoComplete="username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full">Giriş yap</Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            .env.local içinde <strong>APP_USER</strong> ve <strong>APP_PASSWORD</strong> tanımlı olmalı.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
