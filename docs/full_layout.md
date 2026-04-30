## Outer Structure

```text
/ai-student-platform
│
├── /client                # React frontend
├── /server                # Node + Express backend
├── /docs                  # API docs, planning
└── README.md
```

## Client

```text
/client
│
├── /public
│   ├── favicon.ico
│   └── assets/                 # static images, logos
│
├── /src
│   │
│   ├── /app                    # app-level config
│   │   ├── router.tsx
│   │   ├── providers.tsx       # context providers
│   │   └── store.ts            # (if using global state)
│   │
│   ├── /pages                  # 🔥 ROUTE ENTRY POINTS
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── JoinSessionPage.tsx
│   │   └── NotFound.tsx
│   │
│   ├── /layouts                # layout wrappers
│   │   ├── PublicLayout.tsx
│   │   └── AppLayout.tsx
│   │
│   ├── /features               # 🔥 MAIN BUSINESS FEATURES
│   │   │
│   │   ├── /auth
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── auth.api.ts
│   │   │   ├── auth.types.ts
│   │   │   └── auth.store.ts
│   │   │
│   │   ├── /session
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── session.api.ts
│   │   │   └── session.types.ts
│   │   │
│   │   ├── /exam
│   │   │   ├── components/
│   │   │   │   ├── QuestionCard.tsx
│   │   │   │   ├── Timer.tsx
│   │   │   │   └── SubmitModal.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useExam.ts
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   └── ExamPage.tsx
│   │   │   │
│   │   │   ├── exam.api.ts
│   │   │   └── exam.types.ts
│   │   │
│   │   ├── /interview
│   │   │   ├── components/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   └── InputBox.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useInterview.ts
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   └── InterviewPage.tsx
│   │   │   │
│   │   │   ├── interview.api.ts
│   │   │   └── interview.types.ts
│   │   │
│   │   ├── /analytics
│   │   │   ├── components/
│   │   │   │   ├── Chart.tsx
│   │   │   │   └── ScoreCard.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   ├── analytics.api.ts
│   │   │   └── analytics.types.ts
│   │   │
│   │   ├── /landing           # 🔥 LANDING PAGE COMPONENTS
│   │       ├── components/
│   │       │   ├── Navbar.tsx
│   │       │   ├── Hero.tsx
│   │       │   ├── Features.tsx
│   │       │   ├── CTA.tsx
│   │       │   ├── Footer.tsx
│   │       │
│   │       ├── landing.data.ts
│   │       └── landing.types.ts
│   │
│   ├── /components            # 🔁 GLOBAL REUSABLE UI
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Loader.tsx
│   │
│   ├── /hooks                 # global hooks
│   │   ├── useAuth.ts
│   │   └── useDebounce.ts
│   │
│   ├── /services              # API + config
│   │   ├── apiClient.ts       # axios instance
│   │   └── socket.ts          # socket.io setup
│   │
│   ├── /utils
│   │   ├── helpers.ts
│   │   └── constants.ts
│   │
│   ├── /types
│   │   └── global.types.ts
│   │
│   ├── /styles
│   │   └── index.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
└── tsconfig.json
```

## Server

```text
/server
│
├── /src
│   │
│   ├── /modules           # 🔥 FEATURE-BASED MODULES
│   │   ├── /auth
│   │   ├── /session
│   │   ├── /exam
│   │   ├── /interview
│   │   ├── /analytics
│   │
│   ├── /shared            # shared logic
│   │   ├── db/
│   │   ├── ai/
│   │   ├── utils/
│   │   ├── constants/
│   │
│   ├── /middleware
│   ├── /config
│   ├── /routes            # central route loader
│   │
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   schema.prisma
│
├── .env
└── package.json
```

## MODULE STRUCTURE (SERVER)

```text
/modules/exam
│
├── exam.controller.ts
├── exam.service.ts
├── exam.routes.ts
├── exam.validation.ts
├── exam.types.ts
```

## CENTRAL ROUTE LOADER

```typescript 
// /routes/index.ts

import authRoutes from "../modules/auth/auth.routes";
import examRoutes from "../modules/exam/exam.routes";

export const registerRoutes = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/exam", examRoutes);
};
```

## SHARED LAYER

```text
/shared
│
├── /db
│   prisma.ts
│
├── /ai
│   ai.service.ts
│
├── /utils
│   helpers.ts
│
├── /constants
│   roles.ts
```

## Example AI Service

```typescript 
// shared/ai/ai.service.ts

export const generateMCQ = async (syllabus: string) => {
  // OpenAI call
};

export const evaluateAnswer = async (answer: string) => {
  // evaluation logic
};
```

## MIDDLEWARE

```text
/middleware
│
├── auth.middleware.ts
├── role.middleware.ts
├── error.middleware.ts
```

Example
```typescript 
// role.middleware.ts

export const checkRole = (role: string) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send("Forbidden");
    }
    next();
  };
};
```

## DATABASE (Prisma Location)

```text
/prisma
│
├── schema.prisma
```

## DATA FLOW

> Client → Route → Controller → Service → DB / AI → Response

## HOW YOU ADD NEW FEATURE

`/modules/panchkosh`

## RULES YOU MUST FOLLOW

### ✅ DO:
- Keep logic inside services
- Keep modules isolated
- Use shared services

### ❌ DON'T:
- Call one module directly from another
- Put all logic in controller
- Mix features in one folder    