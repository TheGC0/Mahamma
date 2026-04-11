import { useState } from "react";
import { useNavigate, useParams } from "react-router";
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
  Upload,
  Download,
  CheckCircle,
  Star,
  FileText,
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

export function JobWorkspace() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [message, setMessage] = useState("");
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [revisionNote, setRevisionNote] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  // Mock job data - can change status to test different states
  const job = {
    id: jobId,
    title: "Logo Design for Startup",
    status: "delivered", // Change to 'in_progress', 'delivered', or 'completed' to test
    provider: {
      id: "p1",
      name: "Ahmed Al-Otaibi",
      rating: 4.9,
      avatar: null,
    },
    client: {
      name: "Abdullah Al-Shammari",
    },
    price: 400,
    deadline: "2026-02-25",
    createdAt: "2026-02-18",
    description: "Modern, minimalist logo for tech startup",
  };

  const messages = [
    {
      id: "1",
      sender: "Ahmed Al-Otaibi",
      content:
        "Hi! I've started working on your logo. Do you have any specific color preferences?",
      timestamp: "2 hours ago",
      isProvider: true,
    },
    {
      id: "2",
      sender: "Abdullah Al-Shammari",
      content: "Yes, please use orange (#F7931E) as the primary color. Thanks!",
      timestamp: "1 hour ago",
      isProvider: false,
    },
    {
      id: "3",
      sender: "Ahmed Al-Otaibi",
      content:
        "Perfect! I'll incorporate that. Will send the first draft soon.",
      timestamp: "45 min ago",
      isProvider: true,
    },
    {
      id: "4",
      sender: "Ahmed Al-Otaibi",
      content:
        "I've uploaded the first draft. Please let me know your thoughts!",
      timestamp: "30 min ago",
      isProvider: true,
    },
    {
      id: "5",
      sender: "Abdullah Al-Shammari",
      content: "Looks great! Could you make the text slightly larger?",
      timestamp: "15 min ago",
      isProvider: false,
    },
    {
      id: "6",
      sender: "Ahmed Al-Otaibi",
      content: "Done! Final version uploaded with all source files.",
      timestamp: "5 min ago",
      isProvider: true,
    },
  ];

  const files = [
    {
      id: "1",
      name: "logo-draft-v1.png",
      uploadedBy: "Ahmed Al-Otaibi",
      timestamp: "30 min ago",
      size: "2.4 MB",
      type: "image",
    },
    {
      id: "2",
      name: "logo-draft-v2.png",
      uploadedBy: "Ahmed Al-Otaibi",
      timestamp: "20 min ago",
      size: "2.6 MB",
      type: "image",
    },
    {
      id: "3",
      name: "logo-final.ai",
      uploadedBy: "Ahmed Al-Otaibi",
      timestamp: "10 min ago",
      size: "8.2 MB",
      type: "file",
    },
    {
      id: "4",
      name: "logo-final.png",
      uploadedBy: "Ahmed Al-Otaibi",
      timestamp: "10 min ago",
      size: "3.1 MB",
      type: "image",
    },
    {
      id: "5",
      name: "brand-guidelines.pdf",
      uploadedBy: "Ahmed Al-Otaibi",
      timestamp: "10 min ago",
      size: "1.8 MB",
      type: "document",
    },
    {
      id: "6",
      name: "requirements.pdf",
      uploadedBy: "Abdullah Al-Shammari",
      timestamp: "2 hours ago",
      size: "890 KB",
      type: "document",
    },
  ];

  // Timeline events based on status
  const timelineEvents = [
    {
      status: "created",
      label: "Open",
      date: "Feb 18, 2026 10:30 AM",
      completed: true,
    },
    {
      status: "started",
      label: "In Progress",
      date: "Feb 18, 2026 11:00 AM",
      completed: true,
    },
    {
      status: "delivered",
      label: "Delivered",
      date:
        job.status === "delivered" || job.status === "completed"
          ? "Feb 20, 2026 2:00 PM"
          : null,
      completed: job.status === "delivered" || job.status === "completed",
    },
    {
      status: "completed",
      label: "Completed",
      date: job.status === "completed" ? "Feb 20, 2026 3:30 PM" : null,
      completed: job.status === "completed",
    },
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Mock send message
      setMessage("");
    }
  };

  const handleRequestRevision = () => {
    if (revisionNote.trim()) {
      // Mock revision request
      setRevisionNote("");
      navigate("/client/dashboard");
    }
  };

  const handleSubmitReview = () => {
    // Mock review submission
    setShowReviewSuccess(true);
    setTimeout(() => {
      navigate("/client/dashboard");
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "delivered":
        return "bg-[#F7931E]";
      case "in_progress":
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} userRole="client" userName="Abdullah" />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/client/dashboard")}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>
              <p className="text-gray-600">Working with {job.provider.name}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>
        </div>

        {/* Enhanced Status Timeline */}
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
                  <div
                    key={event.status}
                    className="flex flex-col items-center flex-1 relative"
                  >
                    {/* Circle and Label */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.completed
                            ? getStatusColor(event.status)
                            : "bg-gray-300"
                        } transition-all z-10 relative`}
                      >
                        {event.completed ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                      <span
                        className={`font-medium mt-2 text-center ${
                          event.completed ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {event.label}
                      </span>
                      {event.date && (
                        <span className="text-xs text-gray-500 mt-1 text-center">
                          {event.date}
                        </span>
                      )}
                    </div>

                    {/* Connector Line */}
                    {index < timelineEvents.length - 1 && (
                      <div
                        className={`absolute h-1 ${
                          event.completed && timelineEvents[index + 1].completed
                            ? getStatusColor(event.status)
                            : "bg-gray-300"
                        }`}
                        style={{
                          top: "20px",
                          left: "50%",
                          right: "-50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="chat">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">
                  <MessageIcon className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="files">
                  <Package className="h-4 w-4 mr-2" />
                  Files ({files.length})
                </TabsTrigger>
              </TabsList>

              {/* Chat Tab */}
              <TabsContent value="chat" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>
                      Communicate with your freelancer in real-time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Messages */}
                    <div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isProvider ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-md ${
                              msg.isProvider
                                ? "bg-white border border-gray-200"
                                : "bg-[#F7931E] text-white"
                            } rounded-lg p-4 shadow-sm`}
                          >
                            <p
                              className={`text-xs font-medium mb-1 ${
                                msg.isProvider
                                  ? "text-gray-600"
                                  : "text-white/80"
                              }`}
                            >
                              {msg.sender}
                            </p>
                            <p className="text-sm leading-relaxed">
                              {msg.content}
                            </p>
                            <p
                              className={`text-xs mt-2 ${
                                msg.isProvider
                                  ? "text-gray-500"
                                  : "text-white/70"
                              }`}
                            >
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={2}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />

                      <Button
                        className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                        onClick={handleSendMessage}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>File Exchange</CardTitle>
                    <CardDescription>
                      Share and download project files
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#F7931E] transition-colors cursor-pointer mb-6 bg-gray-50">
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Upload files
                        </p>
                        <p className="text-xs text-gray-500">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Any file type up to 50MB
                        </p>
                      </label>
                    </div>

                    {/* Files List */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700 mb-3">
                        All Files
                      </h4>
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#F7931E] transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 rounded-lg p-3">
                              <FileText className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-900">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {file.uploadedBy} • {file.timestamp} •{" "}
                                {file.size}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Delivery Actions */}
            {job.status === "delivered" && (
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Delivery Complete
                  </CardTitle>
                  <CardDescription>
                    The freelancer has marked this job as delivered. Please
                    review the work and provide feedback.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-3">
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
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Review Submitted!
                          </h3>
                          <p className="text-gray-600">
                            Thank you for your feedback. The job is now
                            complete.
                          </p>
                        </div>
                      ) : (
                        <>
                          <DialogHeader>
                            <DialogTitle>Submit Review</DialogTitle>
                            <DialogDescription>
                              Rate your experience with {job.provider.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Rating *</Label>
                              <div className="flex gap-2 justify-center p-4 bg-gray-50 rounded-lg">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    onClick={() =>
                                      setReview({ ...review, rating })
                                    }
                                    className="focus:outline-none transition-transform hover:scale-110"
                                  >
                                    <Star
                                      className={`h-10 w-10 ${
                                        rating <= review.rating
                                          ? "fill-[#F7931E] text-[#F7931E]"
                                          : "fill-gray-200 text-gray-200"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                              <p className="text-center text-sm font-medium text-gray-700">
                                {review.rating === 5
                                  ? "Excellent!"
                                  : review.rating === 4
                                    ? "Good"
                                    : review.rating === 3
                                      ? "Average"
                                      : review.rating === 2
                                        ? "Below Average"
                                        : "Poor"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label>Review Comment *</Label>
                              <Textarea
                                placeholder="Share your experience working with this freelancer. What did you like? What could be improved?"
                                value={review.comment}
                                onChange={(e) =>
                                  setReview({
                                    ...review,
                                    comment: e.target.value,
                                  })
                                }
                                rows={4}
                              />

                              <p className="text-xs text-gray-500">
                                Help other clients make informed decisions
                              </p>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm text-blue-900">
                                💡 Your review will be visible on the provider's
                                profile
                              </p>
                            </div>
                            <Button
                              className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                              onClick={handleSubmitReview}
                              disabled={!review.comment.trim()}
                            >
                              Submit Review & Complete Job
                            </Button>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Request Revision
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Revision</DialogTitle>
                        <DialogDescription>
                          Explain what changes you'd like the freelancer to make
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Revision Notes *</Label>
                          <Textarea
                            placeholder="Please be specific about what needs to be changed..."
                            value={revisionNote}
                            onChange={(e) => setRevisionNote(e.target.value)}
                            rows={5}
                          />
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-900">
                            ⚠️ The freelancer will be notified and the job
                            status will return to "In Progress"
                          </p>
                        </div>
                        <Button
                          className="w-full"
                          onClick={handleRequestRevision}
                          disabled={!revisionNote.trim()}
                        >
                          Send Revision Request
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}

            {/* Completed Status */}
            {job.status === "completed" && (
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Job Completed
                  </CardTitle>
                  <CardDescription>
                    This job has been successfully completed. Thank you for
                    using Mahamma!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Your Rating:</strong>
                    </p>
                    <StarRating rating={5} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-2xl font-bold text-[#F7931E]">
                    {job.price} SAR
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Deadline</p>
                  <p className="font-medium">February 25, 2026</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Started</p>
                  <p className="font-medium">February 18, 2026</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-sm text-gray-700">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle>Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-gradient-to-br from-[#F7931E] to-orange-600 rounded-full p-4 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {job.provider.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {job.provider.name}
                    </h3>
                    <StarRating rating={job.provider.rating} />
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/providers/${job.provider.id}`)}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => toast.info("Report has been sent to our safety team.")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report an Issue
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => toast.info("Connecting to support...")}
                >
                  <MessageIcon className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
