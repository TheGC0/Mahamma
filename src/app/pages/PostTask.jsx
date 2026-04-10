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
  Calendar,
  DollarSign,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";

export function PostTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Title is required";
        } else if (value.length < 10) {
          newErrors.title = "Title must be at least 10 characters";
        } else if (value.length > 100) {
          newErrors.title = "Title must be less than 100 characters";
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
        } else if (value.length < 50) {
          newErrors.description = "Description must be at least 50 characters";
        } else if (value.length > 2000) {
          newErrors.description =
            "Description must be less than 2000 characters";
        } else {
          delete newErrors.description;
        }
        break;
      case "budgetMin":
        if (!value) {
          newErrors.budgetMin = "Minimum budget is required";
        } else if (Number(value) < 50) {
          newErrors.budgetMin = "Minimum budget must be at least 50 SAR";
        } else if (
          formData.budgetMax &&
          Number(value) >= Number(formData.budgetMax)
        ) {
          newErrors.budgetMin = "Minimum must be less than maximum";
        } else {
          delete newErrors.budgetMin;
        }
        break;
      case "budgetMax":
        if (!value) {
          newErrors.budgetMax = "Maximum budget is required";
        } else if (
          formData.budgetMin &&
          Number(value) <= Number(formData.budgetMin)
        ) {
          newErrors.budgetMax = "Maximum must be greater than minimum";
        } else {
          delete newErrors.budgetMax;
        }
        break;
      case "deadline":
        if (!value) {
          newErrors.deadline = "Deadline is required";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            newErrors.deadline = "Deadline must be in the future";
          } else {
            delete newErrors.deadline;
          }
        }
        break;
    }
    setErrors(newErrors);
  };

  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    // Validate files
    const validFiles = files.filter((file) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
        "image/jpg",
      ];
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type.`);
        return false;
      }
      return true;
    });
    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all fields as touched
    const allTouched = {
      title: true,
      category: true,
      description: true,
      budgetMin: true,
      budgetMax: true,
      deadline: true,
    };
    setTouched(allTouched);
    // Validate all fields
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });
    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      return;
    }
    // Mock submission - redirect to request details
    navigate("/client/request/mock-task-id");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} userRole="client" userName="Abdullah" />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Task</h1>
          <p className="text-gray-600">
            Describe your project and receive offers from verified students
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>
              Provide clear information to attract the best freelancers
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
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Design a modern logo for my startup"
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
                    Write a clear, specific title that describes your task
                    (10-100 characters)
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your task in detail. Include requirements, expectations, and any specific instructions..."
                  rows={6}
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
                      Minimum 50 characters. Be specific about your
                      requirements.
                    </p>
                  )}
                  <span className="text-xs text-gray-500">
                    {formData.description.length}/2000
                  </span>
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-2">
                <Label>Budget Range (SAR) *</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="budgetMin"
                      className="text-sm text-gray-600"
                    >
                      Minimum
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="budgetMin"
                        type="number"
                        placeholder="100"
                        className={`pl-10 ${touched.budgetMin && errors.budgetMin ? "border-red-500" : ""}`}
                        value={formData.budgetMin}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            budgetMin: e.target.value,
                          });
                          if (touched.budgetMin)
                            validateField("budgetMin", e.target.value);
                          if (touched.budgetMax && formData.budgetMax)
                            validateField("budgetMax", formData.budgetMax);
                        }}
                        onBlur={() => handleBlur("budgetMin")}
                      />
                    </div>
                    {touched.budgetMin && errors.budgetMin && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.budgetMin}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="budgetMax"
                      className="text-sm text-gray-600"
                    >
                      Maximum
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="budgetMax"
                        type="number"
                        placeholder="200"
                        className={`pl-10 ${touched.budgetMax && errors.budgetMax ? "border-red-500" : ""}`}
                        value={formData.budgetMax}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            budgetMax: e.target.value,
                          });
                          if (touched.budgetMax)
                            validateField("budgetMax", e.target.value);
                          if (touched.budgetMin && formData.budgetMin)
                            validateField("budgetMin", formData.budgetMin);
                        }}
                        onBlur={() => handleBlur("budgetMax")}
                      />
                    </div>
                    {touched.budgetMax && errors.budgetMax && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.budgetMax}</span>
                      </div>
                    )}
                  </div>
                </div>
                {!errors.budgetMin && !errors.budgetMax && (
                  <p className="text-xs text-gray-500">
                    Set a realistic budget range to attract quality offers
                    (minimum 50 SAR)
                  </p>
                )}
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="deadline"
                    type="date"
                    className={`pl-10 ${touched.deadline && errors.deadline ? "border-red-500" : ""}`}
                    value={formData.deadline}
                    onChange={(e) => {
                      setFormData({ ...formData, deadline: e.target.value });
                      if (touched.deadline)
                        validateField("deadline", e.target.value);
                    }}
                    onBlur={() => handleBlur("deadline")}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {touched.deadline && errors.deadline && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.deadline}</span>
                  </div>
                )}
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F7931E] transition-colors cursor-pointer">
                  <input
                    id="attachments"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <label htmlFor="attachments" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, PNG, JPG up to 10MB
                    </p>
                  </label>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
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
                  Post Task
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/client/dashboard")}
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
              Tips for a Great Task Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#F7931E]">•</span>
                <span>
                  Be specific about your requirements and expectations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F7931E]">•</span>
                <span>Set a realistic budget and deadline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F7931E]">•</span>
                <span>Include examples or references if possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F7931E]">•</span>
                <span>Respond promptly to offers and questions</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
