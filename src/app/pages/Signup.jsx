import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { EmailInput } from "../components/EmailInput";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Eye, EyeOff } from "lucide-react";
import { register } from "../../lib/api";

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [major, setMajor] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await register({ Name: name, Email: email, Password: password, Role: role, Major: major });
      localStorage.setItem("userInfo", JSON.stringify(data));

      if (role === "provider") {
        navigate("/provider/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto max-w-md px-4 py-20">
        <Card>
          <CardHeader className="text-center">
            <img
              src="/logo_2.png"
              alt="Mahamma logo"
              className="mx-auto mb-4 h-16 w-16 rounded-lg object-contain"
            />
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Join Mahamma - KFUPM's freelance platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Abdullah Al-Shammari"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">KFUPM Email</Label>
                <EmailInput
                  id="email"
                  placeholder="s202012345@kfupm.edu.sa"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Major (Optional)</Label>
                <Input
                  id="major"
                  type="text"
                  placeholder="Computer Science"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-11"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-500 hover:text-gray-800"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>I want to</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value)}
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-[#F7931E]">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client" className="cursor-pointer flex-1">
                      <div className="font-medium">Hire freelancers (Client)</div>
                      <div className="text-sm text-gray-500">Post tasks and find services</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-[#F7931E]">
                    <RadioGroupItem value="provider" id="provider" />
                    <Label htmlFor="provider" className="cursor-pointer flex-1">
                      <div className="font-medium">Offer my services (Provider)</div>
                      <div className="text-sm text-gray-500">Create services and earn</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#F7931E] hover:underline font-medium"
                >
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
