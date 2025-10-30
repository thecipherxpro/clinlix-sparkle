import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import step1Image from "@/assets/how-it-works/step-1-address.png";
import step2Image from "@/assets/how-it-works/step-2-booking.png";
import step3Image from "@/assets/how-it-works/step-3-pricing.png";
import step4Image from "@/assets/how-it-works/step-4-datetime.png";
import step5Image from "@/assets/how-it-works/step-5-provider.png";
import step6Image from "@/assets/how-it-works/step-6-addons.png";
import step7Image from "@/assets/how-it-works/step-7-payment.png";
import step8Image from "@/assets/how-it-works/step-8-confirmation.png";
const steps = [{
  id: 1,
  title: "Add Your Address",
  description: "Start by adding your service location. You can save up to 5 addresses for easy booking.",
  image: step1Image,
  color: "from-blue-500 to-cyan-500",
  details: ["Add up to 5 service addresses", "Save locations for quick access", "Include any special instructions"]
}, {
  id: 2,
  title: "Select Address & Services",
  description: "Go to the booking page and choose your address and the cleaning services you need.",
  image: step2Image,
  color: "from-purple-500 to-indigo-500",
  details: ["Select from your saved addresses", "Choose cleaning services", "View available service options"]
}, {
  id: 3,
  title: "View Fixed Pricing",
  description: "Our prices are fixed based on your property layout and number of bedrooms.",
  image: step3Image,
  color: "from-orange-500 to-yellow-500",
  details: ["Transparent fixed pricing", "Based on property size", "Number of bedrooms determines cost", "No hidden fees on base service"]
}, {
  id: 4,
  title: "Choose Date & Time",
  description: "Select when you want the cleaning service. We're available from 7 AM to 7 PM.",
  image: step4Image,
  color: "from-teal-500 to-cyan-500",
  details: ["Pick your preferred date", "Choose time slot (7 AM - 7 PM)", "Flexible scheduling options"]
}, {
  id: 5,
  title: "Select Service Provider",
  description: "Browse available providers for your chosen time. View profiles, ratings, and adjust time to see more options.",
  image: step5Image,
  color: "from-green-500 to-emerald-500",
  details: ["View provider profiles", "Check ratings and reviews", "Adjust time for more providers", "See provider availability"]
}, {
  id: 6,
  title: "Add Optional Add-ons",
  description: "Enhance your service with optional add-ons like deep cleaning, window washing, or carpet cleaning.",
  image: step6Image,
  color: "from-pink-500 to-purple-500",
  details: ["Deep cleaning options", "Window washing service", "Carpet cleaning available", "Customize your service"]
}, {
  id: 7,
  title: "Payment & Confirmation",
  description: "Add your payment method and confirm your booking. Your card will be charged once the provider accepts.",
  image: step7Image,
  color: "from-blue-500 to-indigo-500",
  details: ["Secure payment processing", "Add payment method", "Confirm booking details", "Charged after provider acceptance"]
}, {
  id: 8,
  title: "Provider Confirms",
  description: "Once confirmed, you'll receive an email with provider details and your card will be charged. Extra time may be needed for larger jobs with additional pricing.",
  image: step8Image,
  color: "from-green-500 to-emerald-500",
  details: ["Email confirmation sent", "Provider contact details shared", "Card charged after confirmation", "Extra time may be needed for larger jobs", "Additional pricing applies for extended time"]
}];
const HowItWorks = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleGetStarted = () => {
    navigate('/customer/booking');
  };
  const step = steps[currentStep];
  return <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      {/* Header */}
      <div className="w-full px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
        <Button variant="ghost" onClick={() => navigate('/customer/dashboard')} className="mb-3 sm:mb-4 text-sm" size="sm">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          How It Works
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Book professional cleaning in {steps.length} simple steps
        </p>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        
        {/* Progress Indicator - Hidden on mobile */}
        <div className="hidden md:flex justify-between items-center mb-8 lg:mb-12">
          {steps.map((s, idx) => <div key={s.id} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <motion.div initial={false} animate={{
              scale: idx === currentStep ? 1.1 : 1,
              opacity: idx <= currentStep ? 1 : 0.4
            }} className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm lg:text-base text-white ${idx <= currentStep ? 'bg-gradient-to-br ' + s.color : 'bg-muted'}`}>
                  {idx + 1}
                </motion.div>
                {idx < steps.length - 1 && <div className={`flex-1 h-1 mx-1 lg:mx-2 rounded-full transition-all duration-500 ${idx < currentStep ? 'bg-gradient-to-r ' + s.color : 'bg-muted'}`} />}
              </div>
              <p className="text-xs mt-2 text-center">
                {s.title.split(' ')[0]}
              </p>
            </div>)}
        </div>
        
        {/* Mobile Step Counter */}
        <div className="md:hidden text-center mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Step Card */}
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{
          opacity: 0,
          x: 50
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -50
        }} transition={{
          duration: 0.4
        }}>
            <Card className="border-0 shadow-lg sm:shadow-2xl overflow-hidden">
              {/* Image Section */}
              <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
                <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${step.color} opacity-20`} />
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                  Step {step.id}: {step.title}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
                  {step.description}
                </p>
                
                {/* Details List */}
                <ul className="space-y-2 sm:space-y-3">
                  {step.details.map((detail, idx) => <motion.li key={idx} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: idx * 0.1 + 0.2
                }} className="flex items-start gap-2 sm:gap-3">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm lg:text-base leading-relaxed">{detail}</span>
                    </motion.li>)}
                </ul>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6 sm:mt-8 gap-3 sm:gap-4">
          <Button variant="outline" size="default" onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-initial sm:min-w-[140px] text-sm sm:text-base">
            <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Previous</span>
            <span className="xs:hidden">Prev</span>
          </Button>

          {currentStep < steps.length - 1 ? <Button size="default" onClick={handleNext} className="flex-1 sm:flex-initial sm:min-w-[140px] bg-gradient-to-r from-primary to-primary/80 text-sm sm:text-base">
              Next
              <ChevronRight className="w-4 h-4 ml-1 sm:ml-2" />
            </Button> : <Button size="default" onClick={handleGetStarted} className="flex-1 sm:flex-initial sm:min-w-[140px] bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-sm sm:text-base">
              <span className="hidden xs:inline">Get Started</span>
              <span className="xs:hidden">Start</span>
              <CheckCircle className="w-4 h-4 ml-1 sm:ml-2" />
            </Button>}
        </div>

        {/* Step Dots for Mobile */}
        <div className="flex justify-center gap-2 mt-6 sm:mt-8 md:hidden">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                idx === currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </main>
    </div>;
};
export default HowItWorks;