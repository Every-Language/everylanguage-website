"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const subscribeSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(1),
  name: z.string().optional(),
});

type FormValues = z.infer<typeof subscribeSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to subscribe");
      }

      toast.success("Thank you for subscribing to our newsletter!");
      form.reset();
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Your Name"
          {...form.register("name")}
          className="border-gray-300 focus:border-[#d89e0f] focus:ring-[#d89e0f]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...form.register("email")}
          required
          className="border-gray-300 focus:border-[#d89e0f] focus:ring-[#d89e0f]"
        />
      </div>

      <Button
        type="submit"
        className="w-full py-6 text-black hover:text-white"
        style={{ backgroundColor: "#d89e0f", borderColor: "#d89e0f" }}
        onClick={form.handleSubmit(onSubmit)}
        disabled={isSubmitting || !form.watch("email")}
      >
        {isSubmitting ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}
