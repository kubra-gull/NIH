/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import { UserRole } from "../types";
import {
  MessageSquareQuote,
  Star,
  Plus,
  Compass,
  Smile,
  Check,
  Award
} from "lucide-react";

export const FeedbackView: React.FC = () => {
  const { feedback, submitFeedback, currentUser } = useHub();

  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");
  const [successStory, setSuccessStory] = useState(false);
  const [success, setSuccess] = useState("");

  const [ratingHover, setRatingHover] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText) {
      alert("Please write a review comment prior to submission.");
      return;
    }

    submitFeedback({
      name: currentUser?.fullName || "Anoymous Field Officer",
      role: currentUser?.role || UserRole.VACCINATOR,
      facility: currentUser?.healthFacility || "Basic Health Unit Hub",
      rating,
      reviewText,
      successStory
    });

    setSuccess("Your feedback and satisfaction rating has been registered in the National public health audit logs.");
    
    // Clear Form
    setReviewText("");
    setRating(5);
    setSuccessStory(false);

    setTimeout(() => setSuccess(""), 4000);
  };

  // Aggregated analytics of satisfaction star star ratings
  const totalReviewsCount = feedback.length;
  const averageRating = totalReviewsCount > 0
    ? (feedback.reduce((acc, f) => acc + f.rating, 0) / totalReviewsCount).toFixed(1)
    : "5.0";

  return (
    <div id="feedback-hub-panel" className="space-y-6">
      
      {/* Visual Header */}
      <section className="bg-gradient-to-br from-[#005F73] to-neutral-900 text-white p-6 rounded-xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#00D4C7] to-[#0A3D4D]" />
        <div className="relative z-10 space-y-2">
          <span className="inline-block px-2.5 py-0.5 rounded text-[9px] uppercase font-mono bg-[#00D4C7]/20 border border-[#00D4C7]/30 text-[#00D4C7]">
            Platform Diagnostics & Satisfaction Logs
          </span>
          <h3 className="text-xl font-black flex items-center gap-1.5">
            <MessageSquareQuote className="w-5 h-5 text-[#00D4C7]" /> Field Feedback & Success Stories Portal
          </h3>
          <p className="text-neutral-300 text-xs font-light max-w-2xl">
            Live suggestions, reviews, and clinical audit stories from Lady Health Visitors, Medical Officers, and district vaccinators on the routine ground lines.
          </p>
        </div>
      </section>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Submit reviews & analytics overview */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Diagnostic overview metrics */}
          <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider font-mono">Satisfaction Metrics</h4>
            
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-[#005F73] font-mono">{averageRating}</span>
              <div>
                <div className="flex gap-0.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current text-amber-500" />
                  ))}
                </div>
                <p className="text-[10px] text-neutral-400 mt-1 uppercase font-mono font-medium">Out of {totalReviewsCount} field reports</p>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 space-y-2 text-xs font-light">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Intake Speed Satisfaction</span>
                <span className="font-bold text-green-600">96.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Offline Reliability rate</span>
                <span className="font-bold text-green-600">100.0%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">LHV Interface Ease score</span>
                <span className="font-bold text-cyan-600">92.4%</span>
              </div>
            </div>
          </section>

          {/* Review registration Form */}
          <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-3">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider font-mono border-b border-neutral-100 pb-2">
              Submit Field Assessment
            </h4>

            {success && (
              <p className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-[11px] font-medium leading-relaxed">
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
              
              {/* Star Star Selection */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-700 block">Overall Satisfaction *</label>
                <div className="flex gap-1 pt-1">
                  {[1, 2, 3, 4, 5].map((s) => {
                    const starsColored = ratingHover !== null ? s <= ratingHover : s <= rating;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setRatingHover(s)}
                        onMouseLeave={() => setRatingHover(null)}
                        className="p-1 focus:outline-none cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${starsColored ? "fill-amber-400 text-amber-500" : "text-neutral-200"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Success story checkbox */}
              <div className="flex items-center gap-2 bg-[#00D4C7]/5 border border-[#00D4C7]/20 p-2.5 rounded">
                <input
                  type="checkbox"
                  id="vax-review-success"
                  checked={successStory}
                  onChange={(e) => setSuccessStory(e.target.checked)}
                  className="w-4 h-4 rounded text-[#005F73]"
                />
                <label htmlFor="vax-review-success" className="text-[11px] text-neutral-700 font-bold block select-all cursor-pointer">
                  Mark as Public Health Success Story
                </label>
              </div>

              {/* Text review comment */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Detailed Feedback Review *</label>
                <textarea
                  required
                  placeholder="Record your experience with barcode scanning, temperature tracking adjustments, child folder intake velocity, or rural field coverage..."
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-2 border border-neutral-200 rounded text-xs bg-neutral-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#005F73] hover:bg-[#00D4C7] hover:text-neutral-900 text-white font-bold rounded shadow transition-all cursor-pointer"
              >
                Intake Assessment Log
              </button>

            </form>
          </section>

        </div>

        {/* Right column: Reviews Scroll Feed */}
        <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm lg:col-span-2 space-y-4">
          <h4 className="font-bold text-neutral-950 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <Compass className="w-4 h-4" /> Regional Immunizers Testimonials Board
          </h4>

          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1 select-none" id="reviews-board">
            {feedback.map((f) => (
              <div
                key={f.id}
                className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 shadow-xs relative overflow-hidden"
              >
                {/* Visual marker for public success stories */}
                {f.successStory && (
                  <div className="absolute top-0 right-0 bg-[#00D4C7] text-neutral-900 text-[8px] font-bold px-2 py-0.5 rounded-bl uppercase font-mono tracking-wider">
                    Success Story
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-neutral-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <Smile className="w-3.5 h-3.5 text-[#005F73]" /> {f.name}
                    </h5>
                    <p className="text-[9px] text-[#005F73] font-mono font-medium">{f.role} • {f.facility}</p>
                  </div>
                  <div className="flex gap-0.5 text-amber-500 shrink-0">
                    {Array.from({ length: f.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-neutral-600 text-[11px] leading-relaxed mt-2.5 font-sans italic">
                  "{f.reviewText}"
                </p>

                <div className="flex justify-between sm:items-center text-[9px] text-neutral-400 font-mono mt-3 pt-2 border-t border-neutral-150">
                  <span>FACILITY REGISTRAR PASS CODES: APPROVED</span>
                  <span>Registered {f.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
};
