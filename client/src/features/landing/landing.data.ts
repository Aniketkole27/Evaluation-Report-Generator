// landing.data.ts

import type { FeatureItem, PricingPlan } from "./landing.type";

export const features: FeatureItem[] = [
    {
        title: "AI-Based Exams",
        description: "Automatically generate MCQs from syllabus",
        icon: "brain"
    },
    {
        title: "AI Interviews",
        description: "Adaptive technical and scenario-based interviews",
        icon: "chat"
    }
];

export const pricingPlans: PricingPlan[] = [
    {
        title: "Basic",
        price: "₹499/month",
        features: ["10 exams", "Basic analytics"]
    },
    {
        title: "Pro",
        price: "₹999/month",
        features: ["Unlimited exams", "AI interviews", "Advanced analytics"]
    }
];