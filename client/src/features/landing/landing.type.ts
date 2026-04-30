// landing.types.ts

export interface FeatureItem {
    title: string;
    description: string;
    icon: string;
}

export interface Testimonial {
    name: string;
    role: string;
    message: string;
}

export interface PricingPlan {
    title: string;
    price: string;
    features: string[];
}