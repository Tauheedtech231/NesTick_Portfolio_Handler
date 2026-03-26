// app/contact/page.tsx
'use client';

import { useRef, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  XCircle,
  MessageCircle,
  Sparkles
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const sectionRef = useRef<HTMLElement>(null);
  const formElementsRef = useRef<HTMLDivElement[]>([]);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const addToRefs = (el: HTMLDivElement | null, refArray: React.MutableRefObject<HTMLDivElement[]>) => {
    if (el && !refArray.current.includes(el)) {
      refArray.current.push(el);
    }
  };

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactFormData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setContactFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants - Bottom to top on first render
  const fromBottomVariants:Variants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 12,
        duration: 0.7,
      },
    },
  };

  const fadeInLeftVariants:Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  const fadeInRightVariants:Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  const contactInfo = [
    { 
      icon: Phone, 
      label: "Phone", 
      value: "+92 319 3236529", 
      href: "tel:+923193236529",
      description: "Available Mon-Fri, 9AM-6PM"
    },
    { 
      icon: Mail, 
      label: "Email", 
      value: "support@portfoliohandler.com", 
      href: "mailto:support@portfoliohandler.com",
      description: "We reply within 24 hours"
    },
    { 
      icon: MapPin, 
      label: "Office", 
      value: "Pakistan", 
      href: null,
      description: "Serving globally from Pakistan"
    },
    { 
      icon: Clock, 
      label: "Business Hours", 
      value: "Monday - Friday", 
      href: null,
      description: "9:00 AM - 6:00 PM (PKT)"
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen mt-[3rem] bg-[#0B0F19]">
        {/* Hero Section - No video, just gradient background */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#0B0F19]">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1D4ED8]/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fromBottomVariants}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="text-xs font-medium text-gray-300">Contact Us</span>
              </div>

              {/* Heading - Smaller font */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Let&apos;s{' '}
                <span className="bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] bg-clip-text text-transparent">
                  Connect
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
                Have questions about Portfolio Handler? We&apos;re here to help. Reach out to us and we&apos;ll get back to you within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={sectionRef} className="py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F19]">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
              {/* Contact Information - Single Card */}
              <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={fadeInLeftVariants}
                className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 md:p-7 hover:border-[#38BDF8]/30 transition-all duration-300"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-3">
                  <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span className="text-xs font-medium text-gray-300">Get in Touch</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                  We&apos;d Love to Hear From You
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Whether you have a question about our platform, need support, or want to discuss partnership opportunities, our team is ready to assist you.
                </p>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="bg-[#0B0F19] border border-[#1E293B] rounded-lg p-3 hover:border-[#38BDF8]/30 transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#1D4ED8]/20 to-[#38BDF8]/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4 text-[#38BDF8]" />
                        </div>
                        <h3 className="text-xs font-medium text-gray-400 mb-0.5">{item.label}</h3>
                        {item.href ? (
                          <a href={item.href} className="text-white text-sm font-semibold hover:text-[#38BDF8] transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-white text-sm font-semibold">{item.value}</p>
                        )}
                        <p className="text-[10px] text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    );
                  })}
                </div>

                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/923193236529?text=Hello%2C%20I%20want%20to%20discuss%20my%20project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-sm hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/20 w-full justify-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={fadeInRightVariants}
                className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 md:p-7"
              >
                <h3 className="text-lg font-bold text-white mb-5">Send us a Message</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div ref={el => addToRefs(el, formElementsRef)}>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactFormData.name}
                      onChange={handleContactInputChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] transition-colors"
                    />
                  </div>

                  <div ref={el => addToRefs(el, formElementsRef)}>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactFormData.email}
                      onChange={handleContactInputChange}
                      required
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] transition-colors"
                    />
                  </div>

                  <div ref={el => addToRefs(el, formElementsRef)}>
                    <label htmlFor="subject" className="block text-xs font-medium text-gray-300 mb-1.5">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={contactFormData.subject}
                      onChange={handleContactInputChange}
                      required
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#38BDF8] transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership">Partnership Opportunity</option>
                      <option value="Demo Request">Demo Request</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div ref={el => addToRefs(el, formElementsRef)}>
                    <label htmlFor="message" className="block text-xs font-medium text-gray-300 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactFormData.message}
                      onChange={handleContactInputChange}
                      required
                      rows={4}
                      placeholder="Tell us about your inquiry..."
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#1D4ED8]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="p-2.5 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <p className="text-green-400 text-xs">Thank you! We&apos;ll get back to you soon.</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <p className="text-red-400 text-xs">Failed to send. Please try again.</p>
                    </div>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Google Map Section */}
        <section className="py-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden"
            >
              <div className="h-[350px] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115828.5561118775!2d66.98999742167967!3d24.893578624551843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb3150f7c8c2a1b%3A0x2b3f2e5c8f8c2a1b!2sKarachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                  title="Nestick Tech Location Map"
                />
              </div>
              <div className="p-3 text-center border-t border-[#1E293B]">
                <p className="text-gray-400 text-xs flex items-center justify-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#38BDF8]" />
                  Serving educational institutions globally from Pakistan
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}