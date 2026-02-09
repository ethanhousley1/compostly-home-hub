import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const SignUpComplete = () => (
  <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
    <div className="text-center max-w-md animate-fade-in">
      <CheckCircle className="mx-auto h-16 w-16 text-primary mb-4" />
      <h1 className="font-display text-3xl font-bold mb-3">Thank you!</h1>
      <p className="text-muted-foreground mb-6">
        Your Compostly account has been created. You're ready to start your composting journey!
      </p>
      <Link to="/what-to-compost">
        <Button className="gap-2">What to Compost →</Button>
      </Link>
    </div>
  </div>
);

export default SignUpComplete;
