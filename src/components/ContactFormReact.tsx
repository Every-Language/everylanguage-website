import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to subscribe");
      }

      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
      setName("");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Donation Section */}
        <Card>
          <CardHeader>
            <CardTitle>Support Our Mission</CardTitle>
            <CardDescription>
              Help us translate the Bible into every language in audio and text
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Your generous donation helps us bring God's word to people in
              their native language, making the Gospel accessible to everyone
              around the world.
            </p>
            <div className="flex justify-center">
              <img
                src="/placeholder.svg?height=120&width=200"
                alt="Translation project illustration"
                className="rounded-md"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <a
                href="https://wegive.com/holos"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Donate Now <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>

        {/* Newsletter Section */}
        <Card>
          <CardHeader>
            <CardTitle>Stay Updated</CardTitle>
            <CardDescription>
              Subscribe to our newsletter for project updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              onClick={handleSubscribe}
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Separator className="my-4" />
        <p className="text-sm text-muted-foreground">
          The Every Language Gospel Translation Project is dedicated to making
          God's word accessible to all people in their native languages.
        </p>
      </div>
    </div>
  );
}
