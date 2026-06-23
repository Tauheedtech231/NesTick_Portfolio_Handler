/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Mail, Phone, Clock, Send, CheckCircle } from 'lucide-react';

interface ContactSectionProps {
  theme: 'light' | 'dark';
}

export default function ContactSection({ theme }: ContactSectionProps) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Get colors based on theme - Same as Testimonial
  const getColors = () => {
    if (theme === 'dark') {
      return {
        bg: '#0B0F19',
        cardBg: '#0B0F19', // Changed to match section bg
        text: '#FFFFFF',
        textSecondary: '#9CA3AF',
        textMuted: '#6B7280',
        border: 'rgba(30, 41, 59, 0.5)',
        accent: '#E8CA5E',
        accentLight: 'rgba(232, 202, 94, 0.15)',
        inputBg: 'rgba(255,255,255,0.05)', // Slightly lighter for input visibility
        placeholder: '#6B7280',
        label: '#9CA3AF',
      };
    } else {
      return {
        bg: '#FFFFFF',
        cardBg: '#FFFFFF', // Changed to match section bg
        text: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        border: 'rgba(0, 0, 0, 0.06)',
        accent: '#0066FF',
        accentLight: 'rgba(0, 102, 255, 0.08)',
        inputBg: 'rgba(0,0,0,0.03)', // Slightly darker for input visibility
        placeholder: '#9CA3AF',
        label: '#6B7280',
      };
    }
  };

  const colors = getColors();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          subject: 'Template Page Inquiry',
          message: contactForm.message
        })
      });
      
      if (response.ok) {
        setContactSuccess(true);
        setContactForm({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setContactSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Contact error:', error);
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <section 
      className="py-12 md:py-16 lg:py-20 px-4 sm:px-6"
      style={{
        backgroundColor: colors.bg,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{
                backgroundColor: colors.accentLight,
              }}
            >
              <Mail className="w-3.5 h-3.5" style={{ color: colors.accent }} />
              <span className="text-xs font-medium" style={{ 
                color: colors.accent,
                fontFamily: "'Poppins', sans-serif",
              }}>
                Contact Us
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-serif tracking-tight"
              style={{ 
                color: colors.text,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Have Questions?
              <br />
              <span style={{ color: colors.accent }}>
                We're Here to Help
              </span>
            </h2>
            
            <p className="mb-6 leading-relaxed"
              style={{ 
                color: colors.textSecondary,
                fontFamily: "'Calibri Light', sans-serif",
              }}
            >
              Whether you're looking for a custom template, need assistance with your existing portfolio, or want to discuss your requirements, our team is ready to assist you.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" style={{ color: colors.accent }} />
                <span style={{ 
                  color: colors.textSecondary,
                  fontFamily: "'Calibri Light', sans-serif",
                }}>
                  support@nesticktech.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" style={{ color: colors.accent }} />
                <span style={{ 
                  color: colors.textSecondary,
                  fontFamily: "'Calibri Light', sans-serif",
                }}>
                  +92 319 3236529
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: colors.accent }} />
                <span style={{ 
                  color: colors.textSecondary,
                  fontFamily: "'Calibri Light', sans-serif",
                }}>
                  Mon-Fri, 9AM - 6PM PKT
                </span>
              </div>
            </div>
          </div>

          {/* Right - Contact Form - No card, flat design */}
          <div className="rounded-2xl p-6 md:p-8"
            style={{
              backgroundColor: colors.cardBg, // Same as section bg
              // Removed border for flat feel
            }}
          >
            {contactSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accentLight }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: colors.accent }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ 
                  color: colors.text,
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  Message Sent!
                </h3>
                <p style={{ 
                  color: colors.textSecondary,
                  fontFamily: "'Calibri Light', sans-serif",
                }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ 
                    color: colors.label,
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      borderWidth: '1px',
                      color: colors.text,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ 
                      color: colors.label,
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.inputBg,
                        borderColor: colors.border,
                        borderWidth: '1px',
                        color: colors.text,
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ 
                      color: colors.label,
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.inputBg,
                        borderColor: colors.border,
                        borderWidth: '1px',
                        color: colors.text,
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ 
                    color: colors.label,
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      borderWidth: '1px',
                      color: colors.text,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                    placeholder="Tell us about your requirements..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{
                    backgroundColor: colors.accent,
                    color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {contactSubmitting ? 'Sending...' : 'Send Message'}
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}