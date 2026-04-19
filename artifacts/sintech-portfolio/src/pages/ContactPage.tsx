import React from "react";
import { PageLayout } from "@/components/PageLayout";
import { Contact } from "@/components/Contact";

export function ContactPage() {
  return (
    <PageLayout>
      <div className="py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Contact Us</h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">We'd love to hear from you.</p>
      </div>
      <Contact />
    </PageLayout>
  );
}
