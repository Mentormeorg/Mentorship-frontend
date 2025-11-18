# MentorChief - Mentorship Platform

## 🎯 What is MentorChief?

MentorChief is a mentorship platform that connects junior developers with senior mentors through **1-on-1 real-time chat**. Users subscribe monthly to access unlimited messaging with selected mentors.

## 💡 Core Value Proposition

**Junior developers pay $10/month to chat 1-on-1 with mentors in real-time via WebSocket.**

---

## 👥 User Personas

### Junior Developer
- **Goal**: Get guidance, career advice, code reviews
- **Pain Points**: Lack of mentorship, unclear career path
- **Solution**: Direct access to experienced mentors via chat

### Senior Mentor
- **Goal**: Share knowledge, help juniors grow
- **Pain Points**: Limited time, need structured communication
- **Solution**: Manageable chat-based mentorship

---

## 🚀 Key Features (MVP)

### ✅ Authentication
- Sign up / Sign in
- OAuth (Google, LinkedIn, GitHub)
- Password reset
- Account activation

### ✅ Mentor Discovery
- Browse mentors list
- Filter by skills, experience, availability
- View mentor profiles (bio, skills, rate)

### ✅ Subscription (Monthly)
- Paywall for non-subscribed users
- Paymob integration for payments
- Subscription status tracking
- Automatic renewal

### ✅ Real-time Chat
- 1-on-1 messaging with mentors
- WebSocket-based real-time communication
- Typing indicators
- Message read receipts
- Conversation history

---

## 🔍 How the MVP Works (Detailed)

This section provides a comprehensive breakdown of how each feature works in the MVP, including technical implementation details, data flow, and user interactions.

---

### 1. Authentication System

#### How It Works
- **Sign Up**: User creates account with email/password or OAuth (Google, LinkedIn, GitHub)
- **Email Verification**: User receives verification email with activation link
- **Sign In**: User logs in with credentials or OAuth provider
- **Token Management**: JWT tokens (access + refresh) stored in browser storage
- **Auto-Refresh**: Refresh token automatically renews access token when expired

#### Technical Flow
1. User submits login form → `AuthenticationService.login()`
2. Frontend sends POST to `/auth/sign-in`
3. Backend validates credentials → Returns JWT tokens
4. Frontend stores tokens → Updates `isAuthenticated` BehaviorSubject
5. `JwtTokenInterceptor` automatically injects token in all HTTP requests
6. On 401 error → `ErrorHandlingInterceptor` attempts refresh token
7. If refresh succeeds → Retry original request
8. If refresh fails → Logout user → Redirect to login

#### Data Stored
- `accessToken`: JWT token for API authentication (expires in 15 minutes)
- `refreshToken`: Token for refreshing access token (expires in 7 days)
- `userData`: User profile information (name, email, role, avatar)

---

### 2. Mentor Discovery System

#### How It Works
- **Browse Mentors**: User sees grid/list of available mentors
- **Filter Mentors**: Filter by skills, experience level, availability, price
- **Search Mentors**: Search by name, skills, or keywords
- **View Profile**: Click mentor card to see detailed profile
- **Start Chat**: Click "Start Chat" button to initiate conversation

#### Technical Flow
1. User navigates to `/dashboard/discover`
2. `MentorsService.getMentors()` calls `GET /mentors`
3. Backend returns paginated list of mentors
4. Frontend displays mentor cards with:
   - Profile picture
   - Name, title, bio
   - Skills list
   - Rating (if available)
   - Hourly rate
5. User applies filters → Service calls API with query params
6. User clicks mentor card → Navigate to mentor profile
7. User clicks "Start Chat" → Check subscription status

#### Data Flow
```
Frontend → GET /mentors?page=1&limit=20&skills=JavaScript
Backend → Returns: { mentors: [...], total: 50, page: 1 }
Frontend → Displays mentor cards
```

---

### 3. Subscription System

#### How It Works
- **Paywall**: Non-subscribed users see paywall when trying to access chat
- **Checkout**: User clicks "Subscribe Now" → Redirected to Paymob checkout
- **Payment**: User completes payment via Paymob (card, wallet, etc.)
- **Webhook**: Backend receives Paymob webhook → Updates subscription status
- **Activation**: User redirected back → Subscription activated → Can access chat
- **Status Tracking**: User can view subscription status, renewal date, cancel subscription

#### Technical Flow
1. User clicks "Start Chat" (without subscription)
2. `SubscriptionGuard` checks subscription status via `GET /subscriptions/status`
3. If no active subscription → Redirect to `/subscription/paywall`
4. User clicks "Subscribe Now" → `SubscriptionService.createCheckoutSession()`
5. Frontend calls `POST /subscriptions/checkout` with `mentorId` (optional)
6. Backend creates Paymob order → Returns checkout URL
7. Frontend redirects user to Paymob URL
8. User completes payment on Paymob
9. Paymob sends webhook to backend → Backend verifies payment → Updates subscription
10. Paymob redirects user back to frontend with `?success=true` or `?error=...`
11. Frontend checks callback → Updates subscription status → Shows success message
12. User can now access chat

#### Subscription States
- **Active**: `status: 'active'`, `renewsAt: Date` → User can access chat
- **Canceled**: `status: 'canceled'`, `renewsAt: Date` → User can access until period ends
- **Expired**: `status: 'expired'`, `renewsAt: null` → User redirected to paywall

#### Data Flow
```
Frontend → POST /subscriptions/checkout
Backend → Creates Paymob order → Returns: { checkoutUrl: 'https://paymob...' }
Frontend → Redirects to Paymob URL
User → Completes payment
Paymob → Sends webhook to Backend
Backend → Verifies payment → Updates subscription → Returns: { status: 'active' }
Frontend → Redirects back → Shows success message
```

---

### 4. Chat System (Real-time WebSocket)

#### How It Works
- **Conversation Creation**: User selects mentor → Creates conversation (if not exists)
- **WebSocket Connection**: Frontend establishes WebSocket connection with JWT authentication
- **Real-time Messaging**: Messages sent/received instantly via WebSocket
- **Message Persistence**: Messages stored in database → Loaded on page refresh
- **Typing Indicators**: Real-time typing status updates
- **Read Receipts**: Message read status tracked and displayed
- **Unread Count**: Unread message count per conversation

#### Technical Flow

##### Conversation Creation
1. User clicks "Start Chat" on mentor profile
2. Frontend checks if conversation exists: `GET /conversations?mentorId=123`
3. If exists → Navigate to chat thread
4. If not → `ConversationsService.createConversation(mentorId)`
5. Frontend calls `POST /conversations` with `{ mentorId: '123' }`
6. Backend creates conversation → Returns conversation object
7. Frontend navigates to `/chat/:conversationId`

##### WebSocket Connection
1. User opens chat thread → `ChatService.connect()` called
2. Frontend establishes WebSocket connection: `new WebSocket(wsUrl, jwt)`
3. WebSocket sends JWT token in connection handshake (query param or header)
4. Backend validates JWT → Accepts connection
5. Frontend subscribes to WebSocket events:
   - `message:new` - New message received
   - `conversation:updated` - Conversation metadata updated
   - `typing` - Typing indicator
   - `message:read` - Message read receipt

##### Sending Messages
1. User types message in composer → `ComposerComponent`
2. User clicks "Send" → `ChatService.sendMessage(conversationId, body)`
3. Frontend emits WebSocket event: `sendMessage` with payload `{ conversationId, body }`
4. Backend receives event → Validates subscription → Stores message → Broadcasts to participants
5. Backend emits `message:new` event to both users
6. Frontend receives event → Updates message list → Shows message in thread

##### Receiving Messages
1. Backend receives message from other user → Broadcasts `message:new` event
2. Frontend WebSocket listener receives event
3. `ChatService.message$` Observable emits new message
4. `ThreadComponent` subscribes to `message$` → Updates UI
5. Message appears in thread → Auto-scrolls to bottom
6. If conversation is active → Mark as read automatically
7. If conversation is inactive → Increment unread count

##### Typing Indicator
1. User types in composer → `ComposerComponent` detects typing
2. Debounce typing (wait 500ms) → `ChatService.onTyping(conversationId, true)`
3. Frontend emits WebSocket event: `typing` with payload `{ conversationId, isTyping: true }`
4. Backend broadcasts to other participant
5. Other user's frontend receives `typing` event → Shows "Mentor is typing..." indicator
6. User stops typing → Frontend emits `typing` with `isTyping: false` → Indicator disappears

##### Message History
1. User opens conversation → `ThreadComponent` loads
2. Frontend calls `GET /messages?conversationId=123&page=1&limit=50`
3. Backend returns paginated messages (oldest first)
4. Frontend displays messages in thread
5. User scrolls up → Load more messages: `GET /messages?conversationId=123&page=2`
6. Frontend prepends older messages to thread

##### Read Receipts
1. User opens conversation → All unread messages marked as read
2. Frontend calls `POST /messages/read` with `{ conversationId, messageIds: [...] }`
3. Backend updates message `readAt` timestamp
4. Backend broadcasts `message:read` event to sender
5. Sender's frontend receives event → Updates read status in UI

#### Data Flow (Message Sending)
```
User types message → ComposerComponent
  ↓
ChatService.sendMessage(conversationId, body)
  ↓
WebSocket.send({ type: 'sendMessage', payload: { conversationId, body } })
  ↓
Backend receives → Validates → Stores in DB
  ↓
Backend broadcasts: { type: 'message:new', payload: { message } }
  ↓
Both users receive event → Update UI
```

#### Data Flow (Message Receiving)
```
Mentor sends message → Backend
  ↓
Backend stores message → Broadcasts event
  ↓
Junior's WebSocket receives: { type: 'message:new', payload: { message } }
  ↓
ChatService.message$ emits → ThreadComponent updates
  ↓
Message appears in thread → Auto-scroll → Mark as read
```

---

### 5. Route Protection & Guards

#### How It Works

##### AuthGuard
- **Purpose**: Protect routes that require authentication
- **Check**: Verify JWT token exists and is valid
- **Action**: If not authenticated → Redirect to `/auth`
- **Applied To**: `/dashboard/*`, `/chat/*`, `/subscription/status`

##### GuestGuard
- **Purpose**: Prevent authenticated users from accessing auth pages
- **Check**: Verify user is NOT authenticated
- **Action**: If authenticated → Redirect to `/dashboard`
- **Applied To**: `/auth/*`

##### SubscriptionGuard
- **Purpose**: Protect chat routes that require active subscription
- **Check**: Call `GET /subscriptions/status` → Verify `status === 'active'`
- **Action**: If not subscribed → Redirect to `/subscription/paywall`
- **Applied To**: `/chat/*`

#### Technical Flow
```
User navigates to /chat
  ↓
SubscriptionGuard.canActivate()
  ↓
Calls SubscriptionService.getStatus()
  ↓
GET /subscriptions/status
  ↓
Backend returns: { status: 'active', renewsAt: '2024-02-01' }
  ↓
Guard checks: status === 'active' → true
  ↓
User can access /chat
```

---

### 6. Error Handling & Edge Cases

#### Error Handling
- **Network Errors**: Show toast notification → Retry option
- **401 Unauthorized**: Auto-refresh token → Retry request → If fails → Logout
- **403 Forbidden**: Show error message → Redirect to subscription page
- **WebSocket Disconnection**: Auto-reconnect with exponential backoff
- **Payment Failure**: Show error message → Redirect to paywall

#### Edge Cases
- **User tries to chat without subscription**: Redirected to paywall
- **Subscription expires during chat**: Show warning → Redirect to paywall
- **WebSocket connection fails**: Show offline indicator → Retry connection
- **Message fails to send**: Show error → Retry option
- **User closes browser during chat**: WebSocket disconnects → Reconnects on return

---

### 7. State Management

#### How It Works
- **RxJS BehaviorSubjects**: Store application state (user, subscriptions, conversations)
- **Services**: Each module has its own service managing state
- **OnPush Change Detection**: Components use OnPush for performance
- **Observable Streams**: State changes flow through Observable streams

#### State Stores
- `AuthenticationService.userData`: Current user data
- `AuthenticationService.isAuthenticated`: Authentication status
- `SubscriptionService.status$`: Current subscription status
- `ChatService.message$`: New messages stream
- `ChatService.typing$`: Typing indicators stream
- `ConversationsService.conversations$`: Conversations list

---

### 8. Performance Optimizations

#### Implemented
- **Lazy Loading**: All modules loaded on demand
- **OnPush Change Detection**: Components only update when input changes
- **TrackBy Functions**: Efficient list rendering with `*ngFor`
- **Virtual Scrolling**: For long message lists (future)
- **Message Pagination**: Load messages in chunks
- **WebSocket Reconnection**: Automatic reconnection with backoff

---

## 📱 User Flows

### Flow 1: New User Journey
1. User lands on homepage
2. User clicks "Sign Up"
3. User creates account (or uses OAuth)
4. User verifies email
5. User completes registration steps
6. User redirected to dashboard

### Flow 2: Discovery & Chat
1. User browses mentors on Discover page
2. User clicks on a mentor card
3. User views mentor profile
4. User clicks "Start Chat"
5. **If not subscribed**: User redirected to Paywall
6. **If subscribed**: User redirected to Chat
7. User sends message → Mentor receives in real-time

### Flow 3: Subscription
1. User clicks "Start Chat" (without subscription)
2. User sees Paywall page
3. User clicks "Subscribe Now"
4. User redirected to Paymob checkout
5. User completes payment
6. User redirected back → Subscription active
7. User can now access Chat

---

## 🏗️ Architecture Overview

### Frontend Stack
- **Framework**: Angular 15
- **State Management**: RxJS (BehaviorSubjects)
- **UI Library**: PrimeNG, Bootstrap
- **Real-time**: WebSocket (via native WebSocket API)
- **Payment**: Paymob (via backend integration)

### Module Structure
```
src/app/modules/
├── authentication/     # Login, Register, OAuth
├── dashboard/         # Discover mentors
├── subscription/      # Paywall, Subscribe, Status
├── chat/              # Conversations, Thread
└── registration-steps/ # Onboarding flow
```

---

## 🔐 Access Control

### Route Protection
- **Public Routes**: Landing, Auth pages
- **Protected Routes**: Dashboard, Chat (require authentication)
- **Subscription-Protected Routes**: Chat (require active subscription)

### Guards
- `AuthGuard`: Checks if user is authenticated
- `GuestGuard`: Redirects authenticated users away from auth pages
- `SubscriptionGuard`: Checks if user has active subscription

---

## 📊 Key Screens

### 1. Landing Page
- Hero section with value proposition
- Call-to-action buttons (Sign Up / Sign In)

### 2. Discover Page
- Grid of mentor cards
- Filters (skills, experience, availability)
- Search functionality

### 3. Mentor Profile
- Mentor bio, skills, experience
- "Start Chat" button
- Subscription status indicator

### 4. Paywall
- Benefits list (unlimited chat, real-time messaging)
- Pricing ($10/month)
- "Subscribe Now" button

### 5. Chat - Conversations List
- List of active conversations
- Mentor name, last message preview
- Unread badge

### 6. Chat - Thread
- Message history
- Message composer (text input + send button)
- Typing indicator
- Read receipts

---

## 🔄 Subscription Model

### Pricing
- **Monthly Subscription**: $10/month
- **Payment Method**: Paymob (card, wallet)
- **Auto-renewal**: Enabled by default

### Subscription States
- **Active**: User can access chat
- **Canceled**: User can access until period ends
- **Expired**: User redirected to Paywall

---

## 🛠️ Development

### Prerequisites
- Node.js v16.14+
- pnpm (package manager)

### Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Run linting
pnpm lint

# Run tests
pnpm test
```

### Environment Variables
- `baseUrl`: Backend API URL (default: `http://localhost:3000/api/v1`)
- `wsUrl`: WebSocket URL (default: `ws://localhost:3000`)

---

## 📝 Terminology

- **Junior**: User seeking mentorship (subscriber)
- **Mentor**: Experienced professional providing guidance
- **Conversation**: 1-on-1 chat between junior and mentor
- **Thread**: Message history in a conversation
- **Subscription**: Monthly payment plan for chat access

---

## 🚧 Current Status

### ✅ Completed
- Authentication module (Login/Register)
- Mentor discovery page
- Mentor cards display
- Basic routing structure

### 🚧 In Progress
- Subscription module (Paywall, Subscribe, Status)
- Chat module (Conversations, Thread, WebSocket)
- Route guards (Auth, Subscription)

### 📋 Planned
- Testing (Unit, E2E)
- Error handling & loading states
- Empty states & UX polish

---

## 📚 Documentation

- **Developer Tasks**: See [TASKS.md](./TASKS.md) for detailed task breakdown
- **API Documentation**: Backend API docs (TBD)
- **Deployment Guide**: TBD

---

## 🎯 MVP Success Criteria

MVP is considered **COMPLETE** when:
1. ✅ User can sign in/sign up
2. ✅ User can browse mentors
3. ✅ User can subscribe (Paymob checkout)
4. ✅ User can access chat only with active subscription
5. ✅ User can send/receive messages in real-time
6. ✅ Messages persist and load on page refresh
7. ✅ Typing indicator works
8. ✅ All routes protected with appropriate guards

---

## 📞 Support

For questions or issues:
- **Technical Issues**: Open an issue in the repository
- **Product Questions**: Contact product team

---

## 📄 License

[Add your license here]

---

**Last Updated**: [Date]

**Version**: 0.0.0 (MVP)
