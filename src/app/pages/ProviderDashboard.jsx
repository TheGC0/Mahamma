import { useState, useEffect } from "react";
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
  MessageSquare,
} from "lucide-react";
import {
  getMyContracts,
  getServiceOrders,
  getServices,
  updateContractStatus,
  updateServiceOrderStatus,
} from "../../lib/api";

const DELIVERED_DEADLINE_LABEL = "Awaiting approval";

export function ProviderDashboard() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [myServices, setMyServices] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) { navigate("/login"); return; }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [services, contracts, orders] = await Promise.all([
          getServices({ providerId: userInfo._id }),
          getMyContracts(),
          getServiceOrders(),
        ]);
        setMyServices(services);
        setActiveJobs(contracts);
        setServiceOrders(orders);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMarkAsDelivered = async (jobId) => {
    try {
      await updateContractStatus(jobId, "delivered");
      setActiveJobs((jobs) =>
        jobs.map((job) =>
          job._id === jobId ? { ...job, Status: "delivered" } : job
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleServiceOrderStatus = async (orderId, Status) => {
    try {
      const updated = await updateServiceOrderStatus(orderId, Status);
      setServiceOrders((orders) =>
        orders.map((order) => (order._id === orderId ? updated : order)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const completedServiceOrders = serviceOrders.filter((order) => order.Status === "completed").length;
  const completedJobs = activeJobs.filter((j) => j.Status === "completed").length + completedServiceOrders;
  const totalEarnings = activeJobs
    .filter((j) => j.Status === "completed")
    .reduce((sum, j) => sum + (j.AgreedAmount || 0), 0) +
    serviceOrders
      .filter((order) => order.Status === "completed")
      .reduce((sum, order) => sum + (order.Price || 0), 0);
  const activeOrders =
    activeJobs.filter((j) => j.Status === "active" || j.Status === "in_progress" || j.Status === "delivered").length +
    serviceOrders.filter((order) => order.Status === "pending" || order.Status === "active" || order.Status === "delivered").length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
          <p className="text-gray-600">Manage your services, jobs, and earnings</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">{totalEarnings}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{completedJobs}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{userInfo?.Rating || 0}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{activeOrders}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#F7931E]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Button className="h-auto py-4 bg-[#F7931E] hover:bg-[#F7931E]/90" onClick={() => navigate("/provider/create-service")}>
            <Plus className="mr-2 h-5 w-5" />
            Create New Service
          </Button>
          <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/provider/tasks")}>
            Browse Task Requests
          </Button>
          <Button variant="outline" className="h-auto py-4" onClick={() => navigate(`/providers/${userInfo?._id}`)}>
            View My Profile
          </Button>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">My Services</TabsTrigger>
            <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : myServices.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-500 mb-4">No services created yet</p>
                  <Button className="bg-[#F7931E] hover:bg-[#F7931E]/90" onClick={() => navigate("/provider/create-service")}>
                    Create Your First Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {myServices.map((service) => (
                  <Card key={service._id} className="hover:shadow-md transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{service.Title}</CardTitle>
                          </div>
                          <Badge variant="secondary">{service.Category}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#F7931E]">{service.Price} SAR</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Reviews</p>
                          <span className="font-medium">{service.ReviewCount || 0}</span>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Rating</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-[#F7931E] text-[#F7931E]" />
                            <span className="font-medium">{service.AverageRating || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => navigate(`/provider/edit-service/${service._id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => navigate(`/services/${service._id}`)}>
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : activeJobs.length === 0 && serviceOrders.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-500">No active jobs yet</p>
                  <p className="text-sm text-gray-400 mt-2">Submit proposals or receive service orders to get hired</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {serviceOrders.map((order) => (
                  <Card key={order._id} className="hover:shadow-md transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">
                              {order.ServiceID?.Title || "Service Order"}
                            </CardTitle>
                            <StatusBadge status={order.Status} />
                          </div>
                          <CardDescription>
                            Client: {order.ClientID?.Name || "Client"}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#F7931E]">{order.Price} SAR</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">
                          Delivery: {order.DeliveryTime}
                        </span>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {order.ServiceID?._id && (
                          <Button variant="outline" onClick={() => navigate(`/services/${order.ServiceID._id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Service
                          </Button>
                        )}
                        {order.Status === "pending" && (
                          <Button
                            className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                            onClick={() => handleServiceOrderStatus(order._id, "active")}
                          >
                            Accept Order
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(
                              order.ClientID?._id
                                ? `/messages?user=${order.ClientID._id}`
                                : "/messages",
                            )
                          }
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message Client
                        </Button>
                        {order.Status === "active" && (
                          <Button
                            className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                            onClick={() => handleServiceOrderStatus(order._id, "delivered")}
                          >
                            Mark as Delivered
                          </Button>
                        )}
                        {order.Status === "delivered" && (
                          <Button variant="outline" disabled>
                            Awaiting Client Approval
                          </Button>
                        )}
                        {(order.Status === "pending" || order.Status === "active") && (
                          <Button
                            variant="outline"
                            onClick={() => handleServiceOrderStatus(order._id, "cancelled")}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {activeJobs.map((job) => (
                  <Card key={job._id} className="hover:shadow-md transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">
                              {job.ProposalID?.TaskID?.Title || job.TaskID?.Title || "Job"}
                            </CardTitle>
                            <StatusBadge status={job.Status} />
                          </div>
                          <CardDescription>
                            Client: {job.ClientID?.Name || job.ProposalID?.TaskID?.ClientID?.Name}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#F7931E]">{job.AgreedAmount} SAR</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">
                          Deadline: {job.Status === "delivered" ? DELIVERED_DEADLINE_LABEL : new Date(job.DeliveryDate || job.Deadline).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button className="bg-[#F7931E] hover:bg-[#F7931E]/90" onClick={() => navigate(`/client/jobs/${job._id}`)}>
                          Open Workspace
                        </Button>
                        {job.ClientID?._id && (
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/messages?user=${job.ClientID._id}`)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message Client
                          </Button>
                        )}
                        {job.Status === "active" && (
                          <Button variant="outline" onClick={() => handleMarkAsDelivered(job._id)}>
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
