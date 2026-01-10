'use client';



interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface OtherSectionsProps {
  featuresRef: React.RefObject<HTMLDivElement | null>;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  contactRef: React.RefObject<HTMLDivElement | null>;
  contactFormData: ContactFormData;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  handleContactInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleContactSubmit: (e: React.FormEvent) => Promise<void>;
  scrollToSection: (sectionId: string) => void;
  addToRefs: (
    el: HTMLDivElement | null,
    refArray: React.MutableRefObject<HTMLDivElement[]>
  ) => void;
  featureCardsRef: React.MutableRefObject<HTMLDivElement[]>;
  formElementsRef: React.MutableRefObject<HTMLDivElement[]>;
  isDarkMode: boolean;
}




export default function OtherSections({
  
  featuresRef,
  aboutRef,
  contactRef,
  contactFormData,
  isSubmitting,
  submitStatus,
  handleContactInputChange,
  handleContactSubmit,
  scrollToSection,
  addToRefs,
  featureCardsRef,
  formElementsRef,
  isDarkMode
}: OtherSectionsProps) {
  return (
    <>
      {/* Features Section */}
     <section
  id="features"
  ref={featuresRef}
  className="py-20 md:py-28 px-4 sm:px-6 bg-white dark:bg-black relative overflow-hidden transition-colors duration-500"
>
  <div className="container mx-auto max-w-6xl">
    <div className="text-center mb-16 md:mb-20">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Comprehensive <span className="text-gray-900 dark:text-white">System Features</span>
      </h2>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        A complete solution for managing educational portfolios with multi-level architecture
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {[
        {
          title: "Ready-Made Portfolio Templates",
          description: "Professional templates for colleges with standard sections: Home, About, Services, Faculty, Gallery, Contact. Easily customizable for any educational institute.",
          icon: "🎨",
          color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        },
        {
          title: "Multi-Portal Architecture",
          description: "Three-tier system: Generic Portal for previews, Main Admin Portal for centralized control, and College Admin Portal for individual institution management.",
          icon: "🏛️",
          color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        },
        {
          title: "Centralized Management",
          description: "Add/edit/delete colleges, approve template requests, upload new templates, and manage sections per college from a single dashboard.",
          icon: "🎛️",
          color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        },
        {
          title: "Real-Time Content Updates",
          description: "Changes made by college admins reflect instantly on live websites with live synchronization to the centralized database.",
          icon: "⚡",
          color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
        },
        {
          title: "Role-Based Access Control",
          description: "Three-tier access: Generic users view templates, College admins manage their content, Main admin has full system control.",
          icon: "👥",
          color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        },
        {
          title: "Scalable Infrastructure",
          description: "Built to support multiple institutions simultaneously with independent workspaces and robust data management tools.",
          icon: "📊",
          color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
        }
      ].map((feature, index) => (
        <div
          key={feature.title}
          ref={(el) => addToRefs(el, featureCardsRef)}
          className="group bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl 
                     border border-gray-100 dark:border-gray-700 transition-all duration-500 
                     ease-in-out transform hover:-translate-y-2 relative overflow-hidden flex flex-col h-full"
        >
          <div className="relative z-10 flex flex-col flex-grow">
            <div className="flex items-start mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-4 flex-shrink-0 ${feature.color}`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white pt-1">
                {feature.title}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base mt-2 line-clamp-4">
              {feature.description}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span>Active Feature</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gray-900/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      ))}
    </div>

    {/* Architecture Overview Section */}
    <div className="mt-20 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Three-Tier Portal Architecture
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Our system is built on a robust multi-portal architecture designed for maximum efficiency and security
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          {
            title: "Generic Portal",
            description: "Public-facing portal for previewing templates and submitting requests. No login required for basic access.",
            features: ["Template Preview", "Request Submission", "Public Access"],
            color: "border-blue-200 dark:border-blue-700"
          },
          {
            title: "Main Admin Portal",
            description: "Central control center for system administrators to manage all colleges and system-wide settings.",
            features: ["College Management", "Template Approval", "System Analytics", "Global Settings"],
            color: "border-purple-200 dark:border-purple-700"
          },
          {
            title: "College Admin Portal",
            description: "Secure portal for individual colleges to manage their content, portfolios, and student data.",
            features: ["Content Management", "Student Portfolios", "College Settings", "Local Analytics"],
            color: "border-green-200 dark:border-green-700"
          }
        ].map((portal) => (
          <div
            key={portal.title}
            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 ${portal.color} transition-all duration-300 hover:scale-105`}
          >
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {portal.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {portal.description}
            </p>
            <div className="space-y-2">
              {portal.features.map((feature, idx) => (
                <div key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

{/* About Section - Updated */}
<section
  id="about"
  ref={aboutRef}
  className="py-20 md:py-28 px-4 sm:px-6 bg-white dark:bg-black relative overflow-hidden transition-colors duration-500"
>
  <div className="absolute top-0 left-0 right-0 transform -translate-y-1">
    <svg viewBox="0 0 1440 120" className="w-full h-12 md:h-16">
      <path
        fill={isDarkMode ? "#000000" : "#ffffff"}
        fillOpacity="1"
        d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
      ></path>
    </svg>
  </div>

  <div className="container mx-auto max-w-6xl relative z-10">
    <div className="text-center mb-12 md:mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
        Streamlined Portfolio Management System
      </h2>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
        The College Portfolio Handler System centralizes digital portfolios for educational institutions, 
        providing a comprehensive platform to create, manage, and showcase student achievements professionally 
        across multiple colleges and departments.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          How It Works
        </h3>
        <div className="space-y-6">
          {[
            {
              step: "01",
              title: "Template Selection",
              description: "Colleges browse and select from professional portfolio templates tailored for education"
            },
            {
              step: "02",
              title: "Centralized Approval",
              description: "Main admin reviews and approves template requests with customization options"
            },
            {
              step: "03",
              title: "Content Management",
              description: "College admins manage their content through a secure, dedicated portal"
            },
            {
              step: "04",
              title: "Live Publication",
              description: "Real-time updates ensure instant publication of portfolio content"
            }
          ].map((step) => (
            <div key={step.step} className="flex items-start group">
              <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-white dark:text-gray-900 font-bold text-lg">
                  {step.step}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {step.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          System Impact & Reach
        </h3>
        <div className="space-y-6">
          {[
            { 
              label: "Institutions Supported", 
              value: "500+", 
              description: "Colleges and educational institutes",
              icon: "🏫"
            },
            { 
              label: "Active Portfolios", 
              value: "50K+", 
              description: "Student portfolios managed",
              icon: "📁"
            },
            { 
              label: "System Uptime", 
              value: "99.9%", 
              description: "Reliable service availability",
              icon: "⚡"
            },
            { 
              label: "Admin Satisfaction", 
              value: "98%", 
              description: "Positive feedback rate",
              icon: "⭐"
            }
          ].map((stat) => (
            <div key={stat.label} className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl group hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl mr-4">
                {stat.icon}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Contact Section */}
      <section
        id="contact"
        ref={contactRef}
        className="py-20 md:py-28 px-4 sm:px-6 bg-white dark:bg-black transition-colors duration-500"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get In <span className="text-gray-900 dark:text-white">Touch</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Reach out to us for any inquiries about our portfolio management system. 
                  We are here to help you streamline your institutions portfolio process.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    iconBg: "bg-gray-900 dark:bg-white",
                    iconColor: "text-white dark:text-gray-900",
                    label: "Phone",
                    value: "+92 319 3236529",
                    svg: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    )
                  },
                  {
                    iconBg: "bg-gray-900 dark:bg-white",
                    iconColor: "text-white dark:text-gray-900",
                    label: "Email",
                    value: "support@portfoliohandler.com",
                    svg: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    )
                  },
                  {
                    iconBg: "bg-gray-900 dark:bg-white",
                    iconColor: "text-white dark:text-gray-900",
                    label: "Website",
                    value: "https://nesticktech.com",
                    svg: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3C7.031 3 3 7.031 3 12s4.031 9 9 9 9-4.031 9-9-4.031-9-9-9zM2 12h20M12 2a10 10 0 010 20M12 2v20" />
                    ),
                    href: "https://nesticktech.com"
                  },
                  {
                    iconBg: "bg-gray-900 dark:bg-white",
                    iconColor: "text-white dark:text-gray-900",
                    label: "Office Hours",
                    value: "Mon - Fri | 9:00 AM - 6:00 PM",
                    svg: (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </>
                    )
                  }
                ].map((item) => (
                  <div key={item.label} className="flex items-center space-x-4">
                    <div className={`${item.iconBg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                      <svg className={`w-6 h-6 ${item.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.svg}
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-600 dark:text-gray-300">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-500">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white mb-2"
                  >
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
                    className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  />
                </div>

                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white mb-2"
                  >
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
                    className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  />
                </div>

                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={contactFormData.subject}
                    onChange={handleContactInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactFormData.message}
                    onChange={handleContactInputChange}
                    required
                    rows={5}
                    placeholder="Tell us about your inquiry..."
                    className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 resize-none"
                  />
                </div>

                <div ref={el => addToRefs(el, formElementsRef)}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-500 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-900/20 border border-green-800 rounded-xl">
                    <p className="text-green-200 text-center">
                      ✅ Thank you for your message! We will get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl">
                    <p className="text-red-200 text-center">
                      ❌ There was an error sending your message. Please try again.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gray-700 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gray-600 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="col-span-2 md:col-span-1 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-2xl font-bold bg-white bg-clip-text text-transparent">
                  Portfolio Handler
                </span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Simplifying college portfolio management with cutting-edge technology and elegant design.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
              <div className="space-y-4">
                {['Features', 'Templates', 'About', 'Contact'].map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollToSection(link.toLowerCase())}
                    className="block text-gray-400 hover:text-white transition-colors duration-300 text-left w-full"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Contact</h3>
              <div className="space-y-3 text-gray-400">
                <p>support@portfoliohandler.com</p>
                <p>+92 319 3236529</p>
                <p>Mon - Fri | 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-gray-400 text-center md:text-left">
              © 2026 College Portfolio Handler System. All rights reserved.
            </div>

            <div className="flex space-x-4">
              {[
                { href: "https://x.com/nesticktech", label: "X" },
                { href: "https://web.facebook.com/people/Nestick-Tech/61567617353923/", label: "f" },
                { href: "https://www.instagram.com/nesticktech/", label: "I" },
                { href: "https://www.linkedin.com/in/abdullah-amin005", label: "in" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
                >
                  <span className="text-sm font-semibold">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}