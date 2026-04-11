import { useState } from "react";
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
import { mockTasks, categories } from "../lib/mock-data";

export function BrowseTasks() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [offerForm, setOfferForm] = useState({
    price: "",
    deliveryTime: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || task.category === selectedCategory;
    return matchesSearch && matchesCategory && task.status === "open";
  });

  const selectedTask = mockTasks.find((t) => t.id === selectedTaskId);

  const validateField = (name, value) => {
    if (!selectedTask) return;
    const newErrors = { ...errors };
    switch (name) {
      case "price":
        if (!value) {
          newErrors.price = "Price is required";
        } else if (Number(value) < 50) {
          newErrors.price = "Minimum price is 50 SAR";
        } else if (
          Number(value) < selectedTask.budgetMin ||
          Number(value) > selectedTask.budgetMax
        ) {
          newErrors.price = `Price should be within budget range (${selectedTask.budgetMin}-${selectedTask.budgetMax} SAR)`;
        } else {
          delete newErrors.price;
        }
        break;
      case "deliveryTime":
        if (!value) {
          newErrors.deliveryTime = "Delivery time is required";
        } else {
          delete newErrors.deliveryTime;
        }
        break;
      case "message":
        if (!value.trim()) {
          newErrors.message = "Cover letter is required";
        } else if (value.length < 50) {
          newErrors.message = "Cover letter must be at least 50 characters";
        } else if (value.length > 1000) {
          newErrors.message = "Cover letter must be less than 1000 characters";
        } else {
          delete newErrors.message;
        }
        break;
    }
    setErrors(newErrors);
  };

  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
    validateField(name, offerForm[name]);
  };

  const handleSubmitOffer = () => {
    // Mark all fields as touched
    const allTouched = {
      price: true,
      deliveryTime: true,
      message: true,
    };
    setTouched(allTouched);
    // Validate all fields
    Object.keys(offerForm).forEach((key) => {
      validateField(key, offerForm[key]);
    });
    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      return;
    }
    // Mock submission - show success state
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setOfferForm({ price: "", deliveryTime: "", message: "" });
      setTouched({});
      setErrors({});
      setSelectedTaskId(null);
    }, 2000);
  };

  const openOfferDialog = (taskId) => {
    setSelectedTaskId(taskId);
    setOfferForm({ price: "", deliveryTime: "", message: "" });
    setErrors({});
    setTouched({});
    setShowSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} userRole="provider" userName="Ahmed" />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Task Requests
          </h1>
          <p className="text-gray-600">
            Find projects that match your skills and submit offers
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for tasks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-sm text-gray-600">
              {filteredTasks.length} open tasks found
            </div>
            <div className="space-y-6">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{task.category}</Badge>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Open
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {task.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {task.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-gray-600">Budget</p>
                          <p className="font-medium">
                            {task.budgetMin} - {task.budgetMax} SAR
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-gray-600">Deadline</p>
                          <p className="font-medium">
                            {new Date(task.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-gray-600">Posted</p>
                          <p className="font-medium">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Posted by{" "}
                        <span className="font-medium">{task.clientName}</span>
                      </p>
                      <Dialog
                        open={selectedTaskId === task.id}
                        onOpenChange={(open) =>
                          !open && setSelectedTaskId(null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            className="bg-[#F7931E] hover:bg-[#F7931E]/90"
                            onClick={() => openOfferDialog(task.id)}
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
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Offer Submitted!
                              </h3>
                              <p className="text-gray-600">
                                Your proposal has been sent to the client.
                                You'll be notified if they're interested.
                              </p>
                            </div>
                          ) : (
                            <>
                              <DialogHeader>
                                <DialogTitle>Submit Your Offer</DialogTitle>
                                <DialogDescription>
                                  Send a proposal for: {task.title}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {/* Budget Reference */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <p className="text-sm text-blue-900">
                                    <strong>Client Budget:</strong>{" "}
                                    {task.budgetMin} - {task.budgetMax} SAR
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="price">
                                    Your Price (SAR) *
                                  </Label>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      id="price"
                                      type="number"
                                      placeholder={`${task.budgetMin} - ${task.budgetMax}`}
                                      className={`pl-10 ${touched.price && errors.price ? "border-red-500" : ""}`}
                                      value={offerForm.price}
                                      onChange={(e) => {
                                        setOfferForm({
                                          ...offerForm,
                                          price: e.target.value,
                                        });
                                        if (touched.price)
                                          validateField(
                                            "price",
                                            e.target.value,
                                          );
                                      }}
                                      onBlur={() => handleBlur("price")}
                                    />
                                  </div>
                                  {touched.price && errors.price && (
                                    <div className="flex items-center gap-1 text-red-600 text-sm">
                                      <AlertCircle className="h-4 w-4" />
                                      <span>{errors.price}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="deliveryTime">
                                    Delivery Time *
                                  </Label>
                                  <Select
                                    value={offerForm.deliveryTime}
                                    onValueChange={(value) => {
                                      setOfferForm({
                                        ...offerForm,
                                        deliveryTime: value,
                                      });
                                      if (touched.deliveryTime)
                                        validateField("deliveryTime", value);
                                    }}
                                  >
                                    <SelectTrigger
                                      className={
                                        touched.deliveryTime &&
                                          errors.deliveryTime
                                          ? "border-red-500"
                                          : ""
                                      }
                                    >
                                      <SelectValue placeholder="Select delivery time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1 day">
                                        1 day
                                      </SelectItem>
                                      <SelectItem value="2 days">
                                        2 days
                                      </SelectItem>
                                      <SelectItem value="3 days">
                                        3 days
                                      </SelectItem>
                                      <SelectItem value="5 days">
                                        5 days
                                      </SelectItem>
                                      <SelectItem value="7 days">
                                        1 week
                                      </SelectItem>
                                      <SelectItem value="14 days">
                                        2 weeks
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {touched.deliveryTime &&
                                    errors.deliveryTime && (
                                      <div className="flex items-center gap-1 text-red-600 text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errors.deliveryTime}</span>
                                      </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="message">
                                    Cover Letter *
                                  </Label>
                                  <Textarea
                                    id="message"
                                    placeholder="Explain why you're the best fit for this task. Highlight relevant experience and skills..."
                                    rows={5}
                                    className={
                                      touched.message && errors.message
                                        ? "border-red-500"
                                        : ""
                                    }
                                    value={offerForm.message}
                                    onChange={(e) => {
                                      setOfferForm({
                                        ...offerForm,
                                        message: e.target.value,
                                      });
                                      if (touched.message)
                                        validateField(
                                          "message",
                                          e.target.value,
                                        );
                                    }}
                                    onBlur={() => handleBlur("message")}
                                  />

                                  <div className="flex justify-between items-start">
                                    {touched.message && errors.message ? (
                                      <div className="flex items-center gap-1 text-red-600 text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errors.message}</span>
                                      </div>
                                    ) : (
                                      <p className="text-xs text-gray-500">
                                        Make it personal and specific to this
                                        task (min 50 characters)
                                      </p>
                                    )}
                                    <span className="text-xs text-gray-500">
                                      {offerForm.message.length}/1000
                                    </span>
                                  </div>
                                </div>

                                <Button
                                  className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                                  onClick={handleSubmitOffer}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Offer
                                </Button>
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No tasks found matching your criteria
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

