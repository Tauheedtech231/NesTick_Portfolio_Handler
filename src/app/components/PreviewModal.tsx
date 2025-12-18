'use client';

import React, { useEffect } from 'react';
import { CollegeData } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { FiX, FiExternalLink, FiMapPin, FiCalendar, FiClock, FiUsers, FiAward, FiMail, FiPhone, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiBook, FiStar, FiGlobe } from 'react-icons/fi';

import { gsap } from 'gsap';
import Image from 'next/image';

interface PreviewPaneProps {
  isOpen: boolean;
  onClose: () => void;
  data: CollegeData;
}

export function PreviewPane({ isOpen, onClose, data }: PreviewPaneProps) {
  const paneRef = React.useRef<HTMLDivElement>(null);

  // Direct data access from the provided structure
  const college = data.college || {};
  const faculty = data.faculty || [];
  const courses = data.courses || [];
  const events = data.events || [];
  const gallery = data.gallery || [];

  useEffect(() => {
    if (isOpen && paneRef.current) {
      gsap.fromTo(
        paneRef.current,
        { x: '100%', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Pane */}
      <div
        ref={paneRef}
        className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              {college.logo ? (
                <div className="w-10 h-10 relative rounded-lg overflow-hidden">
                  <Image
                    src={college.logo}
                    alt={`${college.name} logo`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {college.name?.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl">
                  {college.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Portfolio Previewsmnc m
                </p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={onClose}
              size="sm"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Enhanced Hero Section */}
          <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-purple-900/20"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute top-20 right-20 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse delay-75"></div>
            <div className="absolute bottom-20 left-20 w-16 h-16 bg-pink-200 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse delay-150"></div>

            <div className="relative max-w-6xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Side - Content */}
                <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
                  {/* Badge */}
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm">
                    <FiStar className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Premier Technology Institute
                    </span>
                  </div>

                  {/* Main Heading */}
                  <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                      Welcome to{' '}
                      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {college.name}
                      </span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                      {college.shortDescription}
                    </p>
                    <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                      {college.longDescription}
                    </p>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-3 gap-4 py-6">
                    <div className="text-center lg:text-left">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {faculty.length}+
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Expert Faculty</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                        {courses.length}+
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Programs</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                        {events.length}+
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Events</div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
                    >
                      Explore Programs
                      <FiExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
                    >
                      Contact Us
                    </Button>
                  </div>

                  {/* Quick Features */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                    <div className="flex flex-col items-center lg:items-start space-y-2">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                        <FiAward className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center lg:text-left">Accredited</span>
                    </div>
                    <div className="flex flex-col items-center lg:items-start space-y-2">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                        <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center lg:text-left">Expert Faculty</span>
                    </div>
                    <div className="flex flex-col items-center lg:items-start space-y-2">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                        <FiBook className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center lg:text-left">Modern Labs</span>
                    </div>
                    <div className="flex flex-col items-center lg:items-start space-y-2">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
                        <FiGlobe className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center lg:text-left">Global Reach</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Enhanced Image */}
                <div className="relative order-first lg:order-last">
                  <div className="relative">
                    {college.coverImage ? (
                      <div className="relative h-64 sm:h-80 lg:h-96 xl:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                          src={college.coverImage}
                          alt={college.name}
                          fill
                          className="object-cover"
                          priority
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        
                        {/* Floating Elements */}
                        <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-2xl rotate-12 opacity-20 animate-float"></div>
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-400 rounded-2xl -rotate-12 opacity-20 animate-float delay-75"></div>
                      </div>
                    ) : (
                      <div className="relative h-64 sm:h-80 lg:h-96 xl:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center">
                        <div className="text-center text-white p-6 z-10">
                          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <FiBook className="w-10 h-10" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">{college.name}</h3>
                          <p className="text-blue-100">Institute of Advanced Technology</p>
                        </div>
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>
                    )}
                    
                    {/* Stats Card Overlay */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 min-w-[200px] border border-gray-100 dark:border-gray-700">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {new Date().getFullYear() - 1990}+
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Years of Excellence</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision Section */}
          <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white dark:bg-gray-800">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <FiAward className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Our Mission
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {college.mission}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-100 dark:border-purple-800/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <FiUsers className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Our Vision
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {college.vision}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Faculty Section */}
          {faculty.length > 0 && (
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Distinguished Faculty
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
                    Meet our team of expert educators and researchers
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {faculty.map((f) => (
                    <div
                      key={f.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-2"
                    >
                      <div className="relative mb-4">
                        {f.image ? (
                          <div className="relative w-20 h-20 mx-auto">
                            <Image
                              src={f.image}
                              alt={f.name}
                              fill
                              className="rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                              sizes="80px"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {f.name?.split(' ').map((n) => n[0]).join('')}
                          </div>
                        )}
                        <div className="absolute bottom-0 right-1/4 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                        {f.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-2">
                        {f.position}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 font-medium">
                        {f.department}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                        {f.bio}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Courses Section */}
          {courses.length > 0 && (
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white dark:bg-gray-800">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Academic Programs
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
                    Explore our comprehensive range of technology programs
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {courses.map((c, index) => (
                    <div
                      key={c.id}
                      className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 group"
                    >
                      <div className="flex items-start mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {c.name}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            {c.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full flex items-center">
                          <FiClock className="w-3 h-3 mr-1" />
                          {c.duration}
                        </span>
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full flex items-center">
                          <FiAward className="w-3 h-3 mr-1" />
                          {c.credits} Credits
                        </span>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full flex items-center">
                          <FiBook className="w-3 h-3 mr-1" />
                          {c.department}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Events Section */}
          {events.length > 0 && (
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Upcoming Events
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>
                
                <div className="space-y-6">
                  {events.map((e) => (
                    <div
                      key={e.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {e.title}
                          </h3>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3 flex-wrap gap-2">
                            <span className="flex items-center text-sm">
                              <FiCalendar className="w-4 h-4 mr-1" />
                              {new Date(e.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center text-sm">
                              <FiMapPin className="w-4 h-4 mr-1" />
                              {e.location}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {e.description}
                          </p>
                        </div>
                        {e.image && (
                          <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={e.image}
                              alt={e.title}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Gallery Section */}
          {gallery.filter(g => g.image).length > 0 && (
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white dark:bg-gray-800">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Campus Gallery
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.filter(g => g.image).map((g) => (
                    <div
                      key={g.id}
                      className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={g.image}
                          alt={g.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                          {g.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {g.description}
                        </p>
                        {g.date && (
                          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                            {new Date(g.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Contact Section */}
          {college.contact && (
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get In Touch</h2>
                  <p className="text-blue-100 text-lg">
                    Ready to join the Institute of Advanced Technology?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <FiMapPin className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-blue-100 text-sm">
                      {college.contact.address}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <FiPhone className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-blue-100 text-sm">
                      {college.contact.phone}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <FiMail className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-blue-100 text-sm break-all">
                      {college.contact.email}
                    </p>
                  </div>
                </div>

                {/* Social Media Links */}
                {college.contact.socialMedia && (
                  <div className="text-center border-t border-blue-500 pt-8">
                    <h3 className="font-semibold mb-4">Follow Us</h3>
                    <div className="flex justify-center space-x-4">
                      {college.contact.socialMedia.facebook && (
                        <a 
                          href={college.contact.socialMedia.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                        >
                          <FiFacebook className="w-5 h-5" />
                        </a>
                      )}
                      {college.contact.socialMedia.twitter && (
                        <a 
                          href={college.contact.socialMedia.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                        >
                          <FiTwitter className="w-5 h-5" />
                        </a>
                      )}
                      {college.contact.socialMedia.instagram && (
                        <a 
                          href={college.contact.socialMedia.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                        >
                          <FiInstagram className="w-5 h-5" />
                        </a>
                      )}
                      {college.contact.socialMedia.linkedin && (
                        <a 
                          href={college.contact.socialMedia.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                        >
                          <FiLinkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Live preview updates instantly with your edits
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FiExternalLink className="w-4 h-4 mr-2" />
              View Live Site
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}