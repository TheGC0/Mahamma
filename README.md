# Mahamma — مهمّة

A student freelance marketplace for KFUPM students to post tasks, offer services, and collaborate within the campus community.

---

## 🌐 Live Demo

| | URL |
|---|---|
| **Frontend** | https://mahamma.vercel.app |
| **Backend API** | https://mahamma.onrender.com/api |

> ⚠️ **Important note for graders:** The backend is hosted on Render's free tier, which automatically spins down after 15 minutes of inactivity. The **first request after a period of inactivity may take 20–30 seconds** while the server wakes up. Subsequent requests will be fast. Please wait briefly on first load before concluding something is broken. This is a known limitation of the free hosting tier and does not affect functionality.

---

## Demo Accounts

To test the platform without registering, use these pre-seeded accounts:

| Role | Email | Password |
|---|---|---|
| Client | `client@kfupm.edu.sa` | `123456` |
| Provider | `provider@kfupm.edu.sa` | `123456` |
| Admin | `admin@kfupm.edu.sa` | `123456` |

*(If these accounts do not exist yet, register a new account — it takes 10 seconds.)*

---

## Project Description

Mahamma connects KFUPM students as both clients and freelancers. Clients can post tasks, receive offers, compare them side-by-side, and track active jobs. Freelancers can list services, browse open tasks, submit proposals, and manage their earnings. Administrators can verify new users, moderate reported disputes, view analytics, and manage service categories.

The platform is built with a React frontend and a Node.js/Express/MongoDB backend exposing a fully documented RESTful API.

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
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcryptjs |

---

## Team Members

| Name | Student ID | Role |
|---|---|---|
| Ali Shamah | 202362930 | Team Leader / Full-Stack Developer |
| Abdullah Binsheheween | 202221520 | Backend Developer |
| Fahad Alzuaidi | 202271360 | Frontend Developer |
| Asem Almutaseb | 202183450 | Tester / QA |

---

## Figma Reference

[View Figma Prototype](https://www.figma.com/design/bqhBdwZUneoNMyw2SvSYkN/Wirframe?node-id=77-2&t=xPs2CDFFOFgWhdfr-1)

---

## Repository Structure

```
Mahamma-1/
├── backend/                    # Node.js / Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Business logic per resource
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── serviceController.js
│   │   ├── proposalController.js
│   │   ├── contractController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT token verification
│   │   ├── roleMiddleware.js   # Role-based access control
│   │   ├── validateMiddleware.js # Input validation
│   │   └── errorMiddleware.js  # Global error handler
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Service.js
│   │   ├── Proposal.js
│   │   ├── Contract.js
│   │   └── Review.js
│   ├── routes/                 # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── proposalRoutes.js
│   │   ├── contractRoutes.js
│   │   └── reviewRoutes.js
│   ├── utils/
│   │   └── generateToken.js    # JWT generation helper
│   ├── server.js               # App entry point
│   └── package.json
├── src/                        # React frontend
│   ├── app/
│   │   ├── routes.js
│   │   ├── components/
│   │   ├── lib/
│   │   └── pages/
│   ├── lib/
│   │   └── api.js              # API client functions
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

---

## Frontend Setup

### Prerequisites
- Node.js 18 or later

### Steps

```bash
# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```

The app will be available at `http://localhost:5173`.

For local development, the frontend defaults to `http://localhost:5000/api`.
For deployment, set this environment variable in the frontend hosting platform:

```env
VITE_API_URL=https://your-backend-domain.example.com/api
```

```bash
# Production build
npm run build
npm run preview
```

---

## Backend Setup

### Prerequisites
- Node.js 18 or later
- A MongoDB Atlas cluster (or local MongoDB instance)

### 1. Create the environment file

Create a file named `.env` inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGO_DB_NAME=mahamma
JWT_SECRET=your_strong_secret_key_here
```

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on (default: 5000) |
| `MONGO_URI` | Full MongoDB Atlas connection string |
| `MONGO_DB_NAME` | Database name inside the cluster |
| `JWT_SECRET` | Secret key used to sign JWT tokens |

### 2. Install and run

```bash
cd backend
npm install

# Production
npm start

# Development (auto-restarts on file change)
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## Demo Accounts

Use the following credentials on the **Login** page (`/login`):

| Role | Email | Password | Redirects To |
|---|---|---|---|
| Client | `client@kfupm.edu.sa` | `client123` | `/client/dashboard` |
| Freelancer | `provider@kfupm.edu.sa` | `provider123` | `/provider/dashboard` |
| Admin | `admin@kfupm.edu.sa` | `admin123` | `/admin` |

---

## Application Pages & User Flows

### Public
| Route | Page | Description |
|---|---|---|
| `/` | Landing | Hero, categories, how-it-works |
| `/login` | Login | Authenticate with email and password |
| `/signup` | Signup | Register as client or freelancer |
| `/services` | Browse Services | Search and filter listed services |
| `/services/:id` | Service Detail | Full service page with reviews |
| `/providers/:id` | Provider Profile | Freelancer profile and portfolio |

### Client
| Route | Page | Description |
|---|---|---|
| `/client/dashboard` | Client Dashboard | Active requests, jobs, saved providers |
| `/client/post-task` | Post Task | Create a task with budget and category |
| `/client/request/:id` | Request Details | View a task and incoming proposals |
| `/client/compare-offers/:id` | Compare Offers | Side-by-side offer comparison |
| `/client/jobs/:id` | Job Workspace | Live job with milestones and chat |

### Freelancer
| Route | Page | Description |
|---|---|---|
| `/provider/dashboard` | Provider Dashboard | Earnings, active jobs, stats |
| `/provider/create-service` | Create Service | List a new service |
| `/provider/tasks` | Browse Tasks | Discover open client tasks |

### Admin
| Route | Page | Description |
|---|---|---|
| `/admin` | Admin Dashboard | Verify users, resolve disputes, analytics |

### Shared
| Route | Page | Description |
|---|---|---|
| `/messages` | Messages | Inbox between clients and providers |

---

## API Documentation

**Base URL:** `http://localhost:5000/api` locally, or the deployed value configured in `VITE_API_URL`.

All protected routes (marked with 🔒) require the header:
```
Authorization: Bearer <token>
```

Tokens are returned from `/api/auth/login` and `/api/auth/register`.

---

### 1. Authentication — `/api/auth`

#### POST `/api/auth/register`
Register a new user.

**Request body:**
```json
{
  "Name": "Ali Shamah",
  "Email": "ali@kfupm.edu.sa",
  "Password": "secret123",
  "Role": "client",
  "Major": "Computer Science"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| Name | String | Yes | Min 2 characters |
| Email | String | Yes | Valid email format |
| Password | String | Yes | Min 6 characters |
| Role | String | No | `client`, `provider`, or `admin` (default: `client`) |
| Major | String | No | Optional field |

**Success response (201):**
```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "Name": "Ali Shamah",
  "Email": "ali@kfupm.edu.sa",
  "Role": "client",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error responses:** `400` User already exists | `400` Validation error

---

#### POST `/api/auth/login`
Authenticate and receive a JWT token.

**Request body:**
```json
{
  "Email": "ali@kfupm.edu.sa",
  "Password": "secret123"
}
```

**Success response (200):**
```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "Name": "Ali Shamah",
  "Email": "ali@kfupm.edu.sa",
  "Role": "client",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error responses:** `400` Missing fields | `401` Invalid credentials

---

#### GET `/api/auth/profile` 🔒
Get the logged-in user's profile.

**Success response (200):**
```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "Name": "Ali Shamah",
  "Email": "ali@kfupm.edu.sa",
  "Role": "client",
  "Major": "Computer Science",
  "Rating": 4.7
}
```

---

### 2. Tasks — `/api/tasks`

#### GET `/api/tasks`
Get all tasks. Supports query parameters for filtering and sorting.

| Query Param | Type | Example | Description |
|---|---|---|---|
| status | String | `open` | Filter by: `open`, `in_progress`, `completed`, `cancelled` |
| category | String | `Programming` | Filter by category |
| search | String | `react bug` | Search in title, description, and tags |
| minBudget | Number | `50` | Minimum budget |
| maxBudget | Number | `500` | Maximum budget |
| sort | String | `budget_asc` | Sort: `budget_asc`, `budget_desc`, `oldest` (default: newest) |

**Example:** `GET /api/tasks?status=open&category=Programming&minBudget=50`

**Success response (200):**
```json
[
  {
    "_id": "664f...",
    "Title": "Fix React performance bug",
    "Description": "My React app re-renders too often and needs optimization.",
    "Budget": 150,
    "Category": "Programming",
    "Deadline": "2025-07-01T00:00:00.000Z",
    "Tags": ["react", "performance"],
    "Status": "open",
    "ClientID": { "_id": "...", "Name": "Ali Shamah", "Email": "ali@kfupm.edu.sa", "Rating": 4.5 },
    "createdAt": "2025-05-01T10:00:00.000Z"
  }
]
```

---

#### GET `/api/tasks/:id`
Get a single task by ID.

**Success response (200):** Single task object.

**Error responses:** `404` Task not found

---

#### POST `/api/tasks` 🔒 *(client role required)*
Create a new task.

**Request body:**
```json
{
  "Title": "Fix React performance bug",
  "Description": "My React app re-renders too often and needs optimization by a skilled developer.",
  "Budget": 150,
  "Category": "Programming",
  "Deadline": "2025-07-01",
  "Tags": ["react", "performance"]
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| Title | String | Yes | 5–100 characters |
| Description | String | Yes | Min 20 characters |
| Budget | Number | Yes | Min 1 |
| Category | String | Yes | Must be a valid category |
| Deadline | Date | No | Must be a future date |
| Tags | Array | No | Array of strings |

**Valid categories:** `Design`, `Programming`, `Video Editing`, `Device Fixing`, `Content Writing`, `Translation`, `Marketing`, `Photography`, `Tutoring`, `Other`

**Success response (201):** Created task object.

**Error responses:** `400` Validation error | `403` Not a client

---

#### PUT `/api/tasks/:id` 🔒 *(owner only)*
Update an existing task. Only include fields you want to change.

**Request body (all optional):**
```json
{
  "Title": "Updated title",
  "Budget": 200,
  "Status": "cancelled"
}
```

**Success response (200):** Updated task object.

**Error responses:** `403` Not authorized | `404` Task not found

---

#### DELETE `/api/tasks/:id` 🔒 *(owner or admin)*
Delete a task permanently.

**Success response (200):**
```json
{ "message": "Task removed" }
```

---

### 3. Services — `/api/services`

#### GET `/api/services`
Get all services. Supports query parameters.

| Query Param | Type | Example | Description |
|---|---|---|---|
| category | String | `Design` | Filter by category |
| search | String | `logo` | Search in title, description, and tags |
| minPrice | Number | `20` | Minimum price |
| maxPrice | Number | `300` | Maximum price |
| sort | String | `rating` | Sort: `price_asc`, `price_desc`, `rating`, `oldest` (default: newest) |

**Success response (200):**
```json
[
  {
    "_id": "664f...",
    "Title": "Professional Logo Design",
    "Description": "I will design a modern, unique logo for your project.",
    "Price": 80,
    "Category": "Design",
    "DeliveryTime": "3 days",
    "Tags": ["logo", "branding"],
    "AverageRating": 4.8,
    "ReviewCount": 12,
    "ProviderID": { "_id": "...", "Name": "Fahad Alzuaidi", "Rating": 4.8 },
    "createdAt": "2025-04-15T08:00:00.000Z"
  }
]
```

---

#### GET `/api/services/:id`
Get a single service by ID.

**Error responses:** `404` Service not found

---

#### GET `/api/services/:serviceId/reviews`
Get all reviews for a service. Public endpoint.

**Success response (200):** Array of review objects.

---

#### POST `/api/services` 🔒 *(provider role required)*
Create a new service listing.

**Request body:**
```json
{
  "Title": "Professional Logo Design",
  "Description": "I will design a modern, unique logo for your project or business.",
  "Price": 80,
  "Category": "Design",
  "DeliveryTime": "3 days",
  "Tags": ["logo", "branding"]
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| Title | String | Yes | 5–100 characters |
| Description | String | Yes | Min 20 characters |
| Price | Number | Yes | Min 1 |
| Category | String | Yes | Must be a valid category |
| DeliveryTime | String | Yes | e.g. `"3 days"` |
| Tags | Array | No | Array of strings |

**Success response (201):** Created service object.

---

#### PUT `/api/services/:id` 🔒 *(owner only)*
Update an existing service.

**Success response (200):** Updated service object.

---

#### DELETE `/api/services/:id` 🔒 *(owner or admin)*
Delete a service.

**Success response (200):**
```json
{ "message": "Service removed" }
```

---

### 4. Proposals — `/api/tasks/:taskId/proposals` and `/api/proposals`

#### GET `/api/tasks/:taskId/proposals` 🔒 *(task owner or admin)*
Get all proposals submitted for a specific task.

**Success response (200):**
```json
[
  {
    "_id": "664f...",
    "TaskID": "664f...",
    "FreelancerID": { "_id": "...", "Name": "Abdullah B.", "Rating": 4.6, "Major": "SWE" },
    "BidAmount": 120,
    "EstimatedTime": "5 days",
    "CoverLetter": "I have 3 years of React experience and can solve this efficiently.",
    "Status": "pending",
    "createdAt": "2025-05-02T09:00:00.000Z"
  }
]
```

---

#### GET `/api/proposals/:id` 🔒 *(proposal owner or task owner)*
Get a single proposal by ID.

---

#### POST `/api/tasks/:taskId/proposals` 🔒 *(provider role required)*
Submit a proposal on an open task.

**Request body:**
```json
{
  "BidAmount": 120,
  "EstimatedTime": "5 days",
  "CoverLetter": "I have 3 years of React experience and can solve this efficiently."
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| BidAmount | Number | Yes | Min 1 |
| EstimatedTime | String | Yes | Free text (e.g. "5 days") |
| CoverLetter | String | Yes | Min 20 characters |

**Business rules:**
- Task must have status `open`
- A provider cannot propose on their own task
- One proposal per provider per task

**Success response (201):** Created proposal object.

**Error responses:** `400` Task not open | `400` Already submitted a proposal | `403` Not a provider

---

#### PUT `/api/proposals/:id/status` 🔒 *(client who owns the task)*
Accept or reject a proposal.

**Request body:**
```json
{ "Status": "accepted" }
```

Accepting automatically:
- Sets all other proposals for the same task to `rejected`
- Updates the task status to `in_progress`

**Success response (200):** Updated proposal object.

---

#### DELETE `/api/proposals/:id` 🔒 *(proposal owner)*
Withdraw a pending proposal. Cannot delete an already accepted or rejected proposal.

**Success response (200):**
```json
{ "message": "Proposal removed" }
```

---

### 5. Contracts — `/api/contracts`

#### GET `/api/contracts` 🔒
Get all contracts for the logged-in user. Results are automatically filtered by role:
- **Client:** contracts where they are the client
- **Provider:** contracts where they are the provider
- **Admin:** all contracts

**Success response (200):**
```json
[
  {
    "_id": "664f...",
    "ProposalID": { "BidAmount": 120, "EstimatedTime": "5 days" },
    "TaskID": { "Title": "Fix React performance bug", "Category": "Programming" },
    "ClientID": { "Name": "Ali Shamah", "Email": "ali@kfupm.edu.sa" },
    "ProviderID": { "Name": "Abdullah B.", "Rating": 4.6 },
    "AgreedAmount": 120,
    "Status": "active",
    "DeliveryDate": "2025-06-15T00:00:00.000Z",
    "createdAt": "2025-05-03T10:00:00.000Z"
  }
]
```

---

#### GET `/api/contracts/:id` 🔒 *(contract parties or admin)*
Get a single contract by ID.

**Error responses:** `403` Not authorized | `404` Contract not found

---

#### POST `/api/contracts` 🔒 *(client role required)*
Create a contract from an accepted proposal.

**Request body:**
```json
{
  "ProposalID": "664f1a2b3c4d5e6f7a8b9c0d",
  "DeliveryDate": "2025-06-15"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| ProposalID | String | Yes | Must reference an `accepted` proposal |
| DeliveryDate | Date | Yes | Must be a future date |

**Success response (201):** Fully populated contract object.

**Error responses:** `400` Proposal not accepted | `400` Contract already exists | `403` Not the task owner

---

#### PUT `/api/contracts/:id/status` 🔒 *(contract parties)*
Mark a contract as `completed` or `cancelled`.

**Request body:**
```json
{ "Status": "completed" }
```

Completing a contract automatically sets the task status to `completed`.

**Success response (200):** Updated contract object.

---

### 6. Reviews — `/api/contracts/:contractId/reviews` and `/api/reviews`

#### GET `/api/contracts/:contractId/reviews` 🔒 *(contract parties)*
Get all reviews for a specific contract.

**Success response (200):** Array of review objects.

---

#### POST `/api/contracts/:contractId/reviews` 🔒
Submit a review for a completed contract. Both client and provider can each submit one review.

**Request body:**
```json
{
  "Score": 5,
  "Comment": "Abdullah delivered excellent work on time. Highly recommended!"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| Score | Number | Yes | Integer from 1 to 5 |
| Comment | String | No | Optional text |

**Business rules:**
- Contract must be `completed`
- Each party may leave exactly one review
- Automatically recalculates and updates the reviewed user's `Rating` field

**Success response (201):** Created review object.

**Error responses:** `400` Not completed | `400` Already reviewed | `403` Not a party to the contract

---

#### GET `/api/reviews/:id`
Get a single review by ID. Public endpoint.

**Success response (200):**
```json
{
  "_id": "664f...",
  "ContractID": "...",
  "ReviewerID": { "Name": "Ali Shamah", "Rating": 4.5 },
  "Score": 5,
  "Comment": "Great work!",
  "createdAt": "2025-05-05T12:00:00.000Z"
}
```

---

#### DELETE `/api/reviews/:id` 🔒 *(reviewer or admin)*
Delete a review.

**Success response (200):**
```json
{ "message": "Review removed" }
```

---

#### GET `/api/reviews/provider/:providerId`
Get all reviews received by a provider from completed contracts. Public endpoint.

**Success response (200):** Array of review objects with reviewer and contract references.

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "message": "Description of what went wrong",
  "stack": "..."
}
```

`stack` is only included when `NODE_ENV` is not `production`.

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient role or not the owner |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

## Testing with cURL

```bash
# Register a client
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"Name":"Ali","Email":"ali@kfupm.edu.sa","Password":"secret123","Role":"client"}'

# Login and save the token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"Email":"ali@kfupm.edu.sa","Password":"secret123"}'

# Get all open Programming tasks
curl "http://localhost:5000/api/tasks?status=open&category=Programming"

# Create a task (replace YOUR_TOKEN)
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"Title":"Build a REST API","Description":"Need a Node.js Express REST API built with MongoDB and full CRUD.","Budget":200,"Category":"Programming"}'

# Get all services sorted by rating
curl "http://localhost:5000/api/services?sort=rating"
```

---

## Notes

- `.env` files and `node_modules/` are excluded from version control via `.gitignore`.
- Passwords are hashed with bcryptjs — never stored in plain text.
- JWT tokens expire after 30 days.
- All timestamps are stored in UTC.
- The UI is fully responsive: mobile navigation drawer and adaptive grids on small screens.
