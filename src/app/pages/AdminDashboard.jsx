import { useState } from "react";
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
import {
  Users,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Shield,
  Eye,
  MessageSquare,
  FileText,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";

export function AdminDashboard() {
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([
    {
      id: "1",
      name: "Design",
      description: "Graphic design, UI/UX, branding, and visual content",
      count: 145,
      active: true,
    },
    {
      id: "2",
      name: "Programming",
      description: "Web development, mobile apps, and software solutions",
      count: 123,
      active: true,
    },
    {
      id: "3",
      name: "Video Editing",
      description: "Video production, editing, and post-production services",
      count: 87,
      active: true,
    },
    {
      id: "4",
      name: "Device Fixing",
      description: "Hardware repair and technical support",
      count: 65,
      active: true,
    },
    {
      id: "5",
      name: "Translation",
      description: "Language translation and localization services",
      count: 54,
      active: true,
    },
    {
      id: "6",
      name: "Other",
      description: "Miscellaneous services",
      count: 49,
      active: true,
    },
  ]);

  const stats = {
    totalUsers: 523,
    pendingVerifications: 12,
    activeJobs: 45,
    completionRate: 94,
    disputeRate: 2,
  };

  const pendingUsers = [
    {
      id: "1",
      name: "Mohammed Al-Salem",
      email: "s202112345@kfupm.edu.sa",
      role: "Provider",
      date: "2026-02-20",
      studentId: "S202112345",
      phone: "+966 50 123 4567",
    },
    {
      id: "2",
      name: "Fatima Al-Harbi",
      email: "s202112346@kfupm.edu.sa",
      role: "Client",
      date: "2026-02-20",
      studentId: "S202112346",
      phone: "+966 55 234 5678",
    },
    {
      id: "3",
      name: "Omar Al-Qahtani",
      email: "s202112347@kfupm.edu.sa",
      role: "Provider",
      date: "2026-02-19",
      studentId: "S202112347",
      phone: "+966 56 345 6789",
    },
  ];

  const reportedIssues = [
    {
      id: "1",
      type: "Dispute",
      reporter: "Ali Al-Mutairi",
      reporterRole: "Client",
      respondent: "Khaled Al-Dosari",
      job: "Website Development",
      jobId: "j123",
      status: "pending",
      date: "2026-02-19",
      description:
        "The freelancer did not deliver the agreed features. Missing responsive design and contact form functionality.",
      evidence: ["screenshots.zip", "original-agreement.pdf"],
      severity: "high",
    },
    {
      id: "2",
      type: "Quality Issue",
      reporter: "Sara Mohammed",
      reporterRole: "Client",
      respondent: "Ahmed Al-Ghamdi",
      job: "Logo Design",
      jobId: "j124",
      status: "reviewing",
      date: "2026-02-18",
      description:
        "Logo quality is below professional standards. Resolution is too low for print use.",
      evidence: ["logo-files.zip"],
      severity: "medium",
    },
    {
      id: "3",
      type: "Payment Issue",
      reporter: "Nasser Al-Zahrani",
      reporterRole: "Provider",
      respondent: "Yousef Al-Mutairi",
      job: "Video Editing",
      jobId: "j125",
      status: "pending",
      date: "2026-02-17",
      description:
        "Client approved the work but has not released payment after 3 days.",
      evidence: ["delivery-confirmation.pdf", "chat-logs.pdf"],
      severity: "high",
    },
    {
      id: "4",
      type: "Misconduct",
      reporter: "Layla Ibrahim",
      reporterRole: "Client",
      respondent: "Faisal Al-Harbi",
      job: "Content Writing",
      jobId: "j126",
      status: "resolved",
      date: "2026-02-15",
      description: "Freelancer used inappropriate language in chat messages.",
      evidence: ["chat-screenshots.png"],
      severity: "medium",
      resolution:
        "Warning issued to provider. Client refunded 50%. Provider account under review.",
    },
  ];

  const selectedIssue = reportedIssues.find((i) => i.id === selectedDispute);

  const userGrowthData = [
    { month: "Sep", users: 120 },
    { month: "Oct", users: 180 },
    { month: "Nov", users: 280 },
    { month: "Dec", users: 350 },
    { month: "Jan", users: 450 },
    { month: "Feb", users: 523 },
  ];

  const categoryData = categories.map((cat) => ({
    category: cat.name,
    count: cat.count,
  }));

  const handleApproveUser = (userId) => {
    // Mock approval
    console.log("Approved user:", userId);
  };

  const handleRejectUser = (userId) => {
    // Mock rejection
    console.log("Rejected user:", userId);
  };

  const handleResolveDispute = (disputeId, resolution) => {
    // Mock resolution
    console.log("Resolved dispute:", disputeId, resolution);
    setShowResolveDialog(false);
    setSelectedDispute(null);
    setAdminNotes("");
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleAddCategory = () => {
    const newCategory = {
      id: (categories.length + 1).toString(),
      name: categoryForm.name,
      description: categoryForm.description,
      count: 0,
      active: true,
    };
    setCategories([...categories, newCategory]);
    setShowCategoryDialog(false);
    setCategoryForm({ name: "", description: "" });
  };

  const handleEditCategory = (id) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === id) {
        return {
          ...cat,
          name: categoryForm.name,
          description: categoryForm.description,
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
    setShowCategoryDialog(false);
    setCategoryForm({ name: "", description: "" });
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id) => {
    const updatedCategories = categories.filter((cat) => cat.id !== id);
    setCategories(updatedCategories);
  };

  const handleOpenCategoryDialog = (id) => {
    if (id) {
      const category = categories.find((cat) => cat.id === id);
      if (category) {
        setCategoryForm({
          name: category.name,
          description: category.description,
        });
        setEditingCategory(id);
      }
    } else {
      setCategoryForm({ name: "", description: "" });
      setEditingCategory(null);
    }
    setShowCategoryDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} userRole="admin" userName="Admin" />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, moderate content, and monitor platform health
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.pendingVerifications}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-[#F7931E]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.activeJobs}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completion</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.completionRate}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Disputes</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.disputeRate}%
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="verification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="verification">
              <Shield className="h-4 w-4 mr-2" />
              User Verification ({stats.pendingVerifications})
            </TabsTrigger>
            <TabsTrigger value="reports">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Reports & Disputes (
              {reportedIssues.filter((i) => i.status !== "resolved").length})
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          {/* User Verification Tab */}
          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verifications</CardTitle>
                <CardDescription>
                  Review and approve new user registrations from KFUPM students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <Card
                      key={user.id}
                      className="border-2 hover:border-[#F7931E] transition-colors"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-200 rounded-full p-3">
                                <Users className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {user.name}
                                </h3>
                                <Badge variant="secondary">{user.role}</Badge>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                              <div>
                                <p className="text-xs text-gray-600 mb-1">
                                  Email
                                </p>
                                <p className="text-sm font-medium">
                                  {user.email}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">
                                  Student ID
                                </p>
                                <p className="text-sm font-medium">
                                  {user.studentId}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">
                                  Phone
                                </p>
                                <p className="text-sm font-medium">
                                  {user.phone}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">
                                  Registration Date
                                </p>
                                <p className="text-sm font-medium">
                                  {user.date}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveUser(user.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectUser(user.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports & Disputes Tab */}
          <TabsContent value="reports">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Reports List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Reported Issues</CardTitle>
                    <CardDescription>Click to view details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {reportedIssues.map((issue) => (
                        <div
                          key={issue.id}
                          onClick={() => setSelectedDispute(issue.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedDispute === issue.id
                              ? "border-[#F7931E] bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {issue.type}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                issue.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : issue.status === "reviewing"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {issue.status}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-sm mb-1">
                            {issue.job}
                          </h4>
                          <p className="text-xs text-gray-600">
                            Reported by {issue.reporter}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {issue.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Dispute Detail Section */}
              <div className="lg:col-span-2">
                {selectedIssue ? (
                  <Card className="border-2 border-[#F7931E]">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl mb-2">
                            {selectedIssue.job}
                          </CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              {selectedIssue.type}
                            </Badge>
                            <Badge
                              className={getSeverityColor(
                                selectedIssue.severity,
                              )}
                            >
                              {selectedIssue.severity} priority
                            </Badge>
                            <Badge
                              className={
                                selectedIssue.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : selectedIssue.status === "reviewing"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                              }
                            >
                              {selectedIssue.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Parties Involved */}
                      <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Reporter</p>
                          <p className="font-semibold">
                            {selectedIssue.reporter}
                          </p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {selectedIssue.reporterRole}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Respondent
                          </p>
                          <p className="font-semibold">
                            {selectedIssue.respondent}
                          </p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {selectedIssue.reporterRole === "Client"
                              ? "Provider"
                              : "Client"}
                          </Badge>
                        </div>
                      </div>

                      {/* Issue Details */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Issue Description
                        </h4>
                        <p className="text-gray-700 bg-white p-4 rounded-lg border leading-relaxed">
                          {selectedIssue.description}
                        </p>
                      </div>

                      {/* Evidence */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Evidence Submitted
                        </h4>
                        <div className="space-y-2">
                          {selectedIssue.evidence.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-white border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-gray-600" />
                                <span className="text-sm font-medium">
                                  {file}
                                </span>
                              </div>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Job Information */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold mb-2 text-blue-900">
                          Job Information
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-blue-700">Job ID:</span>
                            <span className="ml-2 font-medium">
                              {selectedIssue.jobId}
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-700">Reported:</span>
                            <span className="ml-2 font-medium">
                              {selectedIssue.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Resolution (if resolved) */}
                      {selectedIssue.resolution && (
                        <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                          <h4 className="font-semibold mb-2 text-green-900 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Resolution
                          </h4>
                          <p className="text-green-800">
                            {selectedIssue.resolution}
                          </p>
                        </div>
                      )}

                      {/* Admin Actions */}
                      {selectedIssue.status !== "resolved" && (
                        <div className="space-y-3 pt-4 border-t">
                          <h4 className="font-semibold">Admin Actions</h4>
                          <div className="flex gap-2">
                            <Dialog
                              open={showResolveDialog}
                              onOpenChange={setShowResolveDialog}
                            >
                              <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => setShowResolveDialog(true)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Resolve Dispute
                              </Button>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Resolve Dispute</DialogTitle>
                                  <DialogDescription>
                                    Provide your resolution decision and notes
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Resolution Notes *</Label>
                                    <Textarea
                                      placeholder="Explain your decision and any actions taken..."
                                      value={adminNotes}
                                      onChange={(e) =>
                                        setAdminNotes(e.target.value)
                                      }
                                      rows={5}
                                    />
                                  </div>
                                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-sm text-yellow-900">
                                      ⚠️ Both parties will be notified of your
                                      decision
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                      onClick={() =>
                                        handleResolveDispute(
                                          selectedIssue.id,
                                          adminNotes,
                                        )
                                      }
                                      disabled={!adminNotes.trim()}
                                    >
                                      Resolve & Close
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setShowResolveDialog(false)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button variant="outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Contact Parties
                            </Button>

                            <Button variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View Job Details
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        Select an issue to view details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  User Growth
                </CardTitle>
                <CardDescription>
                  Total registered users over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#F7931E"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Job distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#F7931E" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Category Management</CardTitle>
                <CardDescription>
                  Manage service and task categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <h3 className="font-semibold">{cat.name}</h3>
                        <p className="text-sm text-gray-600">
                          {cat.count} jobs in this category
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenCategoryDialog(cat.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCategory(cat.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          View All
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                    onClick={() => handleOpenCategoryDialog(null)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Category Dialog */}
            <Dialog
              open={showCategoryDialog}
              onOpenChange={setShowCategoryDialog}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCategory
                      ? "Update the category details"
                      : "Enter the new category details"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      placeholder="Category name"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea
                      placeholder="Category description"
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() =>
                      editingCategory
                        ? handleEditCategory(editingCategory)
                        : handleAddCategory()
                    }
                    disabled={
                      !categoryForm.name.trim() ||
                      !categoryForm.description.trim()
                    }
                  >
                    {editingCategory ? "Update Category" : "Add Category"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCategoryDialog(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
