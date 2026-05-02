import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import { StarRating } from "../components/StarRating";
import { Search, Filter, Clock } from "lucide-react";
import { getServices } from "../../lib/api";
import { categories } from "../lib/categories";

export function BrowseServices() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState("0");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const params = {};
        if (selectedCategory !== "all") params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;
        if (priceRange[0] > 0) params.minPrice = priceRange[0];
        if (priceRange[1] < 500) params.maxPrice = priceRange[1];
        const data = await getServices(params);
        setServices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [selectedCategory, priceRange]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (selectedCategory !== "all") params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (priceRange[0] > 0) params.minPrice = priceRange[0];
      if (priceRange[1] < 500) params.maxPrice = priceRange[1];
      const data = await getServices(params);
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = services.filter(
    (s) => s.ProviderID && s.ProviderID.Rating >= parseFloat(minRating)
  );

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, 500]);
    setMinRating("0");
    setSearchQuery("");
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Services</h1>
          <p className="text-gray-600">Find the perfect service from verified KFUPM students</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for services..."
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Price Range: {priceRange[0]} - {priceRange[1]} SAR
                  </label>
                  <Slider
                    min={0}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Rating</label>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Ratings</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.8">4.8+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading services...</div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  {filteredServices.length} services found
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredServices.map((service) => (
                    <Card
                      key={service._id}
                      className="hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => navigate(`/services/${service._id}`)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">{service.Category}</Badge>
                        </div>
                        <CardTitle className="text-lg">{service.Title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {service.Description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-200 rounded-full p-2">
                              <span className="text-xs font-medium">
                                {service.ProviderID?.Name?.[0] || "?"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {service.ProviderID?.Name}
                              </p>
                              <StarRating rating={service.ProviderID?.Rating || 0} size="sm" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{service.DeliveryTime}</span>
                            </div>
                            <div className="text-lg font-bold text-[#F7931E]">
                              {service.Price} SAR
                            </div>
                          </div>

                          <Button
                            className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/services/${service._id}`);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No services found matching your criteria</p>
                    <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
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
