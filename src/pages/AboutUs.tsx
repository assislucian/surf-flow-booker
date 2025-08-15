import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, TrendingUp, Smile } from "lucide-react";

const AboutUs = () => {
  const { t } = useTranslation();
  const valuesRaw = t("aboutUs.values.items", { returnObjects: true }) as unknown;
  const values = Array.isArray(valuesRaw) ? (valuesRaw as { title: string; desc: string }[]) : [];

  const valueIcons = [Users, TrendingUp, Heart, Smile];

  return (
    <main className="min-h-screen">
      <Helmet>
        <title>{t("aboutUs.title")} - Surfskate Hall Wiesbaden</title>
        <meta name="description" content={t("aboutUs.subtitle") as string} />
        <link rel="canonical" href="/about" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-subtle py-16 md:py-20">
        <div className="container text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight mb-6 animate-fade-in">
            {t("aboutUs.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            {t("aboutUs.subtitle")}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit">
              {t("aboutUs.story.title")}
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              {t("aboutUs.story.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("aboutUs.story.content")}
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-primary rounded-2xl shadow-glow flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🏄‍♂️</div>
                <p className="text-lg font-medium">Surfskate Hall</p>
                <p className="text-sm opacity-90">Wiesbaden</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              {t("aboutUs.mission.title")}
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">
              {t("aboutUs.mission.title")}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t("aboutUs.mission.content")}
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container py-16 md:py-20">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-6">
            {t("aboutUs.values.title")}
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            {t("aboutUs.values.title")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const IconComponent = valueIcons[index] || Heart;
            return (
              <Card key={index} className="text-center p-6 hover-scale transition-all duration-300 hover:shadow-elegant">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gradient-subtle py-16 md:py-20">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-6">
            {t("aboutUs.team.title")}
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6">
            {t("aboutUs.team.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            {t("aboutUs.team.subtitle")}
          </p>
          
          {/* Team placeholder */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[1, 2, 3].map((member) => (
              <Card key={member} className="p-6 text-center hover-scale">
                <CardContent className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                    <span className="text-2xl text-white">🤙</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Team Member</h3>
                    <p className="text-sm text-muted-foreground">Surfskate Coach</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;