import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    if (isLogin) {
      if (await login(email, password)) {
        toast.success("Welcome back to LoopDeal Admin!");
        navigate("/");
      } else {
        toast.error("Access Denied: Invalid Security Credentials.");
      }
    } else {
      if (await register(name, email, password)) {
        toast.success("Enterprise Access Granted! You can now log in.");
        setIsLogin(true);
      } else {
        toast.error("Registration Failed: Email already registered.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background Polish */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C41E22]/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C41E22]/5 rounded-full blur-[100px] -ml-48 -mb-48" />
      
      <div className="w-full max-w-sm space-y-8 relative">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-32 items-center justify-center rounded-2xl overflow-hidden p-2">
            <img src="/logo.png" alt="LoopDeal Logo" className="h-full w-full object-contain" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic italic-accent">{isLogin ? "LOOPDEAL LOGIN" : "JOIN THE TEAM"}</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{isLogin ? "Access your enterprise hub" : "Create an administrator account"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Admin Master"
                className="h-11 border-white/10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@loopdeal.in"
              className="h-11 border-white/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Security Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-11 border-white/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full h-11 bg-[#C41E22] hover:bg-[#A3161A] text-white font-bold rounded-xl shadow-lg transition-all" disabled={loading}>
            {loading ? (isLogin ? "Authorizing..." : "Registering...") : (isLogin ? "SIGN IN ADMIN" : "CREATE ACCOUNT")}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-xs font-bold text-[#C41E22] hover:underline uppercase tracking-widest"
          >
            {isLogin ? "Need a new account? Register here" : "Return to Login portal"}
          </button>
          
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-loose opacity-40">
            {isLogin ? "Demo Access: admin@store.com / admin123" : "Enterprise Registration requires master approval"}
          </p>
        </div>
      </div>
    </div>
  );
}
