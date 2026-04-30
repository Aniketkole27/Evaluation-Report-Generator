import Navbar from "../features/landing/components/Navbar"
import Hero from "../features/landing/components/Hero"
import About from "../features/landing/components/About"
import HowToStart from "../features/landing/components/HowToStart"
import Pricing from "../features/landing/components/Pricing"
import Footer from "../features/landing/components/Footer"


const LandingPage = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <Navbar />
            <main>
                <Hero />
                <About />
                <HowToStart />
                <Pricing />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;