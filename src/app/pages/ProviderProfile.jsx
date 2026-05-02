import { useEffect, useMemo, useState } from "react";
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
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { StarRating } from "../components/StarRating";
import {
  Award,
  Briefcase,
  CheckCircle,
  Clock,
  Heart,
  MessageSquare,
  Star,
  TrendingUp,
  X as XIcon,
} from "lucide-react";
import { getProviderReviews, getServices } from "../../lib/api";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const portfolio = [
  {
    id: "p1",
    title: "Tech Startup Logo",
    category: "Logo Design",
    description:
      "Modern, minimalist logo for a tech startup focusing on AI solutions",
    image:
      "https://images.unsplash.com/photo-1649000808933-1f4aac7cad9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "p2",
    title: "Restaurant Branding",
    category: "Brand Identity",
    description:
      "Complete brand identity including logo, menu design, and signage",
    image:
      "https://images.unsplash.com/photo-1764344815160-0e2afc6939a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "p3",
    title: "Mobile App Icons",
    category: "UI Design",
    description: "Custom icon set for a fitness tracking mobile application",
    image:
      "https://images.unsplash.com/photo-1758786977080-a5e60a3f843c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "p4",
    title: "Website Design",
    category: "Web Design",
    description: "Landing page design for an e-commerce platform",
    image:
      "https://images.unsplash.com/photo-1707836868495-3307d371aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

export function ProviderProfile() {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setIsLoading(true);
        setError("");
        const [providerServices, providerReviews] = await Promise.all([
          getServices({ providerId }),
          getProviderReviews(providerId),
        ]);
        setServices(providerServices);
        setReviews(providerReviews);
      } catch (err) {
        setError(err.message || "Failed to load provider profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  const provider = services[0]?.ProviderID;
  const rating = useMemo(() => {
    if (reviews.length > 0) {
      const average =
        reviews.reduce((total, review) => total + Number(review.Score || 0), 0) /
        reviews.length;
      return Math.round(average * 10) / 10;
    }
    return provider?.Rating || 0;
  }, [provider?.Rating, reviews]);

  const selectedItem = portfolio.find((item) => item.id === selectedPortfolioItem);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          isAuthenticated={!!userInfo}
          userRole={userInfo?.Role}
          userName={userInfo?.Name}
        />
        <div className="flex items-center justify-center py-32 text-gray-500">
          Loading provider profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          isAuthenticated={!!userInfo}
          userRole={userInfo?.Role}
          userName={userInfo?.Name}
        />
        <div className="flex items-center justify-center py-32 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  const providerName = provider?.Name || "Student Freelancer";
  const providerMajor = provider?.Major || "KFUPM student";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={!!userInfo}
        userRole={userInfo?.Role}
        userName={userInfo?.Name}
      />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/services")}
          className="mb-6"
        >
          Back to Services
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#F7931E] to-orange-600 p-8 shadow-lg">
                    <span className="text-4xl font-bold text-white">
                      {providerName[0]}
                    </span>
                  </div>

                  <div className="mb-2 flex items-center justify-center gap-2">
                    <h2 className="text-2xl font-bold">{providerName}</h2>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>

                  <div className="mb-4 flex items-center justify-center">
                    <StarRating rating={rating} size="md" />
                    <span className="ml-2 text-sm text-gray-600">
                      ({reviews.length} reviews)
                    </span>
                  </div>

                  <div className="flex justify-center gap-2">
                    <Button
                      className="flex-1 bg-[#F7931E] hover:bg-[#F7931E]/90"
                      onClick={() =>
                        userInfo
                          ? navigate(`/messages?user=${providerId}`)
                          : navigate("/login")
                      }
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsFavorite((value) => !value)}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">{providerMajor}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Response time: within 1 day</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#F7931E]" />
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm text-gray-700">Listed Services</span>
                  <span className="font-bold text-[#F7931E]">{services.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm text-gray-700">Average Rating</span>
                  <span className="font-bold text-green-600">{rating || "New"}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm text-gray-700">Reviews</span>
                  <span className="font-bold text-[#F7931E]">{reviews.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-gray-700">
                  {providerName} is a verified KFUPM student freelancer offering
                  services through Mahamma. Browse available services and reviews
                  below before starting a job.
                </p>
              </CardContent>
            </Card>

            <Tabs defaultValue="services">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="space-y-4">
                {services.map((service) => (
                  <Card
                    key={service._id}
                    className="border-2 border-transparent transition-all hover:border-[#F7931E] hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <Badge variant="secondary" className="mb-2">
                            {service.Category}
                          </Badge>
                          <CardTitle className="mb-2 text-lg">
                            {service.Title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {service.Description}
                          </CardDescription>
                        </div>
                        <p className="text-right text-2xl font-bold text-[#F7931E]">
                          {service.Price} SAR
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {service.DeliveryTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[#F7931E] text-[#F7931E]" />
                          {service.AverageRating || rating || "New"}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {service.ReviewCount || 0} reviews
                        </span>
                      </div>
                      <Button
                        className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                        onClick={() => navigate(`/services/${service._id}`)}
                      >
                        View Service Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {services.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center text-gray-500">
                      No services listed yet.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">
                            {review.ReviewerID?.Name || "Mahamma user"}
                          </CardTitle>
                          <StarRating rating={review.Score} showNumber={false} />
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{review.Comment || "No comment."}</p>
                    </CardContent>
                  </Card>
                ))}

                {reviews.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center text-gray-500">
                      No reviews yet.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio</CardTitle>
                    <CardDescription>Recent project highlights</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
                    {portfolio.map((item) => (
                      <button
                        key={item.id}
                        className="group relative aspect-video overflow-hidden rounded-lg border-2 border-transparent bg-gray-200 text-left transition-all hover:border-[#F7931E] hover:shadow-lg"
                        onClick={() => setSelectedPortfolioItem(item.id)}
                        type="button"
                      >
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 text-white transition-transform group-hover:translate-y-0">
                          <h3 className="mb-1 font-semibold">{item.title}</h3>
                          <Badge variant="secondary" className="mb-2 text-xs">
                            {item.category}
                          </Badge>
                          <p className="line-clamp-2 text-xs text-gray-200">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedPortfolioItem(null)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-lg bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-10 bg-white/90 hover:bg-white"
                onClick={() => setSelectedPortfolioItem(null)}
              >
                <XIcon className="h-5 w-5" />
              </Button>
              <ImageWithFallback
                src={selectedItem.image}
                alt={selectedItem.title}
                className="max-h-[70vh] w-full bg-gray-900 object-contain"
              />
            </div>
            <div className="p-6">
              <h2 className="mb-2 text-2xl font-bold">{selectedItem.title}</h2>
              <Badge variant="secondary" className="mb-4">
                {selectedItem.category}
              </Badge>
              <p className="text-gray-700">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
