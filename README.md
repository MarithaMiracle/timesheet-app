# Timesheet Management Application

## Overview
A modern Next.js 15 timesheet management application built with TypeScript and TailwindCSS. This application provides secure authentication, dashboard views, and comprehensive timesheet management with an intuitive user interface.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd timesheet-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_SECRET=your-super-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Authentication

### Test Credentials
- **Email**: `test@example.com`
- **Password**: `password123`

The application uses NextAuth.js with credentials provider for secure authentication.

## 📋 Features Implemented

### ✅ Core Authentication
- Secure login with NextAuth.js credentials provider
- JWT-based session management
- Protected routes and middleware
- Automatic redirect handling
- Error handling with user feedback

### ✅ Dashboard
- Comprehensive timesheet overview table
- Dynamic status calculation (Completed/Incomplete/Missing)
- Responsive design for all screen sizes
- Action buttons based on timesheet status
- Progress tracking and visual indicators

### ✅ Timesheet Management
- **Create Mode**: Add new time entries to missing timesheets
- **Update Mode**: Edit existing incomplete timesheets
- **View Mode**: Review completed timesheets
- Rich time entry modal with project selection
- Daily task breakdown with hours tracking
- Real-time progress calculation (40-hour target)
- Entry management (add, edit, delete functionality)

### ✅ Data Management
- User additions tracked separately
- Logout cleanup functionality

### ✅ UI/UX Features
- Modern, clean interface matching design specifications
- Toast notifications for user feedback
- Loading states and form validation
- Responsive mobile-first design
- Interactive dropdowns and modals
- Progress bars and status badges

## 🎯 Status System Implementation

The application implements a precise status calculation system:

- **Completed** (Green): Exactly 40 hours logged
- **Incomplete** (Yellow): 1-39 hours logged  
- **Missing** (Red): 0 hours logged

Status is calculated dynamically based on total hours across all entries for each week.

## 🏗️ Project Architecture

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/        # NextAuth configuration
│   │   └── timesheets/                # Timesheet CRUD endpoints
│   ├── auth/                          # Login page & components
│   ├── dashboard/                     # Dashboard & timesheet management
│   │   ├── components/TimesheetTable.tsx
│   │   └── timesheets/week/           # Create/Edit/View routes
│   └── globals.css                    # Global styles
├── components/
│   ├── common/                        # Core components
│   │   ├── AddEntryModal.tsx          # Time entry modal
│   │   ├── Header.tsx                 # Navigation
│   │   └── ThisWeeksTimesheet.tsx     # Main timesheet component
│   └── ui/                            # Reusable UI components
├── hooks/                             # Custom React hooks
├── lib/                               # Utilities & configuration
│   ├── auth.ts                        # NextAuth config
│   ├── hybridMockData.ts              # Data persistence
│   ├── mockData.ts                    # Base mock data
│   └── utils.ts                       # Helper functions
└── tests/                             # Vitest test files
```

## 🔧 Technology Stack

### Core Technologies
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5+
- **Styling**: TailwindCSS 4
- **Authentication**: NextAuth.js 4.24
- **State Management**: React hooks + Session Storage
- **Notifications**: React Hot Toast
- **Testing**: Vitest + Testing Library

### Key Dependencies
```json
{
  "next": "15.4.4",
  "react": "19.1.0",
  "next-auth": "^4.24.11",
  "tailwindcss": "^4",
  "typescript": "^5",
  "react-hot-toast": "^2.5.2",
  "zod": "^4.0.10",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.1"
}
```

## 📊 Data Flow

### 1. Authentication Flow
1. User accesses application → redirected to `/auth`
2. Credentials validated against mock user data
3. JWT token created and stored in session
4. User redirected to `/dashboard` with persistent session

### 2. Dashboard Data Flow
1. Loads original mock timesheet data
2. Merges with user additions from session storage
3. Calculates dynamic status for each week
4. Renders table with appropriate action buttons

### 3. Timesheet Management Flow
1. **Create**: `/dashboard/timesheets/week/new` - Add entries to missing weeks
2. **Update**: `/dashboard/timesheets/week/[id]/edit` - Modify incomplete weeks
3. **View**: `/dashboard/timesheets/week/[id]/view` - Display completed weeks
4. Real-time progress tracking and entry management
5. Data persisted to session storage on save

## 🎨 Design Implementation

### Responsive Design
- Mobile-first approach with TailwindCSS
- Breakpoint optimization for all device sizes
- Touch-friendly interactions and buttons
- Flexible layouts and component scaling

### Visual Design
- Inter font family (as specified in requirements)
- Consistent color scheme and spacing
- Modern UI patterns with rounded corners
- Smooth hover effects and transitions
- Status-based color coding (green/yellow/red)

## 🧪 Testing Setup

The project includes comprehensive testing infrastructure:

### Test Configuration
- **Framework**: Vitest with jsdom environment
- **Testing Library**: React Testing Library
- **Setup**: Custom vitest.setup.js with mock browser APIs
- **Coverage**: Component and hook testing capabilities



### Running Tests
```bash
npm run test          # Run all tests once
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run with UI interface
```

## 🔍 Key Implementation Details

### Mock Data Strategy
- **Original Data**: Preserved base timesheet weeks with different statuses
- **User Additions**: Tracked separately in session storage
- **Hybrid System**: Combines both for seamless user experience
- **Persistence**: Data survives page refreshes, clears on logout

### Status Calculation Logic
```typescript
export function getTimesheetStatus(totalHours: number): TimesheetStatus {
  if (totalHours === 40) return 'completed';
  else if (totalHours > 0 && totalHours < 40) return 'incomplete';
  else return 'missing';
}
```

### Session Management
- NextAuth.js JWT strategy for stateless authentication
- Session data includes user ID, name, and email
- 30-day session expiration with automatic renewal
- Secure token signing with NEXTAUTH_SECRET

## 🚫 Security Features

- CSRF protection via NextAuth.js
- JWT token validation on protected routes
- Input sanitization and validation with Zod
- Error boundary implementation for graceful failures
- Secure credential handling (no plain text storage)

## 💡 Assumptions & Design Decisions

### 1. Authentication
- Mock authentication sufficient for demo purposes
- Single test user account: `test@example.com` / `password123`
- JWT tokens preferred over database sessions for simplicity

### 2. Status Logic
- Exactly 40 hours = Completed (as per requirements)
- 1-39 hours = Incomplete
- 0 hours = Missing
- Real-time calculation on data changes

### 3. UI/UX Decisions
- Modal-based entry creation for better UX
- Inline editing for quick modifications
- Progressive disclosure (show details on demand)
- Toast notifications for immediate feedback

## 📈 Time Spent

**Total Development Time: ~16-20 hours**

Detailed breakdown:
- **Project Setup & Configuration**: 2-3 hours
  - Next.js 15 setup, TailwindCSS configuration
  - TypeScript configuration and dependencies
- **Authentication Implementation**: 3-4 hours
  - NextAuth.js setup and configuration
  - Login page and session management
  - Protected route middleware
- **Dashboard Development**: 4-5 hours
  - Table component creation
  - Status calculation logic
  - Responsive design implementation
- **Timesheet Management**: 5-6 hours
  - Modal component development
  - CRUD operations and state management
  - Progress tracking and validation
- **Testing & Polish**: 2-3 hours
  - Test setup and configuration
  - Bug fixes and error handling
  - Performance optimization

## 🔗 API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handler

### Timesheets  
- `GET /api/timesheets` - Fetch all timesheet weeks
- `POST /api/timesheets` - Create/update timesheet entries
- `GET /api/timesheets/[id]` - Fetch specific timesheet
- `PUT /api/timesheets/[id]` - Update specific timesheet

## 🚀 Deployment Notes

The application is production-ready with:
- Optimized build configuration
- Environment variable support
- Static asset optimization
- TypeScript strict mode enabled
- ESLint configuration for code quality

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

---

*Built with Next.js 15, TypeScript, and TailwindCSS*