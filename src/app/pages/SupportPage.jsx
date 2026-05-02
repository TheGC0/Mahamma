import { Link, useLocation } from "react-router";
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
import { AlertTriangle, CheckCircle, HelpCircle, Mail } from "lucide-react";

const pages = {
  "/support/help": {
    icon: HelpCircle,
    title: "Help Center",
    description: "Quick answers for common Mahamma workflows.",
    items: [
      "Clients can browse services, post a task, compare offers, and track work from the dashboard.",
      "Freelancers can find tasks, create services, message clients, and update delivery progress.",
      "Use Messages for project questions before accepting or completing work.",
      "Use Report an Issue when something needs review by the support team.",
    ],
    actions: [
      { label: "Browse Services", to: "/services" },
      { label: "Find Tasks", to: "/provider/tasks" },
    ],
  },
  "/support/safety": {
    icon: AlertTriangle,
    title: "Safety Guidelines",
    description: "Use Mahamma safely with clear expectations and records.",
    items: [
      "Keep project details, agreements, and changes inside Mahamma messages.",
      "Do not share passwords, database credentials, or payment information in chat.",
      "Review provider profiles, service details, deadlines, and agreed prices before ordering.",
      "Report suspicious behavior, incomplete delivery, or inappropriate messages.",
    ],
    actions: [
      { label: "View Services", to: "/services" },
      { label: "My Dashboard", to: "/client/dashboard" },
    ],
  },
  "/support/contact": {
    icon: Mail,
    title: "Contact Us",
    description: "Reach the Mahamma support team for account, task, or service help.",
    items: [
      "For service or job issues, open the relevant page and use Report an Issue.",
      "For account access or general support, contact the team by email.",
      "Include your KFUPM email and a short description of the issue.",
    ],
    actions: [
      { label: "Email Support", href: "mailto:support@mahamma.local" },
      { label: "Messages", to: "/messages" },
    ],
  },
};

export function SupportPage() {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const page = pages[location.pathname] || pages["/support/help"];
  const Icon = page.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        isAuthenticated={!!userInfo}
        userRole={userInfo?.Role}
        userName={userInfo?.Name}
      />

      <main className="container mx-auto max-w-4xl px-4 py-10 flex-1">
        <Card>
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-[#F7931E]">
              <Icon className="h-6 w-6" />
            </div>
            <CardTitle className="text-3xl">{page.title}</CardTitle>
            <CardDescription className="text-base">
              {page.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {page.items.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border bg-white p-4">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <p className="text-sm leading-6 text-gray-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {page.actions.map((action) =>
                action.href ? (
                  <Button key={action.label} asChild>
                    <a href={action.href}>{action.label}</a>
                  </Button>
                ) : (
                  <Button key={action.label} asChild variant="outline">
                    <Link to={action.to}>{action.label}</Link>
                  </Button>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
