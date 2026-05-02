import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { StarRating } from "../components/StarRating";
import {
  Clock,
  MessageSquare,
  User,
  Star,
  ArrowLeft,
  CheckCircle,
  Share2,
  AlertTriangle,
} from "lucide-react";
import { getServiceById, getServiceReviews } from "../../lib/api";
import { toast } from "sonner";

export function ServiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [svc, revs] = await Promise.all([
          getServiceById(id),
          getServiceReviews(id),
        ]);
        setService(svc);
        setReviews(revs);
      } catch (err) {
        setError(err.message || "Failed to load service.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleOrder = () => {
    if (!userInfo) { navigate("/login"); return; }
    toast.success("Order request sent! The provider will contact you soon.");
    setTimeout(() => navigate("/client/dashboard"), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />
        <div className="flex items-center justify-center py-32 text-gray-500">Loading service...</div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />
        <div className="flex items-center justify-center py-32 text-red-500">{error || "Service not found."}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/services")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary">{service.Category}</Badge>
                    </div>
                    <CardTitle className="text-3xl mb-4">{service.Title}</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-100 text-[#F7931E] rounded-full p-2">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{service.ProviderID?.Name}</p>
                          <StarRating rating={service.ProviderID?.Rating || 0} size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">About This Service</h3>
                  <p className="text-gray-700 leading-relaxed text-base">{service.Description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase font-semibold">Delivery</p>
                    <p className="text-sm font-medium">{service.DeliveryTime}</p>
                  </div>
                  <div className="text-center">
                    <Star className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase font-semibold">Rating</p>
                    <p className="text-sm font-medium">{service.AverageRating || service.ProviderID?.Rating || "N/A"}</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase font-semibold">Reviews</p>
                    <p className="text-sm font-medium">{service.ReviewCount || reviews.length}</p>
                  </div>
                </div>

                {service.Tags && service.Tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {service.Tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="pb-6 border-b last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center">
                              <span className="text-xs font-bold">
                                {review.ReviewerID?.Name?.[0] || "?"}
                              </span>
                            </div>
                            <span className="font-medium text-sm">{review.ReviewerID?.Name}</span>
                          </div>
                          <StarRating rating={review.Score} size="xs" showNumber={false} />
                        </div>
                        <p className="text-gray-600 text-sm italic">"{review.Comment}"</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No reviews yet for this service.</p>
                    <p className="text-xs text-gray-400">Be the first to hire and leave feedback!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-orange-100">
              <CardHeader className="bg-orange-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Starting at</span>
                  <span className="text-3xl font-bold text-[#F7931E]">{service.Price} SAR</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{service.DeliveryTime} Delivery</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Verified KFUPM Student</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full h-12 text-lg bg-[#F7931E] hover:bg-[#F7931E]/90"
                    onClick={handleOrder}
                  >
                    Order Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={() =>
                      userInfo
                        ? navigate(
                            service.ProviderID?._id
                              ? `/messages?user=${service.ProviderID._id}`
                              : "/messages",
                          )
                        : navigate("/login")
                    }
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Contact Provider
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-center text-xs text-gray-500">
                    Secure payment through KFUPM Mahamma portal.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Provider Mini Profile */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">About the Freelancer</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-[#F7931E] to-orange-600 h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {service.ProviderID?.Name?.[0] || "?"}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{service.ProviderID?.Name}</h4>
                    <p className="text-sm text-gray-500">Student Freelancer</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-[#F7931E] text-[#F7931E]" />
                      <span className="text-xs font-bold text-[#F7931E]">
                        {service.ProviderID?.Rating || "0"}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate(`/providers/${service.ProviderID?._id}`)}
                >
                  View Full Profile
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-between px-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#F7931E]">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
