import { useNavigate, useParams } from "react-router";
import { useState } from "react";
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
  Star,
  CheckCircle,
  MapPin,
  Calendar,
  Briefcase,
  Heart,
  MessageSquare,
  Clock,
  Award,
  TrendingUp,
  X as XIcon,
} from "lucide-react";
import { mockReviews } from "../lib/mock-data";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function ProviderProfile() {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock provider data
  const provider = {
    id: providerId,
    name: "Ahmed Al-Otaibi",
    verified: true,
    rating: 4.9,
    totalReviews: 45,
    completedJobs: 52,
    joinedDate: "January 2025",
    location: "KFUPM, Dhahran",
    responseTime: "< 1 hour",
    bio: "Professional graphic designer with 3+ years of experience. I specialize in logo design, brand identity, and digital illustrations. Passionate about creating modern, clean designs that help businesses stand out. I've worked with startups, small businesses, and student organizations to develop their visual identity.",
    skills: [
      "Logo Design",
      "Brand Identity",
      "Illustration",
      "Adobe Creative Suite",
      "Figma",
      "UI/UX Design",
    ],
    languages: ["Arabic (Native)", "English (Fluent)"],
    education:
      "King Fahd University of Petroleum & Minerals - Computer Engineering",
  };

  const services = [
    {
      id: "s1",
      title: "Professional Logo Design",
      price: 150,
      deliveryTime: "3 days",
      rating: 4.9,
      orders: 12,
    },
    {
      id: "s2",
      title: "Business Card Design",
      price: 80,
      deliveryTime: "2 days",
      rating: 5.0,
      orders: 8,
    },
    {
      id: "s3",
      title: "Brand Identity Package",
      price: 350,
      deliveryTime: "7 days",
      rating: 4.8,
      orders: 5,
    },
  ];

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
        "Complete brand identity including logo, menu design, and signage for local restaurant",
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
      description: "Landing page design for e-commerce platform",
      image:
        "https://images.unsplash.com/photo-1707836868495-3307d371aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    {
      id: "p5",
      title: "Business Cards",
      category: "Print Design",
      description: "Professional business card design for consulting firm",
      image:
        "https://images.unsplash.com/photo-1718670013921-2f144aba173a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    {
      id: "p6",
      title: "Product Packaging",
      category: "Packaging Design",
      description: "Creative packaging design for organic skincare products",
      image:
        "https://images.unsplash.com/photo-1748765968965-7e18d4f7192b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
  ];

  const reviews = mockReviews.filter((r) => r.revieweeId === providerId);
  const selectedItem = portfolio.find((p) => p.id === selectedPortfolioItem);

  const handleContact = () => {
    navigate("/messages");
  };

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} userRole="client" userName="Abdullah" />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/services")}
          className="mb-6"
        >
          ← Back to Services
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-[#F7931E] to-orange-600 rounded-full p-8 w-32 h-32 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-white">
                      {provider.name[0]}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{provider.name}</h2>
                    {provider.verified && (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <StarRating rating={provider.rating} size="md" />
                    <span className="ml-2 text-sm text-gray-600">
                      ({provider.totalReviews} reviews)
                    </span>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button
                      className="flex-1 bg-[#F7931E] hover:bg-[#F7931E]/90"
                      onClick={handleContact}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleToggleFavorite}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isFavorite
                            ? "fill-red-500 text-red-500"
                            : "text-gray-700"
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">{provider.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">
                      Member since {provider.joinedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">
                      {provider.completedJobs} jobs completed
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">
                      Response time: {provider.responseTime}
                    </span>
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
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Success Rate</span>
                  <span className="font-bold text-green-600">98%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">
                    On-time Delivery
                  </span>
                  <span className="font-bold text-green-600">95%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Repeat Clients</span>
                  <span className="font-bold text-[#F7931E]">25%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {provider.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {provider.languages.map((lang) => (
                    <div key={lang} className="text-sm text-gray-700">
                      • {lang}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{provider.education}</p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{provider.bio}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="portfolio">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <CardTitle>My Work</CardTitle>
                    <CardDescription>
                      Showcase of recent projects and designs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {portfolio.map((item) => (
                        <div
                          key={item.id}
                          className="group relative aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-[#F7931E]"
                          onClick={() => setSelectedPortfolioItem(item.id)}
                        >
                          <ImageWithFallback
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                            <h3 className="font-semibold mb-1">{item.title}</h3>
                            <Badge variant="secondary" className="text-xs mb-2">
                              {item.category}
                            </Badge>
                            <p className="text-xs text-gray-200 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <div className="grid gap-4">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className="hover:shadow-lg transition-all border-2 border-transparent hover:border-[#F7931E]"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">
                              {service.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{service.deliveryTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-[#F7931E] text-[#F7931E]" />
                                <span>{service.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{service.orders} orders</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#F7931E]">
                              {service.price} SAR
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button
                          className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                          onClick={() => navigate(`/services/${service.id}`)}
                        >
                          View Service Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {review.reviewerName}
                          </CardTitle>
                          <StarRating
                            rating={review.rating}
                            showNumber={false}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}

                {reviews.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-gray-500">No reviews yet</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPortfolioItem(null)}
        >
          <div
            className="max-w-4xl w-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white z-10"
                onClick={() => setSelectedPortfolioItem(null)}
              >
                <XIcon className="h-5 w-5" />
              </Button>
              <ImageWithFallback
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full max-h-[70vh] object-contain bg-gray-900"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedItem.title}
                  </h2>
                  <Badge variant="secondary">{selectedItem.category}</Badge>
                </div>
              </div>
              <p className="text-gray-700">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}