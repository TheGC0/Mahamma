import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
import { categories } from "../lib/categories";
import { Calendar, DollarSign, AlertCircle } from "lucide-react";
import { createTask, updateTask, getTaskById } from "../../lib/api";

export function PostTask() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const isEditMode = !!taskId;
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!userInfo) { navigate("/login"); return; }
    if (isEditMode) {
      getTaskById(taskId).then((task) => {
        setFormData({
          title: task.Title || "",
          category: task.Category || "",
          description: task.Description || "",
          budget: task.Budget?.toString() || "",
          deadline: task.Deadline ? new Date(task.Deadline).toISOString().split("T")[0] : "",
        });
      }).catch(() => {});
    }
  }, [taskId]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "title":
        if (!value.trim()) newErrors.title = "Title is required";
        else if (value.length < 5) newErrors.title = "Title must be at least 5 characters";
        else if (value.length > 100) newErrors.title = "Title must be less than 100 characters";
        else delete newErrors.title;
        break;
      case "category":
        if (!value) newErrors.category = "Please select a category";
        else delete newErrors.category;
        break;
      case "description":
        if (!value.trim()) newErrors.description = "Description is required";
        else if (value.length < 20) newErrors.description = "Description must be at least 20 characters";
        else delete newErrors.description;
        break;
      case "budget":
        if (!value) newErrors.budget = "Budget is required";
        else if (Number(value) < 1) newErrors.budget = "Budget must be at least 1 SAR";
        else delete newErrors.budget;
        break;
      case "deadline":
        if (value) {
          const d = new Date(value);
          const today = new Date(); today.setHours(0, 0, 0, 0);
          if (d < today) newErrors.deadline = "Deadline must be in the future";
          else delete newErrors.deadline;
        } else {
          delete newErrors.deadline;
        }
        break;
    }
    setErrors(newErrors);
    return newErrors;
  };

  const validateAll = () => {
    let errs = {};
    errs = { ...errs, ...validateField("title", formData.title) };
    errs = { ...errs, ...validateField("category", formData.category) };
    errs = { ...errs, ...validateField("description", formData.description) };
    errs = { ...errs, ...validateField("budget", formData.budget) };
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ title: true, category: true, description: true, budget: true, deadline: true });
    const errs = validateAll();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setIsLoading(true);
      setSubmitError("");
      const payload = {
        Title: formData.title,
        Category: formData.category,
        Description: formData.description,
        Budget: Number(formData.budget),
        Deadline: formData.deadline || undefined,
      };

      let task;
      if (isEditMode) {
        task = await updateTask(taskId, payload);
      } else {
        task = await createTask(payload);
      }

      navigate(`/client/request/${task._id}`);
    } catch (err) {
      setSubmitError(err.message || "Failed to save task.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? "Edit Task" : "Post a Task"}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? "Update your task details" : "Describe your project and receive offers from verified students"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>Provide clear information to attract the best freelancers</CardDescription>
          </CardHeader>
          <CardContent>
            {submitError && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">{submitError}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => {
                    setFormData({ ...formData, category: v });
                    if (touched.category) validateField("category", v);
                  }}
                >
                  <SelectTrigger className={touched.category && errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
                {touched.category && errors.category && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" /><span>{errors.category}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label>Task Title *</Label>
                <Input
                  placeholder="e.g., Design a modern logo for my startup"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (touched.title) validateField("title", e.target.value);
                  }}
                  onBlur={() => { setTouched({ ...touched, title: true }); validateField("title", formData.title); }}
                  className={touched.title && errors.title ? "border-red-500" : ""}
                />
                {touched.title && errors.title && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" /><span>{errors.title}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  placeholder="Describe your task in detail. Include requirements, expectations, and any specific instructions..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (touched.description) validateField("description", e.target.value);
                  }}
                  onBlur={() => { setTouched({ ...touched, description: true }); validateField("description", formData.description); }}
                  className={touched.description && errors.description ? "border-red-500" : ""}
                />
                <div className="flex justify-between">
                  {touched.description && errors.description ? (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" /><span>{errors.description}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Minimum 20 characters</p>
                  )}
                  <span className="text-xs text-gray-500">{formData.description.length}</span>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label>Budget (SAR) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="e.g., 300"
                    className={`pl-10 ${touched.budget && errors.budget ? "border-red-500" : ""}`}
                    value={formData.budget}
                    onChange={(e) => {
                      setFormData({ ...formData, budget: e.target.value });
                      if (touched.budget) validateField("budget", e.target.value);
                    }}
                    onBlur={() => { setTouched({ ...touched, budget: true }); validateField("budget", formData.budget); }}
                  />
                </div>
                {touched.budget && errors.budget && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" /><span>{errors.budget}</span>
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label>Deadline (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    className={`pl-10 ${touched.deadline && errors.deadline ? "border-red-500" : ""}`}
                    value={formData.deadline}
                    onChange={(e) => {
                      setFormData({ ...formData, deadline: e.target.value });
                      if (touched.deadline) validateField("deadline", e.target.value);
                    }}
                    onBlur={() => { setTouched({ ...touched, deadline: true }); validateField("deadline", formData.deadline); }}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {touched.deadline && errors.deadline && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" /><span>{errors.deadline}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-[#F7931E] hover:bg-[#F7931E]/90" disabled={isLoading}>
                  {isLoading ? "Saving..." : isEditMode ? "Update Task" : "Post Task"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/client/dashboard")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader><CardTitle className="text-lg">Tips for a Great Task Post</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Be specific about your requirements</span></li>
              <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Set a realistic budget and deadline</span></li>
              <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Respond promptly to offers and questions</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
