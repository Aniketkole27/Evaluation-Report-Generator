import type { RouteObject } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import LandingPage from '../../pages/LandingPage';
import LoginPage from '../../features/auth/pages/LoginPage';
import QuizJoin from '../../features/quiz/pages/QuizJoin';
import QuizInterface from '../../features/quiz/pages/QuizInterface';
import { ROUTES } from './paths';

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.PUBLIC.LANDING,
        element: <LandingPage />,
      },
      {
        path: ROUTES.PUBLIC.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: ROUTES.PUBLIC.QUIZ.JOIN,
    element: <QuizJoin />,
  },
  {
    path: ROUTES.PUBLIC.QUIZ.TAKE,
    element: <QuizInterface />,
  },
];
