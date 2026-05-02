import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
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
import { getTaskById, getProposalsByTask, updateProposalStatus, createContract } from "../../lib/api";

export function CompareOffers() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [task, setTask] = useState(null);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userInfo) { navigate("/login"); return; }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [taskData, proposalsData] = await Promise.all([
          getTaskById(taskId),
          getProposalsByTask(taskId),
        ]);
        setTask(taskData);
        setOffers(proposalsData);
      } catch (err) {
        setError(err.message || "Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [taskId]);

  const handleAcceptOffer = (offerId) => {
    setSelectedOfferId(offerId);
    setShowConfirmation(true);
  };

  const confirmBooking = async () => {
    try {
      setIsAccepting(true);
      await updateProposalStatus(selectedOfferId, "accepted");
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 30);
      await createContract({
        ProposalID: selectedOfferId,
        Deadline: deadline.toISOString(),
      });
      navigate("/client/dashboard");
    } catch (err) {
      setError(err.message || "Failed to accept offer.");
      setShowConfirmation(false);
    } finally {
      setIsAccepting(false);
    }
  };

  const selectedOffer = offers.find((o) => o._id === selectedOfferId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />
        <div className="flex items-center justify-center py-32 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(`/client/request/${taskId}`)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Request
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Offers</h1>
          <p className="text-gray-600">
            {task?.Title} - {offers.length} offers received
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>
        )}

        {task && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Task Details</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <Badge variant="secondary">{task.Category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Budget</p>
                  <p className="font-medium">{task.Budget} SAR</p>
                </div>
                {task.Deadline && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Deadline</p>
                    <p className="font-medium">{new Date(task.Deadline).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {offers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">No offers received yet</p>
              <p className="text-sm text-gray-400">Freelancers will submit their proposals soon.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Side-by-Side Comparison</CardTitle>
                <CardDescription>Compare key details of each offer at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-4 font-semibold text-gray-700 bg-gray-50">Criteria</th>
                        {offers.map((offer) => (
                          <th key={offer._id} className="p-4 text-center bg-gray-50">
                            <div className="bg-white rounded-lg p-3 border">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="bg-gray-200 rounded-full p-2">
                                  <User className="h-4 w-4" />
                                </div>
                                <span className="font-semibold text-sm">
                                  {offer.FreelancerID?.Name || "Unknown"}
                                </span>
                              </div>
                              <StarRating rating={offer.FreelancerID?.Rating || 0} size="sm" />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-700">Price</td>
                        {offers.map((offer) => (
                          <td key={offer._id} className="p-4 text-center">
                            <span className="text-xl font-bold text-[#F7931E]">{offer.BidAmount} SAR</span>
                          </td>
                        ))}
                      </tr>

                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-700">Delivery Time</td>
                        {offers.map((offer) => (
                          <td key={offer._id} className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Clock className="h-4 w-4 text-gray-600" />
                              <span className="font-medium">{offer.EstimatedTime}</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-700">Provider Rating</td>
                        {offers.map((offer) => (
                          <td key={offer._id} className="p-4 text-center">
                            <span className="text-lg font-semibold">{offer.FreelancerID?.Rating || 0}</span>
                            <span className="text-gray-500 text-sm">/5.0</span>
                          </td>
                        ))}
                      </tr>

                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-700">Within Budget</td>
                        {offers.map((offer) => (
                          <td key={offer._id} className="p-4 text-center">
                            {task && offer.BidAmount <= task.Budget ? (
                              <div className="flex items-center justify-center gap-1 text-green-600">
                                <Check className="h-5 w-5" /><span className="font-medium">Yes</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 text-red-600">
                                <XIcon className="h-5 w-5" /><span className="font-medium">No</span>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-700">Proposal</td>
                        {offers.map((offer) => (
                          <td key={offer._id} className="p-4">
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border text-left">
                              {offer.CoverLetter}
                            </p>
                          </td>
                        ))}
                      </tr>

                      <tr className="bg-gray-50">
                        <td className="p-4 font-medium text-gray-700">Action</td>
                        {offers.map((offer) => (
                          <td key={offer._id} className="p-4">
                            <div className="space-y-2">
                              <Button
                                className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                                onClick={() => handleAcceptOffer(offer._id)}
                                disabled={offer.Status !== "pending"}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {offer.Status === "pending" ? "Accept Offer" : offer.Status}
                              </Button>
                              <Button variant="outline" className="w-full" onClick={() => navigate("/messages")}>
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

            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader><CardTitle className="text-lg">Tips for Choosing the Right Offer</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Review the provider's rating and completed jobs</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Consider both price and delivery time</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Read the proposal message carefully</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Ask questions before accepting if anything is unclear</span></li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}

        {showConfirmation && selectedOffer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-lg w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-[#F7931E]" />
                  Confirm Booking
                </CardTitle>
                <CardDescription>
                  You're about to accept this offer and start working with the freelancer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 border-2 border-[#F7931E] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gray-200 rounded-full p-2">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{selectedOffer.FreelancerID?.Name}</h4>
                      <StarRating rating={selectedOffer.FreelancerID?.Rating || 0} size="sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-xl font-bold text-[#F7931E]">{selectedOffer.BidAmount} SAR</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery Time</p>
                      <p className="font-semibold">{selectedOffer.EstimatedTime}</p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm text-gray-700">{selectedOffer.CoverLetter}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 mb-2"><strong>What happens next:</strong></p>
                  <ul className="text-sm text-blue-900 space-y-1">
                    <li>• The freelancer will be notified and can start working</li>
                    <li>• Other offers will be automatically declined</li>
                    <li>• You can track progress in your dashboard</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-[#F7931E] hover:bg-[#F7931E]/90"
                    onClick={confirmBooking}
                    disabled={isAccepting}
                  >
                    {isAccepting ? "Processing..." : "Confirm & Accept"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowConfirmation(false)}>
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
