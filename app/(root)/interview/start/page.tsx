"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export default function StartInterviewForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: "",
    level: "",
    techstack: "",
    type: "role",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          role: formData.role,
          level: formData.level,
          techstack: formData.techstack,
          amount: formData.amount,
          userid: "PdDCexSYOWURA0twzDCLGXrnt1q1",
        }),
      });
      const data = await res.json();
      if (data.success && data.id) {
        router.push(`/interview/[id]`.replace("[id]", data.id));
      } else {
        alert("Failed to generate interview questions.");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0A0F0D] flex justify-center items-center px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-[#121814] p-12 rounded-3xl shadow-xl border border-[#1F2A22]"
      >
        <h1 className="text-4xl font-bold text-primary-100 text-center mb-6">
          Get Interview-Ready with AI-Powered Practice & Feedback
        </h1>
        <p className="text-lg text-gray-300 text-center mb-10 max-w-2xl mx-auto">
          Practice real interview questions and get instant, actionable
          feedback.
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Label className="text-gray-300 text-lg font-medium">Role</Label>
            <Input
              name="role"
              placeholder="e.g. Backend Developer"
              value={formData.role}
              onChange={handleChange}
              required
              className="bg-[#1A231E] border-none text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-4 py-3 text-base"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-gray-300 text-lg font-medium">
              Experience Level
            </Label>
            <Select onValueChange={(val) => handleSelectChange("level", val)}>
              <SelectTrigger className="bg-[#1A231E] border-none text-white focus:ring-2 focus:ring-primary-100 rounded-lg px-4 py-3 text-base">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A231E] text-white border border-[#2A3A32]">
                <SelectItem value="entry">Entry</SelectItem>
                <SelectItem value="mid">Mid</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-gray-300 text-lg font-medium">
              Tech Stack
            </Label>
            <Textarea
              name="techstack"
              placeholder="e.g. Node.js, Express.js, MongoDB"
              value={formData.techstack}
              onChange={handleChange}
              required
              className="bg-[#1A231E] border-none text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-4 py-3 text-base resize-none"
              rows={4}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-gray-300 text-lg font-medium">
              Number of Questions
            </Label>
            <Input
              type="number"
              name="amount"
              placeholder="e.g. 5"
              value={formData.amount}
              onChange={handleChange}
              required
              className="bg-[#1A231E] border-none text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-4 py-3 text-base"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-xl font-semibold rounded-xl transition-all duration-200"
          >
            {loading ? "Generating..." : "Start Interview"}
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
