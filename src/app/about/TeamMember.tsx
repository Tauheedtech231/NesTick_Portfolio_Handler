"use client";

import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";

interface TeamMember {
  initials: string;
  name: string;
  title: string;
}

const teamMembers: TeamMember[] = [
  { initials: "TZ", name: "Talha Zaheer", title: "CTO" },
  { initials: "AA", name: "Abdullah Amin", title: "Founder" },
  { initials: "NA", name: "Nimra Ali", title: "Creative Lead" },
  { initials: "MT", name: "Muhammad Tauheed", title: "Senior Developer" },
];

export default function TeamSlider() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // ── Theme detection ──────────────────────────────────────────────────────────
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    checkTheme();

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';

  // ─── Theme Colors ────────────────────────────────────────────────────────────
  const colors = {
    bg: isDark ? '#0B0F19' : '#F4F7FC',
    textPrimary: isDark ? '#FFFFFF' : '#1A2332',
    textSecondary: isDark ? '#9CA3AF' : '#6B7A8F',
    accent: isDark ? '#E8CA5E' : '#0066FF',
    accentLight: isDark ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.08)',
    avatarBg: isDark 
      ? 'linear-gradient(145deg, #1a1a2e 0%, #0B0F19 100%)' 
      : 'linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%)',
    avatarText: isDark ? '#E8CA5E' : '#0066FF',
    avatarBorder: isDark ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
    avatarShadow: isDark 
      ? '0 6px 20px rgba(0,0,0,0.4), inset 0 -3px 12px rgba(0,0,0,0.2)' 
      : '0 8px 30px rgba(0, 102, 255, 0.12), inset 0 -3px 12px rgba(0,0,0,0.03)',
    avatarShine: isDark 
      ? 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 60%)'
      : 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
    roleBg: isDark ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.08)',
    roleText: isDark ? '#E8CA5E' : '#0066FF',
    lineColor: isDark ? '#E8CA5E' : '#0066FF',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
    skewBg: isDark ? '#E8CA5E' : '#0066FF',
    skewShadow: isDark 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)'
      : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)',
    cardBg: isDark ? 'transparent' : '#FFFFFF',
    cardShadow: isDark ? 'none' : '0 4px 24px rgba(0, 0, 0, 0.04)',
    cardBorder: isDark ? 'none' : '1px solid rgba(0, 0, 0, 0.04)',
  };

  return (
    <div 
      className="team-wrapper flex min-h-screen items-center justify-center px-5 -mt-8 font-sans transition-colors duration-300"
      style={{ background: colors.bg }}
    >
      <div className="w-full max-w-[1200px]">
        
        {/* ─── Small Heading ─────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 mx-auto w-fit"
            style={{
              backgroundColor: colors.accentLight,
              border: 'none',
            }}
          >
            <Users className="w-3.5 h-3.5" style={{ color: colors.accent }} />
            <span className="text-xs font-medium tracking-wide" style={{ 
              color: colors.textSecondary,
              fontFamily: "'Poppins', sans-serif",
            }}>
              Our Team
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif tracking-tight" style={{ 
            color: colors.textPrimary,
            fontFamily: "'Poppins', sans-serif",
          }}>
            Meet Our{' '}
            <span className="inline-block" style={{ color: colors.accent }}>
              Leadership
            </span>
          </h2>
        </div>

        {/* ─── Team Grid ────────────────────────────────────────────────────── */}
        <div className="team-grid grid w-full grid-cols-2 md:grid-cols-4 justify-items-center gap-5 md:gap-6">
          {teamMembers.map((member, index) => {
            // MT (Muhammad Tauheed) ke liye -0.5rem, baaki sab ke liye -1rem
            const isMT = member.initials === 'MT';
            const leftPush = isMT ? '-3rem' : '-5rem';
            
            return (
              <div 
                key={member.initials} 
                className="member flex w-full max-w-[250px] flex-col items-center"
                style={{
                  background: colors.cardBg,
                  borderRadius: '24px',
                  padding: '12px',
                  boxShadow: colors.cardShadow,
                  border: colors.cardBorder,
                  transition: 'all 0.3s ease',
                }}
              >
                <div className="shape-wrapper relative h-[160px] w-full overflow-hidden rounded-[32px]">
                  {/* Skew Background */}
                  <div 
                    className="skew-bg absolute top-0 left-1/2 w-[160px] h-[160px] rounded-[32px] transition-colors duration-300"
                    style={{
                      background: colors.skewBg,
                      transform: 'translateX(-50%) skewX(-29.9deg)',
                      transformOrigin: 'center',
                      boxShadow: isDark ? 'none' : '0 8px 24px rgba(0, 102, 255, 0.15)',
                    }}
                  >
                    <div 
                      className="absolute inset-0 rounded-[32px] pointer-events-none"
                      style={{
                        background: colors.skewShadow,
                      }}
                    />
                  </div>
                  
                  {/* Avatar Ring */}
                  <div 
                    className="avatar-ring absolute top-1/2 left-1/2 w-[80px] h-[80px] rounded-full border-2 pointer-events-none -translate-x-1/2 -translate-y-1/2 z-1"
                    style={{ 
                      borderColor: colors.border,
                      background: isDark ? 'transparent' : 'rgba(255,255,255,0.1)',
                      backdropFilter: isDark ? 'none' : 'blur(10px)',
                    }}
                  />
                  
                  {/* Avatar */}
                  <div 
                    className="avatar absolute top-1/2 left-1/2 w-[72px] h-[72px] rounded-full flex items-center justify-center select-none z-2 transition-transform duration-300 hover:scale-108 cursor-pointer"
                    style={{
                      background: colors.avatarBg,
                      border: `3px solid ${colors.avatarBorder}`,
                      boxShadow: colors.avatarShadow,
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: colors.avatarText,
                      letterSpacing: '1px',
                      textShadow: isDark ? '0 1px 3px rgba(232, 202, 94, 0.1)' : '0 1px 3px rgba(0, 102, 255, 0.1)',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Shine effect */}
                    <div 
                      className="absolute -top-[5px] -left-[5px] -right-[5px] -bottom-[5px] rounded-full pointer-events-none z-3"
                      style={{
                        background: colors.avatarShine,
                      }}
                    />
                    {member.initials}
                  </div>
                </div>

                {/* Profile Info - with left push */}
                <div 
                  className="profile-info mt-3 w-full text-center"
                  style={{
                    marginLeft: leftPush,
                  }}
                >
                  <div className="name text-[0.9rem] font-bold tracking-[0.3px] transition-colors duration-300" style={{ 
                    color: colors.textPrimary 
                  }}>
                    {member.name}
                  </div>
                  <div 
                    className="line mx-auto my-[5px] h-[2px] w-[25px] rounded-[4px] opacity-40 transition-colors duration-300"
                    style={{ background: colors.lineColor }}
                  />
                  <div className="title text-[0.6rem] font-medium uppercase tracking-[1.2px] transition-colors duration-300" style={{ 
                    color: colors.textSecondary 
                  }}>
                    <span 
                      className="inline-block rounded-2xl px-[10px] py-[2px] text-[0.5rem] font-semibold transition-colors duration-300"
                      style={{
                        background: colors.roleBg,
                        color: colors.roleText,
                      }}
                    >
                      {member.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .avatar:hover {
          transform: translate(-50%, -50%) scale(1.08) !important;
        }

        @media (max-width: 1024px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 30px !important;
            max-width: 600px !important;
          }
          .member {
            max-width: 260px !important;
            padding: 16px !important;
          }
          .shape-wrapper {
            height: 190px !important;
          }
          .skew-bg {
            width: 190px !important;
            height: 190px !important;
            border-radius: 38px !important;
          }
          .avatar {
            width: 85px !important;
            height: 85px !important;
            font-size: 2rem !important;
          }
          .avatar-ring {
            width: 93px !important;
            height: 93px !important;
          }
          .name {
            font-size: 1.1rem !important;
          }
          .title {
            font-size: 0.7rem !important;
          }
          .title span {
            font-size: 0.6rem !important;
            padding: 2px 14px !important;
          }
        }

        @media (max-width: 500px) {
          .team-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
            max-width: 280px !important;
          }
          .member {
            max-width: 280px !important;
            padding: 16px !important;
          }
          .shape-wrapper {
            height: 200px !important;
          }
          .skew-bg {
            width: 200px !important;
            height: 200px !important;
            border-radius: 40px !important;
          }
          .avatar {
            width: 90px !important;
            height: 90px !important;
            font-size: 2.2rem !important;
          }
          .avatar-ring {
            width: 98px !important;
            height: 98px !important;
          }
          .name {
            font-size: 1.2rem !important;
          }
          .title {
            font-size: 0.75rem !important;
          }
          .title span {
            font-size: 0.65rem !important;
            padding: 2px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}