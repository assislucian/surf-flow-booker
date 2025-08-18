import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, ArrowRight, Calendar, Users, Star, Sparkles } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
  userEmail?: string;
}

const steps = [
  {
    id: "welcome",
    icon: "👋",
    titleKey: "onboarding.welcome.title",
    descKey: "onboarding.welcome.description"
  },
  {
    id: "features",
    icon: "🏄‍♂️",
    titleKey: "onboarding.features.title",
    descKey: "onboarding.features.description"
  },
  {
    id: "premium",
    icon: "⭐",
    titleKey: "onboarding.premium.title",
    descKey: "onboarding.premium.description"
  }
];

export const OnboardingFlow = ({ onComplete, userEmail }: OnboardingFlowProps) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    // Store onboarding completion in localStorage
    localStorage.setItem('onboarding_completed', Date.now().toString());
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg opacity-100 scale-100 transition-all">
        <Card className="border-primary/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="text-6xl">{currentStepData.icon}</div>
            </div>
            <div className="flex justify-center gap-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <CardTitle className="text-2xl font-bold">
              {t(currentStepData.titleKey)}
            </CardTitle>
            <CardDescription className="text-base">
              {t(currentStepData.descKey)}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div key={currentStep} className="opacity-100 transition-opacity">
              {currentStep === 0 && (
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
                    <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t("onboarding.welcome.subtitle", { email: userEmail })}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Calendar className="h-6 w-6 mx-auto mb-1 text-primary" />
                      <p className="text-xs font-medium">{t("onboarding.welcome.feature1")}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Users className="h-6 w-6 mx-auto mb-1 text-primary" />
                      <p className="text-xs font-medium">{t("onboarding.welcome.feature2")}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {[
                      { icon: Calendar, key: "booking" },
                      { icon: Crown, key: "premium" },
                      { icon: Users, key: "community" }
                    ].map((feature, index) => (
                      <div key={feature.key} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <feature.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">
                          {t(`onboarding.features.${feature.key}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                    <Crown className="h-12 w-12 text-primary mx-auto mb-2" />
                    <Badge variant="secondary" className="bg-gradient-primary text-white mb-2">
                      {t("onboarding.premium.badge")}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {t("onboarding.premium.benefit")}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      {t("onboarding.premium.optional")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1"
                >
                  {t("common.back")}
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={isCompleting}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                {isCompleting ? (
                  t("onboarding.completing")
                ) : currentStep === steps.length - 1 ? (
                  t("onboarding.getStarted")
                ) : (
                  <>
                    {t("common.next")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};