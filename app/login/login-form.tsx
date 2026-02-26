"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";
import { useLanguage } from "@/components/language-provider";

export function LoginForm({
  error,
  redirectTo,
}: {
  error: string | undefined;
  redirectTo: string;
}) {
  const { t } = useLanguage();
  const showError = error === "CredentialsSignin" || error === "invalid" || error === "missing";

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <h1 className="text-xl font-semibold">{t("login.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("login.signIn")}</p>
      </CardHeader>
      <CardContent>
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={redirectTo} />
          {showError && (
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {t("login.errorMessage")}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">{t("login.username")}</Label>
            <Input id="username" name="username" type="text" required autoComplete="username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("login.password")}</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          <Button type="submit" className="w-full">{t("login.signIn")}</Button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {t("login.envHint")}
        </p>
      </CardContent>
    </Card>
  );
}
