"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
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

interface ContactFormProps {
  title: string;
  subtitle: string;
  donationTitle: string;
  donationDescription: string;
  donationImage: string;
  donationImageAlt: string;
  donationButtonText: string;
  donationButtonUrl: string;
  newsletterTitle: string;
  newsletterDescription: string;
}

const subscribeSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(1),
  name: z.string().optional(),
});

type FormValues = z.infer<typeof subscribeSchema>;

export default function ContactForm({
  title,
  subtitle,
  donationTitle,
  donationDescription,
  donationImage,
  donationImageAlt,
  donationButtonText,
  donationButtonUrl,
  newsletterTitle,
  newsletterDescription,
}: ContactFormProps) {
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
    <div className="w-full max-w-7xl mx-auto">
      <Separator
        className="my-12"
        style={{ backgroundColor: "#d89e0f", height: "1px", opacity: 0.3 }}
      />
      <h1 className="text-[2.13rem] leading-9 font-semibold lg:max-w-[64%]font-bold  mb-12">
        {title}
      </h1>

      <div className="text-sm font-medium auto-cols-fr grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto] grid gap-[3.13rem]">
        {/* Donation Section */}
        <div className="space-y-6">
          <h2
            className="text-2xl font-medium border-l-4 pl-4"
            style={{ borderColor: "#d89e0f" }}
          >
            {donationTitle}
          </h2>

          <p className="text-gray-700">{donationDescription}</p>

          <div className="aspect-video bg-gray-50 border border-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
            <img
              src={donationImage}
              alt={donationImageAlt}
              className="max-h-full rounded-lg"
            />
          </div>

          <Button
            className="w-full py-6 text-black hover:text-white"
            style={{ backgroundColor: "#d89e0f", borderColor: "#d89e0f" }}
            asChild
          >
            <a
              href={donationButtonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              {donationButtonText} <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Newsletter Section */}
        <div className="space-y-6">
          <h2
            className="text-2xl font-medium border-l-4 pl-4"
            style={{ borderColor: "#d89e0f" }}
          >
            {newsletterTitle}
          </h2>

          <p className="text-gray-700">{newsletterDescription}</p>

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
        </div>
      </div>

      <Separator
        className="my-12"
        style={{ backgroundColor: "#d89e0f", height: "1px", opacity: 0.3 }}
      />
    </div>
  );
}
