import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  CheckCircle,
  Users,
  Shield,
  Star,
  ArrowRight,
  Code,
  Palette,
  Video,
  Wrench,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Landing() {
  const navigate = useNavigate();

  const categories = [
    { name: "Design", icon: Palette, color: "bg-purple-100 text-purple-600" },
    { name: "Programming", icon: Code, color: "bg-blue-100 text-blue-600" },
    { name: "Video Editing", icon: Video, color: "bg-red-100 text-red-600" },
    {
      name: "Device Fixing",
      icon: Wrench,
      color: "bg-green-100 text-green-600",
    },
  ];

  const steps = [
    {
      title: "Post Your Task",
      description: "Describe what you need and set your budget",
      icon: "1",
    },
    {
      title: "Receive Offers",
      description: "Get proposals from verified student freelancers",
      icon: "2",
    },
    {
      title: "Get It Done",
      description: "Work together and complete your project",
      icon: "3",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-white py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-[#F7931E]/10 text-[#F7931E] hover:bg-[#F7931E]/20">
                KFUPM Students Only
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Find Trusted Student Freelancers at KFUPM
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with verified student talent for your projects. Get
                quality work from your fellow students.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                  onClick={() => navigate("/client/post-task")}
                >
                  Post a Task
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/services")}
                >
                  Browse Services
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>KFUPM Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span>Rated Services</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1768796370407-6d36619e7d6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBjb2xsYWJvcmF0aW9uJTIwd29ya2luZ3xlbnwxfHx8fDE3NzE2MjEwMTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="KFUPM Students Collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Mahamma Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 3 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="text-center border-2 hover:border-[#F7931E] transition-all"
              >
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#F7931E] text-white flex items-center justify-center text-2xl font-bold">
                    {step.icon}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect service for your needs
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                onClick={() => navigate("/services")}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`mx-auto mb-4 w-16 h-16 rounded-full ${category.color} flex items-center justify-center`}
                  >
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => navigate("/services")}>
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Trust & Safety at KFUPM
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#F7931E]/10 rounded-full p-2">
                    <Shield className="h-6 w-6 text-[#F7931E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      KFUPM Email Verification
                    </h3>
                    <p className="text-gray-600">
                      All users verified with official KFUPM email addresses
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#F7931E]/10 rounded-full p-2">
                    <Star className="h-6 w-6 text-[#F7931E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Ratings & Reviews
                    </h3>
                    <p className="text-gray-600">
                      Transparent feedback system to ensure quality
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#F7931E]/10 rounded-full p-2">
                    <Users className="h-6 w-6 text-[#F7931E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Admin Moderation
                    </h3>
                    <p className="text-gray-600">
                      24/7 support and dispute resolution team
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-[#F7931E] mb-2">
                  500+
                </div>
                <p className="text-gray-600">Active Students</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-[#F7931E] mb-2">
                  1000+
                </div>
                <p className="text-gray-600">Jobs Completed</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-[#F7931E] mb-2">
                  4.8
                </div>
                <p className="text-gray-600">Average Rating</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-[#F7931E] mb-2">
                  98%
                </div>
                <p className="text-gray-600">Success Rate</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#F7931E] to-orange-600 text-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of KFUPM students already using Mahamma
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/signup")}
            >
              Sign Up Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#F7931E]"
              onClick={() => navigate("/services")}
            >
              Explore Services
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
