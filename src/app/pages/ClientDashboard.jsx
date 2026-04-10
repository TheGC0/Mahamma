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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { StatusBadge } from "../components/StatusBadge";
import { StarRating } from "../components/StarRating";
import {
  Plus,
  Briefcase,
  MessageSquare,
  Heart,
  Clock,
  FileText,
} from "lucide-react";

export function ClientDashboard() {
  const navigate = useNavigate();

  const myRequests = [
    {
      id: "t1",
      title: "Mobile App UI Design",
      category: "Design",
      budget: "300-500 SAR",
      status: "open",
      offers: 3,
      createdAt: "2 days ago",
    },
    {
      id: "t4",
      title: "Website SEO Optimization",
      category: "Marketing",
      budget: "200-300 SAR",
      status: "in_progress",
      offers: 0,
      createdAt: "1 week ago",
    },
  ];

  const activeJobs = [
    {
      id: "j1",
      title: "Logo Design for Startup",
      provider: "Ahmed Al-Otaibi",
      status: "in_progress",
      progress: 60,
      deadline: "3 days",
    },
    {
      id: "j2",
      title: "Python Data Analysis",
      provider: "Sara Mohammed",
      status: "delivered",
      progress: 100,
      deadline: "Completed",
    },
  ];

  const savedProviders = [
    {
      id: "p1",
      name: "Ahmed Al-Otaibi",
      specialty: "Logo & Brand Design",
      rating: 4.9,
      jobs: 45,
    },
    {
      id: "p2",
      name: "Sara Mohammed",
      specialty: "Python & Data Science",
      rating: 5.0,
      jobs: 32,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} userRole="client" userName="Abdullah" />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Client Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your tasks, jobs, and freelancers
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Requests</p>
                  <p className="text-3xl font-bold text-gray-900">2</p>
                </div>
                <FileText className="h-8 w-8 text-[#F7931E]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ongoing Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">2</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">1,200</p>
                  <p className="text-xs text-gray-500">SAR</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg">
                  ر.س
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Saved Providers</p>
                  <p className="text-3xl font-bold text-gray-900">2</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Button
            className="h-auto py-4 bg-[#F7931E] hover:bg-[#F7931E]/90"
            onClick={() => navigate("/client/post-task")}
          >
            <Plus className="mr-2 h-5 w-5" />
            Post a New Task
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => navigate("/services")}
          >
            Browse Services
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => navigate("/messages")}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Messages
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
            <TabsTrigger value="saved">Saved Providers</TabsTrigger>
          </TabsList>

          {/* My Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {myRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">
                          {request.title}
                        </CardTitle>
                        <StatusBadge status={request.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Badge variant="outline">{request.category}</Badge>
                        <span>{request.budget}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {request.createdAt}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {request.offers > 0 && (
                        <Badge className="bg-[#F7931E] hover:bg-[#F7931E]/90">
                          {request.offers} Offers
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {request.offers > 0 && (
                      <Button
                        className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                        onClick={() =>
                          navigate(`/client/request/${request.id}`)
                        }
                      >
                        View Offers ({request.offers})
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/client/request/${request.id}`)}
                    >
                      View Details
                    </Button>
                    <Button variant="outline">Edit Request</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Active Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            {activeJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <StatusBadge status={job.status} />
                      </div>
                      <CardDescription>
                        Provider: {job.provider}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{job.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#F7931E] h-2 rounded-full transition-all"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                        onClick={() => navigate(`/client/jobs/${job.id}`)}
                      >
                        View Workspace
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Saved Providers Tab */}
          <TabsContent value="saved" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {savedProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className="hover:shadow-md transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-200 rounded-full p-4">
                        <span className="text-lg font-bold">
                          {provider.name[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {provider.name}
                        </CardTitle>
                        <CardDescription>{provider.specialty}</CardDescription>
                        <div className="mt-2 flex items-center gap-4">
                          <StarRating rating={provider.rating} />
                          <span className="text-sm text-gray-600">
                            {provider.jobs} jobs
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/providers/${provider.id}`)}
                      >
                        View Profile
                      </Button>
                      <Button variant="outline">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
