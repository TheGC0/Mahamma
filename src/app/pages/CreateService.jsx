import { useState, useEffect, useMemo } from "react";
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
import { DollarSign, Clock, AlertCircle } from "lucide-react";
import { createService, deleteService, getServiceById, updateService } from "../../lib/api";
import { toast } from "sonner";

export function CreateService() {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const userInfo = useMemo(
    () => JSON.parse(localStorage.getItem("userInfo") || "null"),
    [],
  );
  const isEditMode = Boolean(serviceId);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    deliveryTime: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(isEditMode);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!userInfo) { navigate("/login"); return; }
    if (userInfo.Role !== "provider") { navigate("/client/dashboard"); }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (!isEditMode || !userInfo) return;

    const fetchService = async () => {
      try {
        setIsPageLoading(true);
        setSubmitError("");
        const service = await getServiceById(serviceId);
        const providerId = service.ProviderID?._id || service.ProviderID;

        if (String(providerId) !== String(userInfo._id)) {
          navigate("/provider/dashboard");
          return;
        }

        setFormData({
          title: service.Title || "",
          category: service.Category || "",
          description: service.Description || "",
          price: service.Price?.toString() || "",
          deliveryTime: service.DeliveryTime || "",
        });
      } catch (err) {
        setSubmitError(err.message || "Failed to load service.");
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchService();
  }, [isEditMode, navigate, serviceId, userInfo]);

  const validateField = (name, value, current = errors) => {
    const newErrors = { ...current };
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
      case "price":
        if (!value) newErrors.price = "Price is required";
        else if (Number(value) < 1) newErrors.price = "Minimum price is 1 SAR";
        else delete newErrors.price;
        break;
      case "deliveryTime":
        if (!value) newErrors.deliveryTime = "Delivery time is required";
        else delete newErrors.deliveryTime;
        break;
    }
    return newErrors;
  };

  const validateAll = () => {
    let errs = {};
    ["title", "category", "description", "price", "deliveryTime"].forEach((f) => {
      errs = validateField(f, formData[f], errs);
    });
    return errs;
  };

  const handleBlur = (name) => {
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors(validateField(name, formData[name]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ title: true, category: true, description: true, price: true, deliveryTime: true });
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
        Price: Number(formData.price),
        DeliveryTime: formData.deliveryTime,
      };

      const service = isEditMode
        ? await updateService(serviceId, payload)
        : await createService(payload);

      toast.success(isEditMode ? "Service updated." : "Service created.");
      navigate(isEditMode ? "/provider/dashboard" : `/provider/edit-service/${service._id}`);
    } catch (err) {
      setSubmitError(err.message || `Failed to ${isEditMode ? "update" : "create"} service.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode) return;
    const confirmed = window.confirm("Delete this service? This cannot be undone.");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteService(serviceId);
      toast.success("Service deleted.");
      navigate("/provider/dashboard");
    } catch (err) {
      setSubmitError(err.message || "Failed to delete service.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />
        <div className="flex items-center justify-center py-32 text-gray-500">Loading service...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? "Manage Service" : "Create Service Offer"}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? "Update your listing details and pricing" : "Showcase your skills and attract clients"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>
              {isEditMode ? "Clients will see these details on your service page" : "Provide detailed information about your service"}
            </CardDescription>
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
                    setFormData((p) => ({ ...p, category: v }));
                    setTouched((p) => ({ ...p, category: true }));
                    setErrors(validateField("category", v));
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
                <Label>Service Title *</Label>
                <Input
                  placeholder="e.g., I will design a professional logo for your business"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, title: e.target.value }));
                    if (touched.title) setErrors(validateField("title", e.target.value));
                  }}
                  onBlur={() => handleBlur("title")}
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
                  placeholder="Describe your service in detail. What will you deliver? What makes your service unique?"
                  rows={8}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, description: e.target.value }));
                    if (touched.description) setErrors(validateField("description", e.target.value));
                  }}
                  onBlur={() => handleBlur("description")}
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

              <div className="grid md:grid-cols-2 gap-6">
                {/* Price */}
                <div className="space-y-2">
                  <Label>Price (SAR) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="150"
                      className={`pl-10 ${touched.price && errors.price ? "border-red-500" : ""}`}
                      value={formData.price}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, price: e.target.value }));
                        if (touched.price) setErrors(validateField("price", e.target.value));
                      }}
                      onBlur={() => handleBlur("price")}
                    />
                  </div>
                  {touched.price && errors.price && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" /><span>{errors.price}</span>
                    </div>
                  )}
                </div>

                {/* Delivery Time */}
                <div className="space-y-2">
                  <Label>Delivery Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Select
                      value={formData.deliveryTime}
                      onValueChange={(v) => {
                        setFormData((p) => ({ ...p, deliveryTime: v }));
                        setTouched((p) => ({ ...p, deliveryTime: true }));
                        setErrors(validateField("deliveryTime", v));
                      }}
                    >
                      <SelectTrigger className={`pl-10 ${touched.deliveryTime && errors.deliveryTime ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select delivery time" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1 day","2 days","3 days","5 days","1 week","2 weeks"].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {touched.deliveryTime && errors.deliveryTime && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" /><span>{errors.deliveryTime}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-[#F7931E] hover:bg-[#F7931E]/90" disabled={isLoading}>
                  {isLoading ? (isEditMode ? "Saving..." : "Creating...") : (isEditMode ? "Save Changes" : "Create Service")}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/provider/dashboard")}>
                  Cancel
                </Button>
                {isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader><CardTitle className="text-lg">Tips for a Great Service Listing</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Use a clear, professional title</span></li>
              <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Set competitive pricing based on market rates</span></li>
              <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Be realistic about delivery times</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
