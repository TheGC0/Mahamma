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
  Briefcase,
  MessageSquare,
  Clock,
  FileText,
} from "lucide-react";
import {
  getMyContracts,
  getServiceOrders,
  getTasks,
  updateServiceOrderStatus,
} from "../../lib/api";

export function ClientDashboard() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [myRequests, setMyRequests] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) { navigate("/login"); return; }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tasks, contracts, orders] = await Promise.all([
          getTasks({ clientId: userInfo._id }),
          getMyContracts(),
          getServiceOrders(),
        ]);
        setMyRequests(tasks);
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

  const activeRequestsCount = myRequests.filter((r) => r.Status === "open").length;
  const ongoingJobsCount =
    activeJobs.filter((j) => j.Status === "active" || j.Status === "in_progress" || j.Status === "delivered").length +
    serviceOrders.filter((order) => order.Status === "pending" || order.Status === "active" || order.Status === "delivered").length;

  const handleCompleteServiceOrder = async (orderId) => {
    try {
      const updated = await updateServiceOrderStatus(orderId, "completed");
      setServiceOrders((orders) =>
        orders.map((order) => (order._id === orderId ? updated : order)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelServiceOrder = async (orderId) => {
    try {
      const updated = await updateServiceOrderStatus(orderId, "cancelled");
      setServiceOrders((orders) =>
        orders.map((order) => (order._id === orderId ? updated : order)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Dashboard</h1>
          <p className="text-gray-600">Manage your tasks, jobs, and freelancers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{activeRequestsCount}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{ongoingJobsCount}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{myRequests.length}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg">
                  ر.س
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Button className="h-auto py-4 bg-[#F7931E] hover:bg-[#F7931E]/90" onClick={() => navigate("/client/post-task")}>
            <Plus className="mr-2 h-5 w-5" />
            Post a New Task
          </Button>
          <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/services")}>
            Browse Services
          </Button>
          <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/messages")}>
            <MessageSquare className="mr-2 h-5 w-5" />
            Messages
          </Button>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : myRequests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-500 mb-4">No tasks posted yet</p>
                  <Button className="bg-[#F7931E] hover:bg-[#F7931E]/90" onClick={() => navigate("/client/post-task")}>
                    Post Your First Task
                  </Button>
                </CardContent>
              </Card>
            ) : (
              myRequests.map((request) => (
                <Card key={request._id} className="hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{request.Title}</CardTitle>
                          <StatusBadge status={request.Status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <Badge variant="outline">{request.Category}</Badge>
                          <span>{request.Budget} SAR</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {request.ProposalCount > 0 && (
                          <Badge className="bg-[#F7931E] hover:bg-[#F7931E]/90">
                            {request.ProposalCount} Offers
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                        onClick={() => navigate(`/client/request/${request._id}`)}
                      >
                        View Details
                      </Button>
                      <Button variant="outline" onClick={() => navigate(`/client/edit-task/${request._id}`)}>
                        Edit Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : activeJobs.length === 0 && serviceOrders.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-500">No active jobs yet</p>
                  <p className="text-sm text-gray-400 mt-2">Accept a proposal to start a job</p>
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
                            Provider: {order.ProviderID?.Name || "Provider"}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#F7931E]">{order.Price} SAR</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 text-sm text-gray-600">
                        Delivery: {order.DeliveryTime}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" onClick={() => navigate(`/services/${order.ServiceID?._id}`)}>
                          View Service
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(
                              order.ProviderID?._id
                                ? `/messages?user=${order.ProviderID._id}`
                                : "/messages",
                            )
                          }
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        {order.Status === "pending" && (
                          <Button
                            variant="outline"
                            onClick={() => handleCancelServiceOrder(order._id)}
                          >
                            Cancel Order
                          </Button>
                        )}
                        {order.Status === "active" && (
                          <Button variant="outline" disabled>
                            Waiting for Delivery
                          </Button>
                        )}
                        {order.Status === "delivered" && (
                          <Button
                            className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                            onClick={() => handleCompleteServiceOrder(order._id)}
                          >
                            Mark Completed
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
                            Provider: {job.ProviderID?.Name || job.ProposalID?.FreelancerID?.Name}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#F7931E]">{job.AgreedAmount} SAR</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                          onClick={() => navigate(`/client/jobs/${job._id}`)}
                        >
                          View Workspace
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(
                              job.ProviderID?._id
                                ? `/messages?user=${job.ProviderID._id}`
                                : "/messages",
                            )
                          }
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
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
