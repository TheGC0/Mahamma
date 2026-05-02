import { useState, useEffect } from "react";
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
  FileText,
  Calendar,
  DollarSign,
  Inbox,
  CheckCircle,
} from "lucide-react";
import { getTaskById, getProposalsByTask, updateTask } from "../../lib/api";

export function RequestDetails() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [task, setTask] = useState(null);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [shortlistedIds, setShortlistedIds] = useState([]);

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
        setError(err.message || "Failed to load task.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [taskId]);

  const toggleShortlist = (offerId) => {
    setShortlistedIds((prev) =>
      prev.includes(offerId) ? prev.filter((id) => id !== offerId) : [...prev, offerId]
    );
  };

  const handleCloseTask = async () => {
    try {
      await updateTask(taskId, { Status: "cancelled" });
      navigate("/client/dashboard");
    } catch (err) {
      setError(err.message || "Failed to close task.");
    }
  };

  const shortlistedOffers = offers.filter((o) => shortlistedIds.includes(o._id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />
        <div className="flex items-center justify-center py-32 text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />
        <div className="flex items-center justify-center py-32 text-red-500">{error || "Task not found."}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={!!userInfo} userRole={userInfo?.Role} userName={userInfo?.Name} />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/client/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{task.Title}</CardTitle>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{task.Category}</Badge>
                      <Badge className="bg-green-100 text-green-700 border-green-300">
                        {task.Status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Posted {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{task.Description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">Budget</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{task.Budget} SAR</p>
                  </div>
                  {task.Deadline && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Deadline</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(task.Deadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Received Offers ({offers.length})</CardTitle>
                <CardDescription>Review proposals from verified student freelancers</CardDescription>
              </CardHeader>
              <CardContent>
                {offers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                      <Inbox className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Your task has been posted successfully. Freelancers will start submitting their proposals soon.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-sm text-blue-900">
                        💡 <strong>Tip:</strong> Tasks with clear descriptions and realistic budgets typically receive offers within 24 hours.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {offers.map((offer) => (
                      <div
                        key={offer._id}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          shortlistedIds.includes(offer._id)
                            ? "border-[#F7931E] bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-200 rounded-full p-2">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {offer.FreelancerID?.Name || "Unknown"}
                              </h4>
                              <StarRating rating={offer.FreelancerID?.Rating || 0} />
                            </div>
                          </div>

                          <Button
                            variant={shortlistedIds.includes(offer._id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleShortlist(offer._id)}
                            className={shortlistedIds.includes(offer._id) ? "bg-[#F7931E] hover:bg-[#F7931E]/90" : ""}
                          >
                            <Star className={`h-4 w-4 mr-1 ${shortlistedIds.includes(offer._id) ? "fill-white" : ""}`} />
                            {shortlistedIds.includes(offer._id) ? "Shortlisted" : "Shortlist"}
                          </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Price:</span>
                            <span className="font-semibold text-[#F7931E]">{offer.BidAmount} SAR</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Delivery:</span>
                            <span className="font-semibold">{offer.EstimatedTime}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                            {offer.CoverLetter}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/providers/${offer.FreelancerID?._id}`)}
                          >
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => navigate("/messages")}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </div>

                        <p className="text-xs text-gray-500 mt-3">
                          Submitted {new Date(offer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {shortlistedOffers.length > 0 && (
              <Card className="border-[#F7931E]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-[#F7931E] fill-[#F7931E]" />
                    Shortlisted ({shortlistedOffers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {shortlistedOffers.map((offer) => (
                    <div key={offer._id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="font-medium text-gray-900 mb-1">{offer.FreelancerID?.Name}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#F7931E] font-semibold">{offer.BidAmount} SAR</span>
                        <span className="text-gray-600">{offer.EstimatedTime}</span>
                      </div>
                    </div>
                  ))}
                  <Button
                    className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90"
                    onClick={() => navigate(`/client/compare-offers/${taskId}`)}
                  >
                    Compare Shortlisted
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {offers.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(`/client/compare-offers/${taskId}`)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Compare All Offers
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/client/edit-task/${taskId}`)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Task
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={handleCloseTask}
                >
                  <span>Close Task</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Use shortlist to mark promising offers</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Check provider ratings and reviews</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Message freelancers to clarify details</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#F7931E]">•</span><span>Compare shortlisted offers before deciding</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
