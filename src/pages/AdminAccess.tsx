import { Link } from "react-router-dom";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminAccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-elegant">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display">Admin-Bereich</CardTitle>
          <CardDescription>
            Zugang zum Verwaltungs-Dashboard für autorisierte Benutzer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link to="/admin/login" className="block">
            <Button className="w-full group" size="lg">
              <span>Zum Admin-Dashboard</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <div className="text-center">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Zurück zur Hauptseite
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccess;