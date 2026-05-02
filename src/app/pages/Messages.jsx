import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Send,
  Search,
  MoreVertical,
  CheckCheck,
  Check,
  ArrowLeft,
} from "lucide-react";
import {
  createConversation,
  getConversationMessages,
  getConversations,
  sendConversationMessage,
} from "../../lib/api";

const formatMessageTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString();
};

const getParticipant = (conversation, currentUserId) => {
  const participants = conversation?.Participants || [];
  return (
    participants.find((participant) => participant._id !== currentUserId) ||
    participants[0] ||
    null
  );
};

const mergeConversation = (items, conversation) => {
  if (!conversation?._id) return items;
  const existingIndex = items.findIndex((item) => item._id === conversation._id);
  if (existingIndex === -1) return [conversation, ...items];

  return items.map((item) =>
    item._id === conversation._id ? { ...item, ...conversation } : item,
  );
};

export function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversation");
  const targetUserId = searchParams.get("user");
  const userInfo = useMemo(
    () => JSON.parse(localStorage.getItem("userInfo") || "null"),
    [],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(
    conversationId || "",
  );
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userInfo) navigate("/login");
  }, [navigate, userInfo]);

  useEffect(() => {
    if (!userInfo) return;

    let isMounted = true;

    const loadConversations = async () => {
      try {
        setIsLoadingConversations(true);
        setError("");

        let activeConversationId = conversationId || "";
        let directConversation = null;

        if (targetUserId) {
          directConversation = await createConversation(targetUserId);
          activeConversationId = directConversation._id;
          if (isMounted) {
            setSelectedConversation(directConversation._id);
            setConversations((current) =>
              mergeConversation(current, directConversation),
            );
            navigate(`/messages?conversation=${directConversation._id}`, {
              replace: true,
            });
          }
        } else if (conversationId && isMounted) {
          setSelectedConversation(conversationId);
        }

        let data = await getConversations();
        if (directConversation) {
          data = mergeConversation(data, directConversation);
        }
        if (!isMounted) return;

        setConversations(data);
        if (activeConversationId) {
          setSelectedConversation(activeConversationId);
        }

        if (!activeConversationId && data.length > 0) {
          setSelectedConversation(data[0]._id);
          navigate(`/messages?conversation=${data[0]._id}`, { replace: true });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load conversations.");
        }
      } finally {
        if (isMounted) setIsLoadingConversations(false);
      }
    };

    loadConversations();

    return () => {
      isMounted = false;
    };
  }, [conversationId, navigate, targetUserId, userInfo]);

  useEffect(() => {
    if (!userInfo || !selectedConversation) {
      setMessages([]);
      return;
    }

    let isMounted = true;

    const loadMessages = async ({ showLoader = false } = {}) => {
      try {
        if (showLoader) setIsLoadingMessages(true);
        setError("");
        const data = await getConversationMessages(selectedConversation);
        if (!isMounted) return;

        setMessages(data);
        const refreshed = await getConversations();
        if (isMounted) setConversations(refreshed);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load messages.");
      } finally {
        if (isMounted && showLoader) setIsLoadingMessages(false);
      }
    };

    loadMessages({ showLoader: true });
    const intervalId = window.setInterval(() => {
      loadMessages();
    }, 10000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [selectedConversation, userInfo]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const currentConversation = conversations.find(
    (conversation) => conversation._id === selectedConversation,
  );
  const currentParticipant = getParticipant(
    currentConversation,
    userInfo?._id,
  );

  const filteredConversations = conversations.filter((conversation) => {
    const participant = getParticipant(conversation, userInfo?._id);
    const haystack = [
      participant?.Name,
      participant?.Email,
      participant?.Role,
      conversation.LastMessage,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(searchQuery.toLowerCase());
  });

  const totalUnreadCount = conversations.reduce(
    (sum, conversation) => sum + Number(conversation.UnreadCount || 0),
    0,
  );

  const handleSelectConversation = (id) => {
    setSelectedConversation(id);
    navigate(`/messages?conversation=${id}`);
  };

  const handleSendMessage = async () => {
    const body = newMessage.trim();

    if (!body || !selectedConversation || isSending) return;

    try {
      setIsSending(true);
      setNewMessage("");
      const sent = await sendConversationMessage(selectedConversation, body);
      setMessages((current) => [...current, sent]);
      const refreshed = await getConversations();
      setConversations(refreshed);
    } catch (err) {
      setNewMessage(body);
      setError(err.message || "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        isAuthenticated={!!userInfo}
        userRole={userInfo?.Role}
        userName={userInfo?.Name}
      />

      <div className="container mx-auto max-w-7xl px-4 py-8 flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">
            {totalUnreadCount > 0 ? (
              <span className="font-medium text-[#F7931E]">
                {totalUnreadCount} unread message
                {totalUnreadCount > 1 ? "s" : ""}
              </span>
            ) : (
              "All caught up!"
            )}
          </p>
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
          <div
            className={`lg:col-span-1 ${
              selectedConversation && currentConversation ? "hidden lg:block" : ""
            }`}
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b flex-shrink-0">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0 min-h-0">
                <div className="divide-y">
                  {isLoadingConversations ? (
                    <div className="p-8 text-center text-gray-500">
                      Loading conversations...
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => {
                      const participant = getParticipant(
                        conversation,
                        userInfo?._id,
                      );

                      return (
                        <button
                          key={conversation._id}
                          onClick={() =>
                            handleSelectConversation(conversation._id)
                          }
                          className={`block w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                            selectedConversation === conversation._id
                              ? "bg-orange-50 border-l-4 border-[#F7931E]"
                              : ""
                          }`}
                          type="button"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="bg-gradient-to-br from-[#F7931E] to-orange-600 rounded-full p-3 flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {participant?.Name?.[0] || "M"}
                                </span>
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="font-semibold text-sm truncate">
                                  {participant?.Name || "Mahamma user"}
                                </h4>
                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                  {formatMessageTime(
                                    conversation.LastMessageAt ||
                                      conversation.updatedAt,
                                  )}
                                </span>
                              </div>
                              {participant?.Role && (
                                <Badge variant="secondary" className="text-xs mb-1">
                                  {participant.Role}
                                </Badge>
                              )}
                              <p
                                className={`text-sm truncate ${
                                  conversation.UnreadCount > 0
                                    ? "font-semibold text-gray-900"
                                    : "text-gray-600"
                                }`}
                              >
                                {conversation.LastMessage ||
                                  "No messages yet. Start the conversation."}
                              </p>
                            </div>

                            {conversation.UnreadCount > 0 && (
                              <div className="bg-[#F7931E] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {conversation.UnreadCount}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}

                  {!isLoadingConversations &&
                    filteredConversations.length === 0 && (
                      <div className="p-8 text-center text-gray-500">
                        <p>No conversations found</p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            className={`lg:col-span-2 ${
              !selectedConversation || !currentConversation
                ? "hidden lg:block"
                : ""
            }`}
          >
            <Card className="h-full flex flex-col">
              {currentConversation ? (
                <>
                  <CardHeader className="border-b flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="lg:hidden flex-shrink-0"
                          onClick={() => {
                            setSelectedConversation("");
                            navigate("/messages");
                          }}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex-shrink-0">
                          <div className="bg-gradient-to-br from-[#F7931E] to-orange-600 rounded-full p-3 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {currentParticipant?.Name?.[0] || "M"}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {currentParticipant?.Name || "Mahamma user"}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {currentParticipant?.Email || "KFUPM member"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {currentParticipant?.Role === "provider" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex"
                            onClick={() =>
                              navigate(`/providers/${currentParticipant._id}`)
                            }
                          >
                            View Profile
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-0">
                    {isLoadingMessages ? (
                      <div className="py-12 text-center text-gray-500">
                        Loading messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="py-12 text-center text-gray-500">
                        No messages yet. Start the conversation.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isMine =
                            message.SenderID?._id === userInfo?._id ||
                            message.SenderID === userInfo?._id;

                          return (
                            <div
                              key={message._id}
                              className={`flex ${
                                isMine ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-md rounded-lg p-4 shadow-sm ${
                                  isMine
                                    ? "bg-[#F7931E] text-white"
                                    : "bg-white border border-gray-200"
                                }`}
                              >
                                {!isMine && (
                                  <p className="text-xs font-medium mb-1 text-gray-600">
                                    {message.SenderID?.Name || "Mahamma user"}
                                  </p>
                                )}
                                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                  {message.Body}
                                </p>
                                <div
                                  className={`flex items-center justify-between mt-2 gap-2 ${
                                    isMine ? "text-white/70" : "text-gray-500"
                                  }`}
                                >
                                  <p className="text-xs">
                                    {formatMessageTime(message.createdAt)}
                                  </p>
                                  {isMine &&
                                    ((message.ReadBy || []).length > 1 ? (
                                      <CheckCheck className="h-4 w-4" />
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </CardContent>

                  <div className="border-t p-4 bg-white flex-shrink-0">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(event) => setNewMessage(event.target.value)}
                        rows={1}
                        className="resize-none"
                        maxLength={2000}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />

                      <Button
                        className="bg-[#F7931E] hover:bg-[#F7931E]/90 flex-shrink-0"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                      <Send className="h-16 w-16 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No conversation selected
                    </h3>
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
