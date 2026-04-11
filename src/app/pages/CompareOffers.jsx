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
import { StarRating } from "../components/StarRating";
import {
  Clock,
  MessageSquare,
  CheckCircle,
  User,
  ArrowLeft,
  Check,
  X as XIcon,
} from "lucide-react";
import { mockOffers } from "../lib/mock-data";

export function CompareOffers() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Get offers for this task
  const offers = mockOffers.filter((o) => o.taskId === taskId);

  // Mock task data
  const task = {
    title: "Mobile App UI Design",
    category: "Design",
    budgetMin: 300,
    budgetMax: 500,
    deadline: "March 5, 2026",
  };

  const handleAcceptOffer = (offerId) => {
    setSelectedOfferId(offerId);
    setShowConfirmation(true);
  };

  const confirmBooking = () => {
    // Mock accept - would create a job
    navigate("/client/dashboard");
  };

  const selectedOffer = offers.find((o) => o.id === selectedOfferId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} userRole="client" userName="Abdullah" />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/client/request/${taskId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Request
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Compare Offers
          </h1>
          <p className="text-gray-600">
            {task.title} - {offers.length} offers received
          </p>
        </div>

        {/* Task Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <Badge variant="secondary">{task.category}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Budget Range</p>
                <p className="font-medium">
                  {task.budgetMin} - {task.budgetMax} SAR
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Deadline</p>
                <p className="font-medium">{task.deadline}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {offers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">No offers received yet</p>
              <p className="text-sm text-gray-400">
                Freelancers will submit their proposals soon. You'll be notified
                when you receive offers.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Comparison Table */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Side-by-Side Comparison</CardTitle>
                <CardDescription>
                  Compare key details of each offer at a glance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-4 font-semibold text-gray-700 bg-gray-50">
                          Criteria
                        </th>
                        {offers.map((offer) => (
                          <th
                            key={offer.id}
                            className="p-4 text-center bg-gray-50"
                          >
                            <div className="bg-white rounded-lg p-3 border">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="bg-gray-200 rounded-full p-2">
                                  <User className="h-4 w-4" />
                                </div>
                                <span className="font-semibold text-sm">
                                  {offer.providerName}
                                </span>
                              </div>
                              <StarRating
                                rating={offer.providerRating}
                                size="sm"
                              />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Price Row */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-700">Price</td>
                        {offers.map((offer) => (
                          <td key={offer.id} className="p-4 text-center">
                            <span className="text-xl font-bold text-[#F7931E]">
                              {offer.price} SAR
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Delivery Time Row */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-700">
                          Delivery Time
                        </td>
                        {offers.map((offer) => (
                          <td key={offer.id} className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Clock className="h-4 w-4 text-gray-600" />
                              <span className="font-medium">
                                {offer.deliveryTime}
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Rating Row */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-700">
                          Provider Rating
                        </td>
                        {offers.map((offer) => (
                          <td key={offer.id} className="p-4 text-center">
                            <span className="text-lg font-semibold">
                              {offer.providerRating}
                            </span>
                            <span className="text-gray-500 text-sm">/5.0</span>
                          </td>
                        ))}
                      </tr>

                      {/* Value Row */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-700">
                          Within Budget
                        </td>
                        {offers.map((offer) => (
                          <td key={offer.id} className="p-4 text-center">
                            {offer.price >= task.budgetMin &&
                            offer.price <= task.budgetMax ? (
                              <div className="flex items-center justify-center gap-1 text-green-600">
                                <Check className="h-5 w-5" />
                                <span className="font-medium">Yes</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 text-red-600">
                                <XIcon className="h-5 w-5" />
                                <span className="font-medium">No</span>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Proposal Row */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-700">
                          Proposal
                        </td>
                        {offers.map((offer) => (
                          <td key={offer.id} className="p-4">
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border text-left">
                              {offer.message}
                            </p>
                          </td>
                        ))}
                      </tr>

                      {/* Action Row */}
                      <tr className="bg-gray-50">
                        <td className="p-4 font-medium text-gray-700">
                          Action
                        </td>
                        {offers.map((offer) => (
                          <td key={offer.id} className="p-4">
                            <div className="space-y-2">
                              <Button
                                className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                                onClick={() => handleAcceptOffer(offer.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept Offer
                              </Button>
                              <Button variant="outline" className="w-full">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Individual Cards View (Mobile Friendly) */}
            <div className="lg:hidden">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Detailed Offers
              </h2>
              <div className="grid gap-6">
                {offers.map((offer) => (
                  <Card
                    key={offer.id}
                    className="hover:shadow-lg transition-all border-2 hover:border-[#F7931E]"
                  >
                    <CardHeader>
                      {/* Provider Info */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="bg-gray-200 rounded-full p-3">
                          <User className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {offer.providerName}
                          </h3>
                          <StarRating rating={offer.providerRating} />
                        </div>
                      </div>

                      {/* Offer Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Price</span>
                          <span className="text-2xl font-bold text-[#F7931E]">
                            {offer.price} SAR
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">
                            Delivery Time
                          </span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">
                              {offer.deliveryTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Proposal Message */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Proposal
                        </p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {offer.message}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                          onClick={() => handleAcceptOffer(offer.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Offer
                        </Button>
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500 text-center">
                        Submitted {offer.createdAt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Comparison Tips */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">
                  Tips for Choosing the Right Offer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#F7931E]">•</span>
                    <span>Review the provider's rating and completed jobs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F7931E]">•</span>
                    <span>Consider both price and delivery time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F7931E]">•</span>
                    <span>Read the proposal message carefully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F7931E]">•</span>
                    <span>
                      Ask questions before accepting if anything is unclear
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}

        {/* Booking Confirmation Modal */}
        {showConfirmation && selectedOffer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-lg w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-[#F7931E]" />
                  Confirm Booking
                </CardTitle>
                <CardDescription>
                  You're about to accept this offer and start working with the
                  freelancer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Offer Summary */}
                <div className="bg-orange-50 border-2 border-[#F7931E] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gray-200 rounded-full p-2">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {selectedOffer.providerName}
                      </h4>
                      <StarRating
                        rating={selectedOffer.providerRating}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-xl font-bold text-[#F7931E]">
                        {selectedOffer.price} SAR
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery Time</p>
                      <p className="font-semibold">
                        {selectedOffer.deliveryTime}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm text-gray-700">
                      {selectedOffer.message}
                    </p>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 mb-2">
                    <strong>What happens next:</strong>
                  </p>
                  <ul className="text-sm text-blue-900 space-y-1">
                    <li>
                      • The freelancer will be notified and can start working
                    </li>
                    <li>• Other offers will be automatically declined</li>
                    <li>• You can track progress in your dashboard</li>
                    <li>• Payment will be processed after delivery</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-[#F7931E] hover:bg-[#F7931E]/90"
                    onClick={confirmBooking}
                  >
                    Confirm & Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
