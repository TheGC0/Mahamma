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
import {
  Users,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Shield,
  FileText,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
  Briefcase,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
import {
  getTasks,
  getServices,
  getMyContracts,
  getAdminUsers,
  updateUserVerification,
  getAdminReports,
  updateReportStatus,
} from "../../lib/api";
import { categories as categoryList } from "../lib/mock-data";

const COLORS = ["#F7931E", "#3B82F6", "#10B981", "#8B5CF6", "#EF4444", "#F59E0B", "#06B6D4", "#84CC16", "#EC4899", "#6B7280"];

export function AdminDashboard() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  // Real data state
  const [stats, setStats] = useState({ totalTasks: 0, totalServices: 0, activeJobs: 0, completedJobs: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI state
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [localCategories, setLocalCategories] = useState([]);

  useEffect(() => {
    if (!userInfo) { navigate("/login"); return; }
    if (userInfo.Role !== "admin") { navigate("/client/dashboard"); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const [tasks, services, contracts, users, reportsData] = await Promise.all([
        getTasks(),
        getServices(),
        getMyContracts(),
        getAdminUsers(),
        getAdminReports(),
      ]);

      setStats({
        totalTasks: tasks.length,
        totalServices: services.length,
        activeJobs: contracts.filter((c) => c.Status === "in_progress" || c.Status === "delivered").length,
        completedJobs: contracts.filter((c) => c.Status === "completed").length,
      });

      setAllUsers(users);
      setReports(reportsData);

      const counts = {};
      categoryList.forEach((cat) => { counts[cat] = 0; });
      tasks.forEach((t) => { if (counts[t.Category] !== undefined) counts[t.Category]++; });
      services.forEach((s) => { if (counts[s.Category] !== undefined) counts[s.Category]++; });

      const catData = categoryList.map((name, i) => ({
        id: String(i + 1),
        name,
        description: "",
        count: counts[name] || 0,
      }));
      setCategoryData(catData);
      setLocalCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const pendingUsers = allUsers.filter((u) => u.Verified === "pending");
  const openReportCount = reports.filter((r) => r.Status !== "resolved").length;
  const selectedReport = reports.find((r) => r._id === selectedReportId);

  const handleVerifyUser = async (userId, status) => {
    try {
      const updated = await updateUserVerification(userId, status);
      setAllUsers((users) => users.map((u) => u._id === userId ? { ...u, Verified: updated.Verified } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReport = async () => {
    try {
      const updated = await updateReportStatus(selectedReportId, "resolved", adminNotes);
      setReports((r) => r.map((x) => x._id === selectedReportId ? updated : x));
      setShowResolveDialog(false);
      setSelectedReportId(null);
      setAdminNotes("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkReviewing = async (reportId) => {
    try {
      const updated = await updateReportStatus(reportId, "reviewing");
      setReports((r) => r.map((x) => x._id === reportId ? updated : x));
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-700 border-red-300";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  const handleAddCategory = () => {
    setLocalCategories([...localCategories, { id: String(localCategories.length + 1), name: categoryForm.name, description: categoryForm.description, count: 0 }]);
    setShowCategoryDialog(false);
    setCategoryForm({ name: "", description: "" });
  };

  const handleEditCategory = (id) => {
    setLocalCategories(localCategories.map((c) => c.id === id ? { ...c, ...categoryForm } : c));
    setShowCategoryDialog(false);
    setCategoryForm({ name: "", description: "" });
    setEditingCategory(null);
  };

  const handleOpenCategoryDialog = (id) => {
    if (id) {
      const cat = localCategories.find((c) => c.id === id);
      if (cat) { setCategoryForm({ name: cat.name, description: cat.description }); setEditingCategory(id); }
    } else {
      setCategoryForm({ name: "", description: "" });
      setEditingCategory(null);
    }
    setShowCategoryDialog(true);
  };

  const chartData = localCategories.filter((c) => c.count > 0).map((c) => ({ category: c.name, count: c.count }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, moderate content, and monitor platform health</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-600 mb-1">Total Users</p><p className="text-3xl font-bold">{isLoading ? "..." : allUsers.length}</p></div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-600 mb-1">Pending Verify</p><p className="text-3xl font-bold">{isLoading ? "..." : pendingUsers.length}</p></div>
                <Clock className="h-8 w-8 text-[#F7931E]" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-600 mb-1">Total Tasks</p><p className="text-3xl font-bold">{isLoading ? "..." : stats.totalTasks}</p></div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-600 mb-1">Active Jobs</p><p className="text-3xl font-bold">{isLoading ? "..." : stats.activeJobs}</p></div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-600 mb-1">Open Reports</p><p className="text-3xl font-bold">{isLoading ? "..." : openReportCount}</p></div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="verification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="verification">
              <Shield className="h-4 w-4 mr-2" />
              Users ({isLoading ? "..." : pendingUsers.length} pending)
            </TabsTrigger>
            <TabsTrigger value="reports">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Reports ({isLoading ? "..." : openReportCount} open)
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
                <CardTitle>User Verification</CardTitle>
                <CardDescription>
                  {isLoading ? "Loading..." : `${pendingUsers.length} pending — ${allUsers.length} total users registered`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading users...</div>
                ) : pendingUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">All users are verified</p>
                    <p className="text-sm text-gray-400 mt-1">{allUsers.length} total registered users</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((user) => (
                      <Card key={user._id} className="border-2 hover:border-[#F7931E] transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="bg-gray-200 rounded-full p-3">
                                  <Users className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{user.Name}</h3>
                                  <div className="flex gap-2 items-center">
                                    <Badge variant="secondary">{user.Role}</Badge>
                                    <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div><p className="text-xs text-gray-600 mb-1">Email</p><p className="text-sm font-medium">{user.Email}</p></div>
                                {user.Major && <div><p className="text-xs text-gray-600 mb-1">Major</p><p className="text-sm font-medium">{user.Major}</p></div>}
                                <div><p className="text-xs text-gray-600 mb-1">Registered</p><p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p></div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleVerifyUser(user._id, "approved")}>
                                <CheckCircle className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleVerifyUser(user._id, "rejected")}>
                                <XCircle className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports & Disputes Tab */}
          <TabsContent value="reports">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Reported Issues</CardTitle>
                    <CardDescription>{isLoading ? "Loading..." : `${reports.length} total reports`}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8 text-gray-400">Loading...</div>
                    ) : reports.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No reports submitted</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {reports.map((report) => (
                          <div
                            key={report._id}
                            onClick={() => setSelectedReportId(report._id)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedReportId === report._id ? "border-[#F7931E] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs">{report.Type}</Badge>
                              <Badge className={`text-xs ${report.Status === "pending" ? "bg-yellow-100 text-yellow-700" : report.Status === "reviewing" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                                {report.Status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">By {report.ReporterID?.Name || "Unknown"}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(report.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                {selectedReport ? (
                  <Card className="border-2 border-[#F7931E]">
                    <CardHeader>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">{selectedReport.Type}</Badge>
                        <Badge className={getSeverityColor(selectedReport.Severity)}>{selectedReport.Severity} priority</Badge>
                        <Badge className={selectedReport.Status === "pending" ? "bg-yellow-100 text-yellow-700" : selectedReport.Status === "reviewing" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}>
                          {selectedReport.Status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Reporter</p>
                          <p className="font-semibold">{selectedReport.ReporterID?.Name || "Unknown"}</p>
                          <Badge variant="secondary" className="text-xs mt-1">{selectedReport.ReporterID?.Role}</Badge>
                        </div>
                        {selectedReport.RespondentID && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Respondent</p>
                            <p className="font-semibold">{selectedReport.RespondentID?.Name}</p>
                            <Badge variant="secondary" className="text-xs mt-1">{selectedReport.RespondentID?.Role}</Badge>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4" />Description</h4>
                        <p className="text-gray-700 bg-white p-4 rounded-lg border leading-relaxed">{selectedReport.Description}</p>
                      </div>

                      <div className="text-sm text-gray-500">
                        Submitted: {new Date(selectedReport.createdAt).toLocaleString()}
                      </div>

                      {selectedReport.Resolution && (
                        <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                          <h4 className="font-semibold mb-2 text-green-900 flex items-center gap-2"><CheckCircle className="h-5 w-5" />Resolution</h4>
                          <p className="text-green-800">{selectedReport.Resolution}</p>
                        </div>
                      )}

                      {selectedReport.Status !== "resolved" && (
                        <div className="space-y-3 pt-4 border-t">
                          <h4 className="font-semibold">Admin Actions</h4>
                          <div className="flex gap-2 flex-wrap">
                            {selectedReport.Status === "pending" && (
                              <Button variant="outline" onClick={() => handleMarkReviewing(selectedReport._id)}>
                                Mark as Reviewing
                              </Button>
                            )}
                            <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
                              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowResolveDialog(true)}>
                                <CheckCircle className="h-4 w-4 mr-2" />Resolve
                              </Button>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Resolve Report</DialogTitle>
                                  <DialogDescription>Provide your resolution decision</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Resolution Notes *</Label>
                                    <Textarea placeholder="Explain your decision and any actions taken..." value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={5} />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleResolveReport} disabled={!adminNotes.trim()}>
                                      Resolve & Close
                                    </Button>
                                    <Button variant="outline" onClick={() => setShowResolveDialog(false)}>Cancel</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Select a report to view details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks & Services by Category</CardTitle>
                  <CardDescription>Live database counts</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
                  ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-gray-400">No data yet</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#F7931E" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Jobs Distribution</CardTitle>
                  <CardDescription>Active vs Completed</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Active", value: stats.activeJobs || 0 },
                            { name: "Completed", value: stats.completedJobs || 0 },
                          ].filter((d) => d.value > 0)}
                          cx="50%" cy="50%" outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {[0, 1].map((i) => <Cell key={i} fill={COLORS[i]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Platform Summary</CardTitle><CardDescription>Live counts from the database</CardDescription></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg"><p className="text-3xl font-bold text-blue-600">{isLoading ? "..." : allUsers.length}</p><p className="text-sm text-gray-600 mt-1">Registered Users</p></div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg"><p className="text-3xl font-bold text-[#F7931E]">{isLoading ? "..." : stats.totalTasks}</p><p className="text-sm text-gray-600 mt-1">Tasks Posted</p></div>
                  <div className="text-center p-4 bg-green-50 rounded-lg"><p className="text-3xl font-bold text-green-600">{isLoading ? "..." : stats.totalServices}</p><p className="text-sm text-gray-600 mt-1">Services Listed</p></div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg"><p className="text-3xl font-bold text-purple-600">{isLoading ? "..." : stats.completedJobs}</p><p className="text-sm text-gray-600 mt-1">Jobs Completed</p></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Category Management</CardTitle>
                <CardDescription>{localCategories.length} categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h3 className="font-semibold">{cat.name}</h3>
                        <p className="text-sm text-gray-600">{cat.count > 0 ? `${cat.count} tasks/services` : "No activity yet"}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleOpenCategoryDialog(cat.id)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" onClick={() => setLocalCategories(localCategories.filter((c) => c.id !== cat.id))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90" onClick={() => handleOpenCategoryDialog(null)}>
                    <Plus className="h-4 w-4 mr-2" />Add New Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input placeholder="Category name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Category description" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => editingCategory ? handleEditCategory(editingCategory) : handleAddCategory()} disabled={!categoryForm.name.trim()}>
                    {editingCategory ? "Update" : "Add"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>Cancel</Button>
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
