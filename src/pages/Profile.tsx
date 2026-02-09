import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-3">Please sign in</h1>
          <p className="text-muted-foreground mb-4">You need to be signed in to view your profile.</p>
          <Link to="/signin"><Button>Sign In</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto max-w-lg px-4">
        <div className="rounded-xl border bg-card p-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <User className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-center mb-6">My Profile</h1>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={user?.name || ""} readOnly /></div>
            <div><Label>Email</Label><Input value={user?.email || ""} readOnly /></div>
          </div>
          <h2 className="font-display text-lg font-semibold mt-8 mb-4">Profile Settings</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm">Email Notifications</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm">Weekly Reminders</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
