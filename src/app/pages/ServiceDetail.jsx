import { useState } from "react";
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
import { StarRating } from "../components/StarRating";
import { 
  Clock, 
  MessageSquare, 
  User, 
  Star, 
  ArrowLeft, 
  CheckCircle, 
  Shield, 
  Share2, 
  AlertTriangle 
} from "lucide-react";
import { mockServices, mockReviews } from "../lib/mock-data";
import { toast } from "sonner";

export function ServiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Find the service by ID
  const service = mockServices.find((s) => s.id === id) || mockServices[0];
  
  // Get reviews for this provider (mocked)
  const reviews = mockReviews.filter(r => r.revieweeId === service.providerId);

  const handleOrder = () => {
    toast.success("Order request sent! The provider will contact you soon.");
    setTimeout(() => navigate("/client/dashboard"), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} userRole="client" userName="Abdullah" />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/services")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Main Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary">{service.category}</Badge>
                      {service.verified && (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified Student
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-3xl mb-4">
                      {service.title}
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-100 text-[#F7931E] rounded-full p-2">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{service.providerName}</p>
                          <StarRating rating={service.providerRating} size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">About This Service</h3>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {service.description}
                  </p>
                  <p className="mt-4 text-gray-700">
                    Choosing a fellow student means you get someone who understands your context and can provide high-quality work at a student-friendly price. I take pride in my work and ensure every client is satisfied with the results.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase font-semibold">Delivery</p>
                    <p className="text-sm font-medium">{service.deliveryTime}</p>
                  </div>
                  <div className="text-center">
                    <Star className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase font-semibold">Rating</p>
                    <p className="text-sm font-medium">{service.providerRating}</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase font-semibold">Revisions</p>
                    <p className="text-sm font-medium">{service.revisions}</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase font-semibold">Verified</p>
                    <p className="text-sm font-medium">Yes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Reviews from KFUPM Students</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-6 border-b last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center">
                              <span className="text-xs font-bold">{review.reviewerName[0]}</span>
                            </div>
                            <span className="font-medium text-sm">{review.reviewerName}</span>
                          </div>
                          <StarRating rating={review.rating} size="xs" showNumber={false} />
                        </div>
                        <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
                        <p className="text-xs text-gray-400 mt-2">{review.createdAt}</p>
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

          {/* Sidebar - Booking Section */}
          <div className="space-y-6">
            <Card className="border-2 border-orange-100">
              <CardHeader className="bg-orange-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Starting at</span>
                  <span className="text-3xl font-bold text-[#F7931E]">{service.price} SAR</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{service.deliveryTime} Express Delivery</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span>{service.revisions} Rounds of Revisions</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Source Files Included</span>
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
                    onClick={() => navigate("/messages")}
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Contact Provider
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-center text-xs text-gray-500">
                    Secure payment through KFUPM Mahamma portal. Your money is held until the work is approved.
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
                    {service.providerName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{service.providerName}</h4>
                    <p className="text-sm text-gray-500">Student Freelancer</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-[#F7931E] text-[#F7931E]" />
                      <span className="text-xs font-bold text-[#F7931E]">{service.providerRating}</span>
                      <span className="text-xs text-gray-400">(45 reviews)</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate(`/providers/${service.providerId}`)}
                >
                  View Full Profile
                </Button>
              </CardContent>
            </Card>

            {/* Share & Report */}
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
