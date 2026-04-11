import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const EXAMPLE_CLIENT = { email: "client@kfupm.edu.sa", password: "client123" };
const EXAMPLE_PROVIDER = { email: "provider@kfupm.edu.sa", password: "provider123" };

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (email === EXAMPLE_CLIENT.email && password === EXAMPLE_CLIENT.password) {
      navigate("/client/dashboard");
    } else if (email === EXAMPLE_PROVIDER.email && password === EXAMPLE_PROVIDER.password) {
      navigate("/provider/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto max-w-md px-4 py-20">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-[#F7931E] rounded-lg p-3 w-fit">
              <span className="text-white text-2xl font-bold">M</span>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Login to your Mahamma account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 text-sm text-blue-800 bg-blue-50 rounded-md">
              <p className="font-semibold mb-1">Example Accounts:</p>
              <ul className="list-disc list-inside bg-transparent space-y-1">
                <li>Client: <strong>{EXAMPLE_CLIENT.email}</strong> / {EXAMPLE_CLIENT.password}</li>
                <li>Freelancer: <strong>{EXAMPLE_PROVIDER.email}</strong> / {EXAMPLE_PROVIDER.password}</li>
              </ul>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">KFUPM Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="s202012345@kfupm.edu.sa"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
              >
                Login
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#F7931E] hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
