import { useState } from "react";
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
  Paperclip,
  CheckCheck,
  Check,
  ArrowLeft,
} from "lucide-react";

export function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversation");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(
    conversationId || "",
  );

  // Mock conversations data
  const conversations = [
    {
      id: "c1",
      participantId: "p1",
      participantName: "Ahmed Al-Otaibi",
      participantRole: "provider",
      lastMessage: "I've uploaded the final logo files. Please review!",
      lastMessageTime: "5 min ago",
      unreadCount: 2,
      relatedJob: "Logo Design for Startup",
      online: true,
    },
    {
      id: "c2",
      participantId: "p2",
      participantName: "Sara Mohammed",
      participantRole: "provider",
      lastMessage: "When would you like me to start the analysis?",
      lastMessageTime: "1 hour ago",
      unreadCount: 0,
      relatedJob: "Python Data Analysis",
      online: false,
    },
    {
      id: "c3",
      participantId: "p3",
      participantName: "Khaled Al-Shammari",
      participantRole: "provider",
      lastMessage: "Thank you for your review!",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      online: false,
    },
    {
      id: "c4",
      participantId: "c1",
      participantName: "Abdullah Al-Mutairi",
      participantRole: "client",
      lastMessage: "Can you add the mobile responsive feature?",
      lastMessageTime: "2 days ago",
      unreadCount: 1,
      relatedJob: "Website Development",
      online: true,
    },
    {
      id: "c5",
      participantId: "p4",
      participantName: "Fatima Al-Harbi",
      participantRole: "provider",
      lastMessage: "I'm interested in your video editing project",
      lastMessageTime: "3 days ago",
      unreadCount: 0,
      online: false,
    },
  ];

  // Mock messages for selected conversation
  const messagesByConversation = {
    c1: [
      {
        id: "m1",
        senderId: "p1",
        senderName: "Ahmed Al-Otaibi",
        content:
          "Hi! I've started working on your logo. Do you have any specific color preferences?",
        timestamp: "2 hours ago",
        read: true,
      },
      {
        id: "m2",
        senderId: "me",
        senderName: "You",
        content:
          "Yes, please use orange (#F7931E) as the primary color. Thanks!",
        timestamp: "1 hour ago",
        read: true,
      },
      {
        id: "m3",
        senderId: "p1",
        senderName: "Ahmed Al-Otaibi",
        content:
          "Perfect! I'll incorporate that. Will send the first draft soon.",
        timestamp: "45 min ago",
        read: true,
      },
      {
        id: "m4",
        senderId: "p1",
        senderName: "Ahmed Al-Otaibi",
        content:
          "I've uploaded the first draft. Please let me know your thoughts!",
        timestamp: "30 min ago",
        read: true,
      },
      {
        id: "m5",
        senderId: "me",
        senderName: "You",
        content: "Looks great! Could you make the text slightly larger?",
        timestamp: "15 min ago",
        read: true,
      },
      {
        id: "m6",
        senderId: "p1",
        senderName: "Ahmed Al-Otaibi",
        content: "I've uploaded the final logo files. Please review!",
        timestamp: "5 min ago",
        read: false,
      },
    ],
    c2: [
      {
        id: "m1",
        senderId: "p2",
        senderName: "Sara Mohammed",
        content: "Hello! I'd love to help with your data analysis project.",
        timestamp: "Yesterday",
        read: true,
      },
      {
        id: "m2",
        senderId: "me",
        senderName: "You",
        content: "Great! I need analysis on customer behavior data.",
        timestamp: "Yesterday",
        read: true,
      },
      {
        id: "m3",
        senderId: "p2",
        senderName: "Sara Mohammed",
        content: "When would you like me to start the analysis?",
        timestamp: "1 hour ago",
        read: true,
      },
    ],
    c3: [
      {
        id: "m1",
        senderId: "me",
        senderName: "You",
        content: "The website looks perfect! Thank you!",
        timestamp: "2 days ago",
        read: true,
      },
      {
        id: "m2",
        senderId: "p3",
        senderName: "Khaled Al-Shammari",
        content: "Thank you for your review!",
        timestamp: "Yesterday",
        read: true,
      },
    ],
    c4: [
      {
        id: "m1",
        senderId: "c1",
        senderName: "Abdullah Al-Mutairi",
        content: "Hi, I'm reviewing your proposal for the website.",
        timestamp: "3 days ago",
        read: true,
      },
      {
        id: "m2",
        senderId: "me",
        senderName: "You",
        content: "Thank you! I can start immediately.",
        timestamp: "2 days ago",
        read: true,
      },
      {
        id: "m3",
        senderId: "c1",
        senderName: "Abdullah Al-Mutairi",
        content: "Can you add the mobile responsive feature?",
        timestamp: "2 days ago",
        read: false,
      },
    ],
    c5: [
      {
        id: "m1",
        senderId: "p4",
        senderName: "Fatima Al-Harbi",
        content: "I'm interested in your video editing project",
        timestamp: "3 days ago",
        read: true,
      },
    ],
  };

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversation,
  );
  const currentMessages = messagesByConversation[selectedConversation] || [];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.relatedJob &&
        conv.relatedJob.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const totalUnreadCount = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0,
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Mock send message
      setNewMessage("");
    }
  };

  const handleSelectConversation = (convId) => {
    setSelectedConversation(convId);
    // In a real app, mark messages as read here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={true} userRole="client" userName="Abdullah" />

      <div className="container mx-auto max-w-7xl px-4 py-8 flex-1 flex flex-col">
        {/* Header */}
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
        </div>

        <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Conversations List */}
          <div
            className={`lg:col-span-1 ${selectedConversation && currentConversation
                ? "hidden lg:block"
                : ""
              }`}
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b flex-shrink-0">
                <CardTitle className="text-lg">Conversations</CardTitle>
                {/* Search */}
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0 min-h-0">
                <div className="divide-y">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedConversation === conv.id
                          ? "bg-orange-50 border-l-4 border-[#F7931E]"
                          : ""
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="bg-gradient-to-br from-[#F7931E] to-orange-600 rounded-full p-3 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {conv.participantName[0]}
                            </span>
                          </div>
                          {conv.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold text-sm truncate">
                              {conv.participantName}
                            </h4>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {conv.lastMessageTime}
                            </span>
                          </div>
                          {conv.relatedJob && (
                            <Badge variant="secondary" className="text-xs mb-1">
                              {conv.relatedJob}
                            </Badge>
                          )}
                          <p
                            className={`text-sm truncate ${conv.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-600"}`}
                          >
                            {conv.lastMessage}
                          </p>
                        </div>

                        {/* Unread Badge */}
                        {conv.unreadCount > 0 && (
                          <div className="bg-[#F7931E] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {conv.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredConversations.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <p>No conversations found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div
            className={`lg:col-span-2 ${!selectedConversation || !currentConversation
                ? "hidden lg:block"
                : ""
              }`}
          >
            <Card className="h-full flex flex-col">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Back button for mobile */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="lg:hidden flex-shrink-0"
                          onClick={() => setSelectedConversation("")}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="relative flex-shrink-0">
                          <div className="bg-gradient-to-br from-[#F7931E] to-orange-600 rounded-full p-3 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {currentConversation.participantName[0]}
                            </span>
                          </div>
                          {currentConversation.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {currentConversation.participantName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {currentConversation.online ? (
                              <span className="text-green-600">● Online</span>
                            ) : (
                              "Offline"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {currentConversation.relatedJob && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex"
                            onClick={() => navigate("/client/jobs/j1")}
                          >
                            View Job
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="hidden sm:flex"
                          onClick={() =>
                            navigate(
                              `/providers/${currentConversation.participantId}`,
                            )
                          }
                        >
                          View Profile
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    {currentConversation.relatedJob && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                          <strong>Related Job:</strong>{" "}
                          {currentConversation.relatedJob}
                        </p>
                      </div>
                    )}
                  </CardHeader>

                  {/* Messages Area */}
                  <CardContent className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-0">
                    <div className="space-y-4">
                      {currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-md ${msg.senderId === "me"
                                ? "bg-[#F7931E] text-white"
                                : "bg-white border border-gray-200"
                              } rounded-lg p-4 shadow-sm`}
                          >
                            {msg.senderId !== "me" && (
                              <p className="text-xs font-medium mb-1 text-gray-600">
                                {msg.senderName}
                              </p>
                            )}
                            <p className="text-sm leading-relaxed">
                              {msg.content}
                            </p>
                            <div
                              className={`flex items-center justify-between mt-2 gap-2 ${msg.senderId === "me"
                                  ? "text-white/70"
                                  : "text-gray-500"
                                }`}
                            >
                              <p className="text-xs">{msg.timestamp}</p>
                              {msg.senderId === "me" &&
                                (msg.read ? (
                                  <CheckCheck className="h-4 w-4" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-4 bg-white flex-shrink-0">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                      >
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={1}
                        className="resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />

                      <Button
                        className="bg-[#F7931E] hover:bg-[#F7931E]/90 flex-shrink-0"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
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
