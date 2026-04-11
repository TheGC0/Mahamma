# Mahamma — مهمّة

A student freelance marketplace for KFUPM students to post tasks, offer services, and collaborate within the campus community.

---

## Project Description

Mahamma is a full-stack-ready React prototype that connects KFUPM students as both clients and freelancers. Clients can post tasks, receive offers, compare them, and track active jobs. Freelancers can list services, browse open tasks, submit proposals, and manage their workspace. Administrators can verify new users, moderate reported disputes, view analytics, and manage service categories.

All data is mock data driven by local React state — no backend or API keys are required to run the prototype.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 |
| Build Tool | Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Component Library | Radix UI + shadcn/ui |
| Charts | Recharts |
| Icons | Lucide React |

---

## Setup & Installation

### Prerequisites
- Node.js 18 or later
- npm (comes with Node.js)

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Mahamma

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## Demo Accounts

Use the following credentials on the **Login** page (`/login`):

| Role | Email | Password | Redirects To |
|---|---|---|---|
| Client | `client@kfupm.edu.sa` | `client123` | `/client/dashboard` |
| Freelancer | `provider@kfupm.edu.sa` | `provider123` | `/provider/dashboard` |
| Admin | `admin@kfupm.edu.sa` | `admin123` | `/admin` |

> The Signup page (`/signup`) also works — selecting Client or Freelancer role redirects to the appropriate dashboard.

---

## Application Pages & User Flows

### Public
| Route | Page | Description |
|---|---|---|
| `/` | Landing | Hero, categories, how-it-works, trust section |
| `/login` | Login | Authenticate with a demo account |
| `/signup` | Signup | Register as client or freelancer |
| `/services` | Browse Services | Search and filter listed services |
| `/services/:id` | Service Detail | Full service page with reviews and booking |
| `/providers/:id` | Provider Profile | Freelancer profile, portfolio, ratings |

### Client
| Route | Page | Description |
|---|---|---|
| `/client/dashboard` | Client Dashboard | Active requests, jobs, saved providers |
| `/client/post-task` | Post Task | Create a new task with budget and category |
| `/client/edit-task/:id` | Edit Task | Edit an existing task |
| `/client/request/:id` | Request Details | View a specific task and incoming offers |
| `/client/compare-offers/:id` | Compare Offers | Side-by-side offer comparison |
| `/client/jobs/:id` | Job Workspace | Live job workspace with milestones and chat |

### Freelancer (Provider)
| Route | Page | Description |
|---|---|---|
| `/provider/dashboard` | Provider Dashboard | Earnings, active jobs, performance stats |
| `/provider/create-service` | Create Service | List a new service with pricing tiers |
| `/provider/tasks` | Browse Tasks | Discover and filter open client tasks |

### Admin
| Route | Page | Description |
|---|---|---|
| `/admin` | Admin Dashboard | Verify users, resolve disputes, view analytics, manage categories |

### Shared
| Route | Page | Description |
|---|---|---|
| `/messages` | Messages | Conversation inbox between clients and providers |

---

## Interactive Features

- **Login / Signup** with role-based routing
- **Browse & filter** services and tasks (search, category, price range)
- **Post a task** with form validation and category selection
- **Compare offers** side-by-side with accept / decline actions
- **Job workspace** with milestone tracking and mock chat
- **Admin verification** — approve or reject pending users with live UI feedback
- **Dispute resolution** — select a case, review evidence, submit resolution notes
- **Category management** — add, edit, and delete categories
- **Analytics charts** — user growth (line chart) and category distribution (bar chart)
- **Responsive layout** — mobile navigation menu, adaptive grids

---

## File Structure

```
Mahamma/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.jsx                  # App entry point (RouterProvider)
│   ├── app/
│   │   ├── routes.js             # All route definitions
│   │   ├── components/
│   │   │   ├── Header.jsx        # Sticky top navigation
│   │   │   ├── Footer.jsx        # Site-wide footer
│   │   │   ├── StarRating.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── figma/
│   │   │   │   └── ImageWithFallback.jsx
│   │   │   ├── styles/
│   │   │   │   ├── index.css
│   │   │   │   ├── tailwind.css
│   │   │   │   ├── theme.css
│   │   │   │   └── fonts.css
│   │   │   └── ui/               # Radix-based UI primitives
│   │   ├── lib/
│   │   │   ├── mock-data.js
│   │   │   └── notifications.jsx
│   │   └── pages/
│   │       ├── Landing.jsx
│   │       ├── Login.jsx
│   │       ├── Signup.jsx
│   │       ├── BrowseServices.jsx
│   │       ├── ServiceDetail.jsx
│   │       ├── ClientDashboard.jsx
│   │       ├── PostTask.jsx
│   │       ├── RequestDetails.jsx
│   │       ├── CompareOffers.jsx
│   │       ├── JobWorkspace.jsx
│   │       ├── ProviderDashboard.jsx
│   │       ├── CreateService.jsx
│   │       ├── BrowseTasks.jsx
│   │       ├── ProviderProfile.jsx
│   │       ├── AdminDashboard.jsx
│   │       └── Messages.jsx
│   └── assets/
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

---

## Team Members

| Name | Student ID | Role |
|---|---|---|
| Ali Shamah | 202362930 | Team Leader / Full-Stack Developer |
| Abdullah Binsheheween | 202221520 | Backend Developer |
| Fahad Alzuaidi | 202271360 | Frontend Developer |
| Asem Almutaseb | 202183450 | Tester Developer |

> Replace the placeholders above with your actual names and IDs.

---

## Figma Reference

[View Figma Prototype →](https://www.figma.com/design/bqhBdwZUneoNMyw2SvSYkN/Wirframe?node-id=77-2&t=xPs2CDFFOFgWhdfr-1)

> Set the Figma link to "View Only" access before submitting.

---

## Notes

- No API keys or environment variables are required — all data is mocked locally.
- The `.gitignore` excludes `node_modules/`, `dist/`, `.env` files, and editor config.
- The UI is fully responsive: mobile navigation drawer, stacked grids on small screens.
