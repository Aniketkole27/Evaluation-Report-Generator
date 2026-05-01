export const ROUTES = {
  PUBLIC: {
    LANDING: '/',
    LOGIN: '/login',
    ABOUT: '/about',
    CONTACT: '/contact',
    QUIZ: {
      JOIN: '/quiz/:quizId/join',
      TAKE: '/quiz/:quizId',
    }
  },
  AUTH: {
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
  },
  APP: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    REPORTS: '/reports',
    EVALUATIONS: '/evaluations',
    TEACHER: {
      ROOT: '/teacher',
      DASHBOARD: '/teacher/dashboard',
      STUDENTS: '/teacher/students',
      PROGRESS: '/teacher/progress',
      SESSIONS: '/teacher/sessions',
      SETTINGS: '/teacher/settings',
    }
  }
} as const;
