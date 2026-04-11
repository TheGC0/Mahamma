// Mock data for Mahamma platform

export const categories = [
  "Design",
  "Programming",
  "Video Editing",
  "Device Fixing",
  "Content Writing",
  "Translation",
  "Marketing",
  "Photography",
  "Tutoring",
  "Other",
];

export const mockServices = [
  {
    id: "1",
    providerId: "p1",
    providerName: "Ahmed Al-Otaibi",
    providerRating: 4.9,
    title: "Professional Logo Design",
    description:
      "I will create a modern, professional logo for your business or project with unlimited revisions.",
    category: "Design",
    price: 150,
    deliveryTime: "3 days",
    revisions: 3,
    verified: true,
  },
  {
    id: "2",
    providerId: "p2",
    providerName: "Sara Mohammed",
    providerRating: 5.0,
    title: "Python Programming & Automation",
    description:
      "Expert in Python development, data analysis, and automation scripts. Quick delivery guaranteed.",
    category: "Programming",
    price: 200,
    deliveryTime: "2 days",
    revisions: 2,
    verified: true,
  },
  {
    id: "3",
    providerId: "p3",
    providerName: "Khalid Hassan",
    providerRating: 4.8,
    title: "Video Editing & Motion Graphics",
    description:
      "Professional video editing for YouTube, social media, and presentations. Adobe Premiere & After Effects.",
    category: "Video Editing",
    price: 180,
    deliveryTime: "4 days",
    revisions: 2,
    verified: true,
  },
  {
    id: "4",
    providerId: "p4",
    providerName: "Fatima Al-Harbi",
    providerRating: 4.7,
    title: "Laptop & Desktop Repair",
    description:
      "Hardware and software troubleshooting, upgrades, and repairs for all types of computers.",
    category: "Device Fixing",
    price: 100,
    deliveryTime: "1 day",
    revisions: 1,
    verified: true,
  },
  {
    id: "5",
    providerId: "p5",
    providerName: "Omar Abdullah",
    providerRating: 4.9,
    title: "Web Development - React & Node.js",
    description:
      "Full-stack web development services using modern technologies. Responsive and clean code.",
    category: "Programming",
    price: 350,
    deliveryTime: "7 days",
    revisions: 3,
    verified: true,
  },
  {
    id: "6",
    providerId: "p6",
    providerName: "Noura Al-Qahtani",
    providerRating: 5.0,
    title: "Arabic-English Translation",
    description:
      "Professional translation services for documents, websites, and academic papers.",
    category: "Translation",
    price: 80,
    deliveryTime: "2 days",
    revisions: 2,
    verified: true,
  },
];

export const mockTasks = [
  {
    id: "t1",
    clientId: "c1",
    clientName: "Mohammed Al-Shehri",
    title: "Mobile App UI Design",
    description:
      "Need a modern UI design for a mobile food delivery app. Should include home, menu, cart, and profile screens.",
    category: "Design",
    budgetMin: 300,
    budgetMax: 500,
    deadline: "2026-03-05",
    status: "open",
    createdAt: "2026-02-18",
  },
  {
    id: "t2",
    clientId: "c2",
    clientName: "Layla Ibrahim",
    title: "Data Analysis Project - Python",
    description:
      "Looking for someone to analyze sales data and create visualizations. Dataset will be provided.",
    category: "Programming",
    budgetMin: 200,
    budgetMax: 300,
    deadline: "2026-02-28",
    status: "open",
    createdAt: "2026-02-19",
  },
  {
    id: "t3",
    clientId: "c3",
    clientName: "Yousef Al-Mutairi",
    title: "Edit 5-Minute YouTube Video",
    description:
      "Need editing for a tech review video including color grading, transitions, and background music.",
    category: "Video Editing",
    budgetMin: 150,
    budgetMax: 250,
    deadline: "2026-02-25",
    status: "open",
    createdAt: "2026-02-20",
  },
];

export const mockOffers = [
  {
    id: "o1",
    taskId: "t1",
    providerId: "p1",
    providerName: "Ahmed Al-Otaibi",
    providerRating: 4.9,
    price: 400,
    deliveryTime: "5 days",
    message:
      "I have 3 years of experience in mobile UI design. I can deliver high-quality screens with source files.",
    createdAt: "2026-02-19",
  },
  {
    id: "o2",
    taskId: "t1",
    providerId: "p7",
    providerName: "Reem Al-Dosari",
    providerRating: 4.8,
    price: 450,
    deliveryTime: "4 days",
    message:
      "UI/UX designer specializing in food delivery apps. Will include interactive prototype.",
    createdAt: "2026-02-19",
  },
  {
    id: "o3",
    taskId: "t1",
    providerId: "p8",
    providerName: "Faisal Al-Ghamdi",
    providerRating: 4.6,
    price: 350,
    deliveryTime: "6 days",
    message:
      "I can create clean, modern designs for your app. Previous work portfolio available.",
    createdAt: "2026-02-20",
  },
  {
    id: "o4",
    taskId: "mock-task-id",
    providerId: "p1",
    providerName: "Ahmed Al-Otaibi",
    providerRating: 4.9,
    price: 400,
    deliveryTime: "5 days",
    message:
      "I have 3 years of experience in mobile UI design. I can deliver high-quality screens with source files.",
    createdAt: "2 hours ago",
  },
  {
    id: "o5",
    taskId: "mock-task-id",
    providerId: "p7",
    providerName: "Reem Al-Dosari",
    providerRating: 4.8,
    price: 450,
    deliveryTime: "4 days",
    message:
      "UI/UX designer specializing in food delivery apps. Will include interactive prototype.",
    createdAt: "3 hours ago",
  },
  {
    id: "o6",
    taskId: "mock-task-id",
    providerId: "p8",
    providerName: "Faisal Al-Ghamdi",
    providerRating: 4.6,
    price: 350,
    deliveryTime: "6 days",
    message:
      "I can create clean, modern designs for your app. Previous work portfolio available.",
    createdAt: "5 hours ago",
  },
];

export const mockReviews = [
  {
    id: "r1",
    jobId: "j1",
    reviewerId: "c1",
    reviewerName: "Mohammed Al-Shehri",
    revieweeId: "p1",
    rating: 5,
    comment:
      "Excellent work! Very professional and delivered on time. Highly recommended.",
    createdAt: "2026-02-15",
  },
  {
    id: "r2",
    jobId: "j2",
    reviewerId: "c2",
    reviewerName: "Layla Ibrahim",
    revieweeId: "p2",
    rating: 5,
    comment:
      "Amazing skills in Python! The code was clean and well-documented.",
    createdAt: "2026-02-14",
  },
];

export const currentUser = {
  id: "u1",
  name: "Abdullah Al-Shammari",
  email: "s202012345@kfupm.edu.sa",
  role: "client",
  verified: true,
  avatar: undefined,
};
