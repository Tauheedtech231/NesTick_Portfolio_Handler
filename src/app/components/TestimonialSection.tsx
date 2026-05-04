"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  imageUrl: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Parker Robert",
    role: "UI Designer",
    text: "when an unknown printer took a galley of type and scrambled to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Emily Johnson",
    role: "Web Developer",
    text: "The learning experience was amazing! The instructors are very knowledgeable and the curriculum is well-structured. I highly recommend this course.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Product Manager",
    text: "This platform transformed my career. The practical approach to teaching really helped me understand complex concepts easily.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Sophia Martinez",
    role: "Graphic Designer",
    text: "Excellent content and great support. The projects are real-world based which helped me build a strong portfolio.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop"
  },
  {
    id: 5,
    name: "James Wilson",
    role: "Data Scientist",
    text: "One of the best decisions I made for my education. The community is supportive and the resources are top-notch.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
  }
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-change testimonial every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="w-full bg-[#0d2b57] py-20 px-6 relative overflow-hidden">
      {/* Background Pattern (optional) */}
      <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] bg-cover bg-center" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
        
        {/* LEFT IMAGE */}
        <div className="relative">
          {/* Decorative shapes */}
          <div className="absolute -top-4 -left-4 w-10 h-10 bg-red-500 clip-star" />
          <div className="absolute bottom-0 -left-4 w-6 h-6 bg-yellow-400 rotate-45" />
          <div className="absolute top-6 right-[-20px] flex gap-1">
            <span className="w-2 h-6 bg-cyan-400 rounded"></span>
            <span className="w-2 h-4 bg-cyan-400 rounded"></span>
          </div>

          {/* Image with transition */}
          <div className={`w-[260px] h-[320px] rounded-[140px] overflow-hidden bg-white flex items-center justify-center transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            <Image
              src={currentTestimonial.imageUrl}
              alt={currentTestimonial.name}
              width={260}
              height={320}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        {/* RIGHT CONTENT with transition */}
        <div className={`text-white max-w-xl transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What Our Students <br /> Say About Us
          </h2>

          {/* Quote Icon */}
          <div className="text-5xl text-blue-400 leading-none mb-4">“</div>

          {/* Text */}
          <p className="text-gray-300 mb-6 leading-relaxed">
            {currentTestimonial.text}
          </p>

          {/* Line */}
          <div className="w-12 h-[2px] bg-yellow-400 mb-4"></div>

          {/* Author */}
          <h4 className="font-semibold">{currentTestimonial.name}</h4>
          <p className="text-gray-400 text-sm">{currentTestimonial.role}</p>

          {/* Navigation Dots */}
          <div className="flex gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(idx);
                    setIsTransitioning(false);
                  }, 300);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-8 bg-yellow-400"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CSS for clip-star */}
      <style jsx>{`
        .clip-star {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
      `}</style>
    </section>
  );
}