// import Navbar from "../features/landing/components/Navbar"
import Hero from "../features/landing/components/Hero"
import About from "../features/landing/components/About"
import HowToStart from "../features/landing/components/HowToStart"
import Pricing from "../features/landing/components/Pricing"
// import Footer from "../features/landing/components/Footer"


const LandingPage = () => {
    return (
        <div className="selection:bg-white selection:text-black">
            <Hero />
            <About />
            <HowToStart />
            <Pricing />
        </div>
    );
};

export default LandingPage;