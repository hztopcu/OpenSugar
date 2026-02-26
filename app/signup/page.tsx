import { redirect } from "next/navigation";

/** Ghost Mode: no signup. Redirect to login. */
export default function SignupPage() {
  redirect("/login");
}
