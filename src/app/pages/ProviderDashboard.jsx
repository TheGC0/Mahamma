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
import {
  Plus,
  DollarSign,
  Star,
  Briefcase,
  TrendingUp,
  Eye,
} from "lucide-react";

export function ProviderDashboard() {
  const navigate = useNavigate();

  const myServices = [
    {
      id: "s1",
      title: "Professional Logo Design",
      category: "Design",
      price: 150,
      views: 245,
      orders: 12,
      rating: 4.9,
    },
    {
      id: "s2",
      title: "Python Programming & Automation",
      category: "Programming",
      price: 200,
      views: 189,
      orders: 8,
      rating: 5.0,
    },
  ];

  const activeJobs = [
    {
      id: "j1",
      title: "E-commerce Website Design",
      client: "Mohammed Al-Shehri",
      status: "in_progress",
      price: 450,
      deadline: "5 days",
    },
    {
      id: "j2",
      title: "Data Analysis Dashboard",
      client: "Layla Ibrahim",
      status: "delivered",
      price: 300,
      deadline: "Awaiting approval",
    },
  ];

  const taskRequests = [
    {
      id: "t1",
      title: "Mobile App UI Design",
      client: "Mohammed Al-Shehri",
      budget: "300-500 SAR",
      deadline: "2 weeks",
      category: "Design",
    },
    {
      id: "t2",
      title: "Video Editing for YouTube",
      client: "Yousef Al-Mutairi",
      budget: "150-250 SAR",
      deadline: "5 days",
      category: "Video Editing",
    },
  ];

  const stats = {
    totalEarnings: 3200,
    completedJobs: 20,
    rating: 4.9,
    activeOrders: 2,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} userRole="provider" userName="Ahmed" />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Provider Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your services, jobs, and earnings
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalEarnings}
                  </p>
                  <p className="text-xs text-gray-500">SAR</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.completedJobs}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.rating}
                  </p>
                </div>
                <Star className="h-8 w-8 text-[#F7931E] fill-[#F7931E]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Orders</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.activeOrders}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#F7931E]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Button
            className="h-auto py-4 bg-[#F7931E] hover:bg-[#F7931E]/90"
            onClick={() => navigate("/provider/create-service")}
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Service
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => navigate("/provider/tasks")}
          >
            Browse Task Requests
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => navigate("/providers/p1")}
          >
            View My Profile
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">My Services</TabsTrigger>
            <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
            <TabsTrigger value="requests">Task Requests</TabsTrigger>
          </TabsList>

          {/* My Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {myServices.map((service) => (
                <Card
                  key={service.id}
                  className="hover:shadow-md transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">
                            {service.title}
                          </CardTitle>
                        </div>
                        <Badge variant="secondary">{service.category}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#F7931E]">
                          {service.price} SAR
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Views</p>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span className="font-medium">{service.views}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Orders</p>
                        <span className="font-medium">{service.orders}</span>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[#F7931E] text-[#F7931E]" />
                          <span className="font-medium">{service.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Edit Service
                      </Button>
                      <Button variant="outline">View</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                      <CardDescription>Client: {job.client}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#F7931E]">
                        {job.price} SAR
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      Deadline: {job.deadline}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                      onClick={() => navigate(`/client/jobs/${job.id}`)}
                    >
                      Open Workspace
                    </Button>
                    {job.status === "in_progress" && (
                      <Button variant="outline">Mark as Delivered</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Task Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {taskRequests.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {task.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Badge variant="outline">{task.category}</Badge>
                        <span>Budget: {task.budget}</span>
                        <span>Deadline: {task.deadline}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Posted by {task.client}
                  </CardDescription>
                  <div className="flex gap-2">
                    <Button className="bg-[#F7931E] hover:bg-[#F7931E]/90">
                      Submit Offer
                    </Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
