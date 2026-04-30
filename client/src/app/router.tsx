import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AppLayout from "../layouts/AppLayout";

import LandingPage from "../pages/LandingPage";
// import LoginPage from "@/pages/LoginPage";
// import JoinSessionPage from "@/pages/JoinSessionPage";

// import ExamPage from "@/features/exam/pages/ExamPage";
// import InterviewPage from "@/features/interview/pages/InterviewPage";


export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            { path: "/", element: <LandingPage /> },
            // { path: "/login", element: <LoginPage /> },
            // { path: "/join/:code", element: <JoinSessionPage /> }
        ]
    },
    {
        element: <AppLayout />,
        children: [
            // { path: "/exam/:id", element: <ExamPage /> },
            // { path: "/interview/:id", element: <InterviewPage /> }
        ]
    }
]);