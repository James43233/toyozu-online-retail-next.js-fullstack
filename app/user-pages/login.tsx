
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // No backend: simple demo login
  const onSubmit = (data: LoginForm) => {
    try {
      localStorage.setItem("access_token", "mock-access-token");
      localStorage.setItem("refresh_token", "mock-refresh-token");
      localStorage.setItem("username", data.username);
    } catch {}
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center">
      <div className="max-w-md w-full mx-auto py-20 px-4">
        <div className="bg-surface text-surface-foreground rounded-xl shadow p-8">
          <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Username</label>
              <Input
                placeholder="Username"
                aria-invalid={errors.username ? "true" : "false"}
                {...register("username")}
              />
              {errors.username?.message && (
                <p className="mt-1 text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm">Password</label>
              <Input
                type="password"
                placeholder="Password"
                aria-invalid={errors.password ? "true" : "false"}
                {...register("password")}
              />
              {errors.password?.message && (
                <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}