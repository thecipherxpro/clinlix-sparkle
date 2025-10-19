import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MobileNav from "@/components/MobileNav";

const steps = [
  {
    id: 1,
    title: "Select Your Service",
    description: "Choose from our range of professional cleaning packages tailored to your needs.",
    icon: Calendar,
    color: "from-blue-500 to-cyan-500",
    details: [
      "Browse available cleaning packages",
      "View pricing and service details",
      "Select date and time that works for you"
    ]
  },
  {
    id: 2,
    title: "Choose Location",
    description: "Add your address and any special instructions for our cleaning professionals.",
    icon: MapPin,
    color: "from-purple-500 to-pink-500",
    details: [
      "Enter your service address",
      "Add access instructions",
      "Specify any special requirements"
    ]
  },
  {
    id: 3,
    title: "Confirm & Pay",
    description: "Review your booking details and complete your payment securely.",
    icon: CreditCard,
    color: "from-orange-500 to-red-500",
    details: [
      "Review booking summary",
      "Choose payment method",
      "Receive instant confirmation"
    ]
  },
  {
    id: 4,
    title: "Enjoy Clean Space",
    description: "Sit back and relax while our verified professionals take care of everything.",
    icon: CheckCircle,
    color: "from-green-500 to-emerald-500",
    details: [
      "Track your provider in real-time",
      "Professional service guaranteed",
      "Rate and review your experience"
    ]
  }
];

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
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      {/* Header */}
      <div className="w-full px-[clamp(16px,4vw,32px)] pt-[clamp(16px,4vw,24px)] pb-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/customer/dashboard')}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-[clamp(24px,6vw,36px)] font-bold mb-2">
          How It Works
        </h1>
        <p className="text-muted-foreground text-[clamp(14px,3.5vw,16px)]">
          Book professional cleaning in 4 simple steps
        </p>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-[min(900px,calc(100%-32px))] mx-auto px-[clamp(16px,4vw,32px)] py-[clamp(20px,5vw,32px)]">
        
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-12">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <motion.div
                  initial={false}
                  animate={{
                    scale: idx === currentStep ? 1.1 : 1,
                    opacity: idx <= currentStep ? 1 : 0.4
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    idx <= currentStep ? 'bg-gradient-to-br ' + s.color : 'bg-muted'
                  }`}
                >
                  {idx + 1}
                </motion.div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                    idx < currentStep ? 'bg-gradient-to-r ' + s.color : 'bg-muted'
                  }`} />
                )}
              </div>
              <p className="text-xs mt-2 text-center hidden sm:block">
                {s.title.split(' ')[0]}
              </p>
            </div>
          ))}
        </div>

        {/* Step Card with 3D Effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100, rotateY: -20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: 20 }}
            transition={{ duration: 0.5, type: "spring" }}
            style={{ perspective: "1000px" }}
          >
            <Card className="border-0 shadow-2xl overflow-hidden">
              {/* 3D Icon Section */}
              <div className={`relative h-64 bg-gradient-to-br ${step.color} p-8 flex items-center justify-center overflow-hidden`}>
                <motion.div
                  animate={{
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl" />
                  <Icon className="w-32 h-32 text-white relative z-10" strokeWidth={1.5} />
                </motion.div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"
                />
                <motion.div
                  animate={{
                    y: [0, 20, 0],
                    x: [0, -10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute bottom-10 left-10 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"
                />
              </div>

              {/* Content Section */}
              <div className="p-8">
                <h2 className="text-[clamp(24px,6vw,32px)] font-bold mb-4">
                  Step {step.id}: {step.title}
                </h2>
                <p className="text-muted-foreground text-[clamp(14px,3.5vw,18px)] mb-6">
                  {step.description}
                </p>
                
                {/* Details List */}
                <ul className="space-y-3 mb-8">
                  {step.details.map((detail, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 + 0.3 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[clamp(13px,3.2vw,16px)]">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 max-w-[200px]"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              size="lg"
              onClick={handleNext}
              className="flex-1 max-w-[200px] bg-gradient-to-r from-primary to-primary/80"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="flex-1 max-w-[200px] bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Get Started
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Step Dots for Mobile */}
        <div className="flex justify-center gap-2 mt-8 sm:hidden">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default HowItWorks;
