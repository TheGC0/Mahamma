import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Search,
  Filter,
  Clock,
  DollarSign,
  Calendar,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { getTasks, createProposal } from "../../lib/api";
import { categories } from "../lib/categories";
import { toast } from "sonner";

const EMPTY_OFFER_FORM = { price: "", deliveryTime: "", message: "" };

export function BrowseTasks() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const currentRole = (userInfo?.Role || userInfo?.role || "").toLowerCase();
  const isProviderUser = currentRole === "provider" || currentRole === "freelancer";
  const dashboardPath =
    currentRole === "admin"
      ? "/admin"
      : isProviderUser
        ? "/provider/dashboard"
        : "/client/dashboard";

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [offerForm, setOfferForm] = useState(EMPTY_OFFER_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userInfo && !isProviderUser) {
      toast.error("Only provider accounts can browse task requests.");
      navigate(dashboardPath, { replace: true });
      return;
    }

    fetchTasks();
  }, [selectedCategory]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const params = { status: "open" };
      if (selectedCategory !== "all") params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      const data = await getTasks(params);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => fetchTasks();

  const selectedTask = tasks.find((t) => t._id === selectedTaskId);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "price":
        if (!value) newErrors.price = "Price is required";
        else if (Number(value) < 1) newErrors.price = "Minimum price is 1 SAR";
        else delete newErrors.price;
        break;
      case "deliveryTime":
        if (!value) newErrors.deliveryTime = "Delivery time is required";
        else delete newErrors.deliveryTime;
        break;
      case "message":
        if (!value.trim()) newErrors.message = "Cover letter is required";
        else if (value.length < 50) newErrors.message = "Cover letter must be at least 50 characters";
        else if (value.length > 1000) newErrors.message = "Cover letter must be less than 1000 characters";
        else delete newErrors.message;
        break;
    }
    setErrors(newErrors);
    return newErrors;
  };

  const validateAll = () => {
    const newErrors = {};
    if (!offerForm.price) newErrors.price = "Price is required";
    else if (Number(offerForm.price) < 1) newErrors.price = "Minimum price is 1 SAR";
    if (!offerForm.deliveryTime) newErrors.deliveryTime = "Delivery time is required";
    if (!offerForm.message.trim()) newErrors.message = "Cover letter is required";
    else if (offerForm.message.length < 50) newErrors.message = "Cover letter must be at least 50 characters";
    return newErrors;
  };

  const handleSubmitOffer = async () => {
    setTouched({ price: true, deliveryTime: true, message: true });
    const newErrors = validateAll();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (!userInfo) {
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");
      await createProposal(selectedTaskId, {
        BidAmount: Number(offerForm.price),
        EstimatedTime: offerForm.deliveryTime,
        CoverLetter: offerForm.message,
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setOfferForm(EMPTY_OFFER_FORM);
        setTouched({});
        setErrors({});
        setSelectedTaskId(null);
        navigate("/provider/dashboard");
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || "Failed to submit proposal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openOfferDialog = (taskId) => {
    if (!userInfo) { navigate("/login"); return; }
    if (!isProviderUser) {
      toast.error("Only provider accounts can submit offers.");
      navigate(dashboardPath, { replace: true });
      return;
    }

    setSelectedTaskId(taskId);
    setOfferForm(EMPTY_OFFER_FORM);
    setErrors({});
    setTouched({});
    setShowSuccess(false);
    setSubmitError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        isAuthenticated={!!userInfo}
        userRole={userInfo?.Role}
        userName={userInfo?.Name}
      />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Task Requests</h1>
          <p className="text-gray-600">Find projects that match your skills and submit offers</p>
        </div>

        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for tasks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} className="bg-[#F7931E] hover:bg-[#F7931E]/90">
            Search
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading tasks...</div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">{tasks.length} open tasks found</div>
                <div className="space-y-6">
                  {tasks.map((task) => (
                    <Card key={task._id} className="hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">{task.Category}</Badge>
                          <Badge variant="outline" className="text-green-600 border-green-600">Open</Badge>
                        </div>
                        <CardTitle className="text-2xl mb-2">{task.Title}</CardTitle>
                        <CardDescription className="text-base">{task.Description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="text-gray-600">Budget</p>
                              <p className="font-medium">{task.Budget} SAR</p>
                            </div>
                          </div>
                          {task.Deadline && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-600" />
                              <div>
                                <p className="text-gray-600">Deadline</p>
                                <p className="font-medium">{new Date(task.Deadline).toLocaleDateString()}</p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="text-gray-600">Posted</p>
                              <p className="font-medium">{new Date(task.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <p className="text-sm text-gray-600">
                            Posted by <span className="font-medium">{task.ClientID?.Name}</span>
                          </p>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/tasks/${task._id}`)}
                            >
                              View Details
                            </Button>

                            {(!userInfo || isProviderUser) && (
                              <Dialog
                                open={selectedTaskId === task._id}
                                onOpenChange={(open) => !open && setSelectedTaskId(null)}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                                    onClick={() => openOfferDialog(task._id)}
                                  >
                                    Submit Offer
                                  </Button>
                                </DialogTrigger>

                                <DialogContent className="max-w-lg">
                                {showSuccess ? (
                                  <div className="text-center py-8">
                                    <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Offer Submitted!</h3>
                                    <p className="text-gray-600">Your proposal has been sent successfully.</p>
                                  </div>
                                ) : (
                                  <>
                                    <DialogHeader>
                                      <DialogTitle>Submit Your Offer</DialogTitle>
                                      <DialogDescription>Send a proposal for: {task.Title}</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      {submitError && (
                                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{submitError}</div>
                                      )}
                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <p className="text-sm text-blue-900">
                                          <strong>Client Budget:</strong> {task.Budget} SAR
                                        </p>
                                      </div>

                                      <div className="space-y-2">
                                        <Label>Your Price (SAR) *</Label>
                                        <div className="relative">
                                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                          <Input
                                            type="number"
                                            placeholder="Enter your price"
                                            className={`pl-10 ${touched.price && errors.price ? "border-red-500" : ""}`}
                                            value={offerForm.price}
                                            onChange={(e) => {
                                              setOfferForm((p) => ({ ...p, price: e.target.value }));
                                              if (touched.price) validateField("price", e.target.value);
                                            }}
                                            onBlur={() => { setTouched((p) => ({ ...p, price: true })); validateField("price", offerForm.price); }}
                                          />
                                        </div>
                                        {touched.price && errors.price && (
                                          <div className="flex items-center gap-1 text-red-600 text-sm">
                                            <AlertCircle className="h-4 w-4" /><span>{errors.price}</span>
                                          </div>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <Label>Delivery Time *</Label>
                                        <Select
                                          value={offerForm.deliveryTime}
                                          onValueChange={(v) => {
                                            setOfferForm((p) => ({ ...p, deliveryTime: v }));
                                            setTouched((p) => ({ ...p, deliveryTime: true }));
                                            validateField("deliveryTime", v);
                                          }}
                                        >
                                          <SelectTrigger className={touched.deliveryTime && errors.deliveryTime ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select delivery time" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {["1 day","2 days","3 days","5 days","7 days","14 days"].map((t) => (
                                              <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        {touched.deliveryTime && errors.deliveryTime && (
                                          <div className="flex items-center gap-1 text-red-600 text-sm">
                                            <AlertCircle className="h-4 w-4" /><span>{errors.deliveryTime}</span>
                                          </div>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <Label>Cover Letter *</Label>
                                        <Textarea
                                          placeholder="Explain why you're the best fit for this task..."
                                          rows={5}
                                          className={touched.message && errors.message ? "border-red-500" : ""}
                                          value={offerForm.message}
                                          onChange={(e) => {
                                            setOfferForm((p) => ({ ...p, message: e.target.value }));
                                            if (touched.message) validateField("message", e.target.value);
                                          }}
                                          onBlur={() => { setTouched((p) => ({ ...p, message: true })); validateField("message", offerForm.message); }}
                                        />
                                        <div className="flex justify-between">
                                          {touched.message && errors.message ? (
                                            <div className="flex items-center gap-1 text-red-600 text-sm">
                                              <AlertCircle className="h-4 w-4" /><span>{errors.message}</span>
                                            </div>
                                          ) : (
                                            <p className="text-xs text-gray-500">Min 50 characters</p>
                                          )}
                                          <span className="text-xs text-gray-500">{offerForm.message.length}/1000</span>
                                        </div>
                                      </div>

                                      <Button
                                        className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                                        onClick={handleSubmitOffer}
                                        disabled={isSubmitting}
                                      >
                                        <Send className="h-4 w-4 mr-2" />
                                        {isSubmitting ? "Submitting..." : "Send Offer"}
                                      </Button>
                                    </div>
                                  </>
                                )}
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {tasks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No tasks found matching your criteria</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
