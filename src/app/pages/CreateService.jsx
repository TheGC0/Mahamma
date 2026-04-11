import { useState } from "react";
import { useNavigate } from "react-router";
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
import { categories } from "../lib/mock-data";
import {
  Upload,
  DollarSign,
  Clock,
  RefreshCw,
  X,
  AlertCircle,
} from "lucide-react";

export function CreateService() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    deliveryTime: "",
    revisions: "2",
  });

  const [portfolioImages, setPortfolioImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Title is required";
        } else if (value.length < 15) {
          newErrors.title = "Title must be at least 15 characters";
        } else if (value.length > 80) {
          newErrors.title = "Title must be less than 80 characters";
        } else if (!value.toLowerCase().startsWith("i will")) {
          newErrors.title = 'Title should start with "I will..."';
        } else {
          delete newErrors.title;
        }
        break;
      case "category":
        if (!value) {
          newErrors.category = "Please select a category";
        } else {
          delete newErrors.category;
        }
        break;
      case "description":
        if (!value.trim()) {
          newErrors.description = "Description is required";
        } else if (value.length < 100) {
          newErrors.description = "Description must be at least 100 characters";
        } else if (value.length > 1500) {
          newErrors.description =
            "Description must be less than 1500 characters";
        } else {
          delete newErrors.description;
        }
        break;
      case "price":
        if (!value) {
          newErrors.price = "Price is required";
        } else if (Number(value) < 50) {
          newErrors.price = "Minimum price is 50 SAR";
        } else if (Number(value) > 5000) {
          newErrors.price = "Maximum price is 5000 SAR";
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
    }
    setErrors(newErrors);
  };

  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    // Validate files
    const validFiles = files.filter((file) => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported image type.`);
        return false;
      }
      return true;
    });
    // Limit to 3 images total
    const newImages = [...portfolioImages, ...validFiles].slice(0, 3);
    setPortfolioImages(newImages);
  };

  const removeImage = (index) => {
    setPortfolioImages(portfolioImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all fields as touched
    const allTouched = {
      title: true,
      category: true,
      description: true,
      price: true,
      deliveryTime: true,
    };
    setTouched(allTouched);
    // Validate all fields
    Object.keys(formData).forEach((key) => {
      if (key !== "revisions") {
        validateField(key, formData[key]);
      }
    });
    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      return;
    }
    // Mock submission - redirect to provider dashboard
    navigate("/provider/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} userRole="provider" userName="Ahmed" />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Service Offer
          </h1>
          <p className="text-gray-600">
            Showcase your skills and attract clients
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>
              Provide detailed information about the service you're offering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    setFormData({ ...formData, category: value });
                    if (touched.category) validateField("category", value);
                  }}
                >
                  <SelectTrigger
                    className={
                      touched.category && errors.category
                        ? "border-red-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.category && errors.category && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.category}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  placeholder="I will design a professional logo for your business"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (touched.title) validateField("title", e.target.value);
                  }}
                  onBlur={() => handleBlur("title")}
                  className={
                    touched.title && errors.title ? "border-red-500" : ""
                  }
                />

                {touched.title && errors.title && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.title}</span>
                  </div>
                )}
                {!errors.title && (
                  <p className="text-xs text-gray-500">
                    Start with "I will..." and be specific about what you offer
                    (15-80 characters)
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your service in detail. What will you deliver? What makes your service unique? Include your experience and skills..."
                  rows={8}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (touched.description)
                      validateField("description", e.target.value);
                  }}
                  onBlur={() => handleBlur("description")}
                  className={
                    touched.description && errors.description
                      ? "border-red-500"
                      : ""
                  }
                />

                <div className="flex justify-between items-start">
                  {touched.description && errors.description ? (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.description}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Minimum 100 characters. Be clear about what's included.
                    </p>
                  )}
                  <span className="text-xs text-gray-500">
                    {formData.description.length}/1500
                  </span>
                </div>
              </div>

              {/* Pricing & Delivery */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (SAR) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="150"
                      className={`pl-10 ${touched.price && errors.price ? "border-red-500" : ""}`}
                      value={formData.price}
                      onChange={(e) => {
                        setFormData({ ...formData, price: e.target.value });
                        if (touched.price)
                          validateField("price", e.target.value);
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
                  {!errors.price && (
                    <p className="text-xs text-gray-500">50 - 5000 SAR</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">Delivery Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Select
                      value={formData.deliveryTime}
                      onValueChange={(value) => {
                        setFormData({ ...formData, deliveryTime: value });
                        if (touched.deliveryTime)
                          validateField("deliveryTime", value);
                      }}
                    >
                      <SelectTrigger
                        className={`pl-10 ${touched.deliveryTime && errors.deliveryTime ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select delivery time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="2">2 days</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="7">1 week</SelectItem>
                        <SelectItem value="14">2 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {touched.deliveryTime && errors.deliveryTime && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.deliveryTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Revisions */}
              <div className="space-y-2">
                <Label htmlFor="revisions">Number of Revisions *</Label>
                <div className="relative">
                  <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Select
                    value={formData.revisions}
                    onValueChange={(value) =>
                      setFormData({ ...formData, revisions: value })
                    }
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Revision</SelectItem>
                      <SelectItem value="2">2 Revisions</SelectItem>
                      <SelectItem value="3">3 Revisions</SelectItem>
                      <SelectItem value="unlimited">
                        Unlimited Revisions
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Portfolio Samples */}
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio Samples (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F7931E] transition-colors cursor-pointer">
                  <input
                    id="portfolio"
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={portfolioImages.length >= 3}
                  />

                  <label
                    htmlFor="portfolio"
                    className={`cursor-pointer ${portfolioImages.length >= 3 ? "opacity-50" : ""}`}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      {portfolioImages.length >= 3
                        ? "Maximum 3 images reached"
                        : "Upload samples of your work"}
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG up to 5MB each ({portfolioImages.length}/3)
                    </p>
                  </label>
                </div>

                {/* Uploaded Images Preview */}
                {portfolioImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {portfolioImages.map((file, index) => (
                      <div
                        key={index}
                        className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="text-white hover:text-red-500 hover:bg-white/20"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                          <p className="text-xs text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-300">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#F7931E] hover:bg-[#F7931E]/90"
                >
                  Create Service
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/provider/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">
              Tips for a Great Service Listing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#F7931E]">•</span>
                <span>
                  Use a clear, professional title that explains what you offer
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F7931E]">•</span>
                <span>
                  Include portfolio samples to showcase your best work
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F7931E]">•</span>
                <span>Set competitive pricing based on market rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F7931E]">•</span>
                <span>
                  Be realistic about delivery times - it affects your rating
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F7931E]">•</span>
                <span>Clearly state what's included and what's not</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
