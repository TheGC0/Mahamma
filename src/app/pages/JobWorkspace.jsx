import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { StatusBadge } from "../components/StatusBadge";
import { StarRating } from "../components/StarRating";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Send,
  CheckCircle,
  Star,
  Clock,
  AlertTriangle,
  MessageSquare as MessageIcon,
  Package,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import {
  createConversation,
  createReport,
  createReview,
  getContractById,
  getConversationMessages,
  sendConversationMessage,
  updateContractStatus,
} from "../../lib/api";

export function JobWorkspace() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [message, setMessage] = useState("");
  const [workspaceConversationId, setWorkspaceConversationId] = useState("");
  const [workspaceMessages, setWorkspaceMessages] = useState([]);
  const [isLoadingWorkspaceMessages, setIsLoadingWorkspaceMessages] = useState(false);
  const [isSendingWorkspaceMessage, setIsSendingWorkspaceMessage] = useState(false);
  const [isSendingHelpRequest, setIsSendingHelpRequest] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    Type: "Quality Issue",
    OtherType: "",
    Severity: "medium",
    Description: "",
  });
  const [supportMessage, setSupportMessage] = useState("");

  const providerId = job?.ProviderID?._id || job?.ProposalID?.FreelancerID?._id || "";
  const clientId = job?.ClientID?._id || "";
  const currentUserId = userInfo?._id || userInfo?.id || "";
  const currentRole = (userInfo?.Role || userInfo?.role || "").toLowerCase();
  const roleSaysProvider = currentRole === "provider" || currentRole === "freelancer";
  const roleSaysClient = currentRole === "client";
  const idsMatch = (left, right) => Boolean(left && right && String(left) === String(right));
  const isProviderUser =
    idsMatch(providerId, currentUserId) ||
    (roleSaysProvider && !idsMatch(clientId, currentUserId));
  const isClientUser =
    idsMatch(clientId, currentUserId) ||
    (roleSaysClient && !idsMatch(providerId, currentUserId));
  const otherUserId = isProviderUser ? clientId : providerId;
  const providerName = job?.ProviderID?.Name || job?.ProposalID?.FreelancerID?.Name || "Provider";
  const clientName = job?.ClientID?.Name || "Client";
  const partnerName = isProviderUser ? clientName : providerName;
  const partnerRoleLabel = isProviderUser ? "client" : "freelancer";
  const taskTitle = job?.TaskID?.Title || job?.ProposalID?.TaskID?.Title || "Job";
  const jobDeliveryDate = job?.DeliveryDate || job?.Deadline;

  useEffect(() => {
    if (!userInfo) { navigate("/login"); return; }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const contract = await getContractById(jobId);
        setJob(contract);
      } catch (err) {
        setError(err.message || "Failed to load workspace.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  useEffect(() => {
    if (!userInfo || !otherUserId) {
      setWorkspaceConversationId("");
      setWorkspaceMessages([]);
      return;
    }

    let isMounted = true;

    const loadWorkspaceMessages = async ({ showLoader = false } = {}) => {
      try {
        if (showLoader) setIsLoadingWorkspaceMessages(true);
        const conversation = await createConversation(otherUserId);
        const messages = await getConversationMessages(conversation._id);
        if (!isMounted) return;

        setWorkspaceConversationId(conversation._id);
        setWorkspaceMessages(messages);
      } catch (err) {
        if (isMounted) {
          toast.error(err.message || "Failed to load workspace messages.");
        }
      } finally {
        if (isMounted && showLoader) setIsLoadingWorkspaceMessages(false);
      }
    };

    loadWorkspaceMessages({ showLoader: true });
    const intervalId = window.setInterval(() => {
      loadWorkspaceMessages();
    }, 10000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [otherUserId, userInfo?._id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "in_progress": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "delivered": return "bg-[#F7931E]";
      default: return "bg-gray-300";
    }
  };

  const getProgressIndex = (status) => {
    switch (status) {
      case "delivered": return 2;
      case "completed": return 3;
      case "cancelled": return 1;
      case "active":
      default: return 1;
    }
  };

  const progressIndex = job ? getProgressIndex(job.Status) : 0;

  const timelineEvents = job ? [
    { status: "active", label: "Open", date: new Date(job.createdAt).toLocaleDateString(), completed: progressIndex >= 0 },
    { status: "active", label: "In Progress", date: new Date(job.createdAt).toLocaleDateString(), completed: progressIndex >= 1 },
    {
      status: "delivered",
      label: "Delivered",
      date: job.Status === "delivered" || job.Status === "completed" ? new Date(job.updatedAt).toLocaleDateString() : null,
      completed: progressIndex >= 2,
    },
    {
      status: "completed",
      label: "Completed",
      date: job.Status === "completed" ? new Date(job.updatedAt).toLocaleDateString() : null,
      completed: progressIndex >= 3,
    },
  ] : [];

  const handleUpdateProgress = async (Status) => {
    try {
      setIsUpdatingProgress(true);
      await updateContractStatus(jobId, Status);
      const refreshed = await getContractById(jobId);
      setJob(refreshed);
      const messages = {
        delivered: "Progress updated to delivered.",
        cancelled: "Job cancelled.",
      };
      toast.success(messages[Status] || "Progress updated.");
    } catch (err) {
      toast.error(err.message || "Failed to update progress.");
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      setIsSubmittingReview(true);
      await updateContractStatus(jobId, "completed");
      await createReview(jobId, {
        Score: review.rating,
        Comment: review.comment,
      });
      setShowReviewSuccess(true);
      setTimeout(() => navigate("/client/dashboard"), 2000);
    } catch (err) {
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSendWorkspaceMessage = async () => {
    const body = message.trim();

    if (!body || !otherUserId || isSendingWorkspaceMessage) return;

    try {
      setIsSendingWorkspaceMessage(true);
      let conversationId = workspaceConversationId;
      if (!conversationId) {
        const conversation = await createConversation(otherUserId);
        conversationId = conversation._id;
        setWorkspaceConversationId(conversation._id);
      }
      const sent = await sendConversationMessage(conversationId, body);
      setWorkspaceMessages((current) => [...current, sent]);
      setMessage("");
      toast.success("Message sent.");
    } catch (err) {
      toast.error(err.message || "Failed to send message.");
    } finally {
      setIsSendingWorkspaceMessage(false);
    }
  };

  const handleReportIssue = async () => {
    const description = reportForm.Description.trim();
    const otherType = reportForm.OtherType.trim();
    const issueTypeLabel = reportForm.Type === "Other" ? `Other - ${otherType}` : reportForm.Type;

    if (reportForm.Type === "Other" && !otherType) {
      toast.error("Please write the other issue type.");
      return;
    }

    if (!description) {
      toast.error("Please describe what happened.");
      return;
    }

    try {
      setIsSendingHelpRequest(true);
      await createReport({
        RespondentID: otherUserId || undefined,
        ContractID: job._id,
        Type: reportForm.Type,
        Severity: reportForm.Severity,
        Description: `Workspace "${taskTitle}" report from ${userInfo?.Name || "a user"}. Issue type: ${issueTypeLabel}. Details: ${description}`,
      });
      setIsReportDialogOpen(false);
      setReportForm({ Type: "Quality Issue", OtherType: "", Severity: "medium", Description: "" });
      toast.success("Report sent to the support team.");
    } catch (err) {
      toast.error(err.message || "Failed to send report.");
    } finally {
      setIsSendingHelpRequest(false);
    }
  };

  const handleContactSupport = async () => {
    const description = supportMessage.trim();
    if (!description) {
      toast.error("Please write your support request.");
      return;
    }

    try {
      setIsSendingHelpRequest(true);
      await createReport({
        RespondentID: otherUserId || undefined,
        ContractID: job._id,
        Type: "Other",
        Severity: "low",
        Description: `Support request from workspace "${taskTitle}" by ${userInfo?.Name || "a user"}: ${description}`,
      });
      setIsSupportDialogOpen(false);
      setSupportMessage("");
      toast.success("Support request sent.");
    } catch (err) {
      toast.error(err.message || "Failed to contact support.");
    } finally {
      setIsSendingHelpRequest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />
        <div className="flex items-center justify-center py-32 text-gray-500">Loading workspace...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />
        <div className="flex items-center justify-center py-32 text-red-500">{error || "Job not found."}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(isProviderUser ? "/provider/dashboard" : "/client/dashboard")}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{taskTitle}</h1>
              <p className="text-gray-600">Working with {partnerName}</p>
            </div>
            <StatusBadge status={job.Status} />
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Project Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
              <div className="flex items-start justify-between">
                {timelineEvents.map((event, index) => (
                  <div key={`${event.status}-${event.label}`} className="flex flex-col items-center flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.completed ? getStatusColor(event.status) : "bg-gray-300"} transition-all z-10 relative`}>
                        {event.completed ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                      <span className={`font-medium mt-2 text-center ${event.completed ? "text-gray-900" : "text-gray-400"}`}>
                        {event.label}
                      </span>
                      {event.date && (
                        <span className="text-xs text-gray-500 mt-1 text-center">{event.date}</span>
                      )}
                    </div>
                    {index < timelineEvents.length - 1 && (
                      <div
                        className={`absolute h-1 ${event.completed && timelineEvents[index + 1].completed ? getStatusColor(event.status) : "bg-gray-300"}`}
                        style={{ top: "20px", left: "50%", right: "-50%", transform: "translateY(-50%)" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {job.Status !== "completed" && job.Status !== "cancelled" && (
              <div className="mt-8 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Current progress: {job.Status === "active" ? "In Progress" : job.Status}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isProviderUser
                      ? "Update the job when the work is ready for client review."
                      : "The freelancer controls delivery; you complete it after review."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isProviderUser && job.Status === "active" && (
                    <Button
                      className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                      onClick={() => handleUpdateProgress("delivered")}
                      disabled={isUpdatingProgress}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Mark as Delivered
                    </Button>
                  )}
                  {(job.Status === "active" || job.Status === "delivered") && (
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateProgress("cancelled")}
                      disabled={isUpdatingProgress}
                    >
                      Cancel Job
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="chat">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="chat">
                  <MessageIcon className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>Communicate with your {partnerRoleLabel}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
                      {isLoadingWorkspaceMessages ? (
                        <p className="text-center text-sm text-gray-400">Loading messages...</p>
                      ) : workspaceMessages.length === 0 ? (
                        <p className="text-center text-sm text-gray-400">No messages yet. Start the conversation!</p>
                      ) : (
                        workspaceMessages.map((workspaceMessage) => {
                          const senderId = workspaceMessage.SenderID?._id || workspaceMessage.SenderID;
                          const isMine = senderId === userInfo?._id;

                          return (
                            <div key={workspaceMessage._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${isMine ? "bg-[#F7931E] text-white" : "bg-white border border-gray-200 text-gray-900"}`}>
                                {!isMine && (
                                  <p className="mb-1 text-xs font-semibold text-gray-500">
                                    {workspaceMessage.SenderID?.Name || partnerName}
                                  </p>
                                )}
                                <p className="whitespace-pre-wrap break-words">{workspaceMessage.Body}</p>
                                <p className={`mt-1 text-right text-xs ${isMine ? "text-white/70" : "text-gray-400"}`}>
                                  {new Date(workspaceMessage.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            handleSendWorkspaceMessage();
                          }
                        }}
                        rows={2}
                      />
                      <Button
                        className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                        onClick={handleSendWorkspaceMessage}
                        disabled={!message.trim() || !otherUserId || isSendingWorkspaceMessage}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    {otherUserId && (
                      <Button
                        variant="link"
                        className="mt-2 h-auto p-0 text-[#F7931E]"
                        onClick={() =>
                          navigate(
                            workspaceConversationId
                              ? `/messages?conversation=${workspaceConversationId}`
                              : `/messages?user=${otherUserId}`,
                          )
                        }
                      >
                        Open full chat
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {job.Status === "delivered" && (
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Delivery Complete
                  </CardTitle>
                  <CardDescription>
                    {isClientUser
                      ? "The freelancer has marked this job as delivered. Please review the work and provide feedback."
                      : "The work has been delivered and is waiting for the client to review it."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isClientUser ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve & Complete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        {showReviewSuccess ? (
                          <div className="text-center py-8">
                            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                              <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h3>
                            <p className="text-gray-600">Thank you for your feedback. The job is now complete.</p>
                          </div>
                        ) : (
                          <>
                            <DialogHeader>
                              <DialogTitle>Submit Review</DialogTitle>
                              <DialogDescription>Rate your experience with {providerName}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Rating *</Label>
                                <div className="flex gap-2 justify-center p-4 bg-gray-50 rounded-lg">
                                  {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                      key={rating}
                                      onClick={() => setReview({ ...review, rating })}
                                      className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                      <Star className={`h-10 w-10 ${rating <= review.rating ? "fill-[#F7931E] text-[#F7931E]" : "fill-gray-200 text-gray-200"}`} />
                                    </button>
                                  ))}
                                </div>
                                <p className="text-center text-sm font-medium text-gray-700">
                                  {review.rating === 5 ? "Excellent!" : review.rating === 4 ? "Good" : review.rating === 3 ? "Average" : review.rating === 2 ? "Below Average" : "Poor"}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label>Review Comment *</Label>
                                <Textarea
                                  placeholder="Share your experience working with this freelancer..."
                                  value={review.comment}
                                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                                  rows={4}
                                />
                              </div>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-900">Your review will be visible on the provider's profile.</p>
                              </div>
                              <Button
                                className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                                onClick={handleSubmitReview}
                                disabled={!review.comment.trim() || isSubmittingReview}
                              >
                                {isSubmittingReview ? "Submitting..." : "Submit Review & Complete Job"}
                              </Button>
                            </div>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="rounded-lg border border-green-200 bg-white p-4 text-sm text-green-800">
                      Waiting for the client to approve the delivery.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {job.Status === "completed" && (
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Job Completed
                  </CardTitle>
                  <CardDescription>This job has been successfully completed. Thank you for using Mahamma!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-sm text-gray-700 mb-2"><strong>Your Rating:</strong></p>
                    <StarRating rating={5} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-2xl font-bold text-[#F7931E]">{job.AgreedAmount} SAR</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Deadline</p>
                  <p className="font-medium">
                    {jobDeliveryDate
                      ? new Date(jobDeliveryDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Started</p>
                  <p className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{isProviderUser ? "Client" : "Provider"}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-gradient-to-br from-[#F7931E] to-orange-600 rounded-full p-4 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{partnerName[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{partnerName}</h3>
                    {!isProviderUser && <StarRating rating={job.ProviderID?.Rating || 0} />}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isProviderUser ? !clientId : !providerId}
                  onClick={() =>
                    isProviderUser
                      ? navigate(
                          workspaceConversationId
                            ? `/messages?conversation=${workspaceConversationId}`
                            : `/messages?user=${clientId}`,
                        )
                      : navigate(`/providers/${providerId}`)
                  }
                >
                  {isProviderUser ? "Message Client" : "View Profile"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader><CardTitle className="text-lg">Need Help?</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report an Issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Report an Issue</DialogTitle>
                      <DialogDescription>
                        Send this job to the support team for review.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Issue Type</Label>
                          <select
                            className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                            value={reportForm.Type}
                            onChange={(event) =>
                              setReportForm((current) => ({
                                ...current,
                                Type: event.target.value,
                                OtherType: event.target.value === "Other" ? current.OtherType : "",
                              }))
                            }
                          >
                            <option value="Quality Issue">Quality Issue</option>
                            <option value="Payment Issue">Payment Issue</option>
                            <option value="Misconduct">Misconduct</option>
                            <option value="Dispute">Dispute</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Severity</Label>
                          <select
                            className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                            value={reportForm.Severity}
                            onChange={(event) =>
                              setReportForm((current) => ({
                                ...current,
                                Severity: event.target.value,
                              }))
                            }
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>
                      {reportForm.Type === "Other" && (
                        <div className="space-y-2">
                          <Label>Other Issue Type</Label>
                          <Input
                            placeholder="Example: Missing files, unclear request, account problem..."
                            value={reportForm.OtherType}
                            onChange={(event) =>
                              setReportForm((current) => ({
                                ...current,
                                OtherType: event.target.value,
                              }))
                            }
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label>What happened?</Label>
                        <Textarea
                          placeholder="Describe the issue clearly..."
                          value={reportForm.Description}
                          onChange={(event) =>
                            setReportForm((current) => ({
                              ...current,
                              Description: event.target.value,
                            }))
                          }
                          rows={5}
                        />
                      </div>
                      <Button
                        className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                        onClick={handleReportIssue}
                        disabled={isSendingHelpRequest}
                      >
                        {isSendingHelpRequest ? "Sending..." : "Submit Report"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isSupportDialogOpen} onOpenChange={setIsSupportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white"
                    >
                      <MessageIcon className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Contact Support</DialogTitle>
                      <DialogDescription>
                        Tell support what you need help with on this job.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                          placeholder="Write your support request..."
                          value={supportMessage}
                          onChange={(event) => setSupportMessage(event.target.value)}
                          rows={5}
                        />
                      </div>
                      <Button
                        className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                        onClick={handleContactSupport}
                        disabled={isSendingHelpRequest}
                      >
                        {isSendingHelpRequest ? "Sending..." : "Send Support Request"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
