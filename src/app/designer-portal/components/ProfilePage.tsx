// components/ProfilePage.tsx
'use client';

import { Edit, User, CreditCard, Shield } from 'lucide-react';

export function ProfilePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif">Profile Settings</h1>
          <p className="text-[#A0A8C0] text-sm mt-1">Manage your account, payment details, and preferences</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6C63FF] text-white rounded-lg text-sm font-medium hover:bg-[#8B84FF] transition-all">
          <Edit className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-5">
          <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-[#6C63FF]/40">
                FA
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-[#6C63FF] flex items-center justify-center border-2 border-[#1E2235]">
                <Edit className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-white">Fatima Al-Rashid</h2>
            <p className="text-[#A0A8C0] text-sm mb-4">@fatima.designs</p>
            <button className="w-full py-2 border border-[#2A2D3E] text-[#A0A8C0] rounded-lg text-sm hover:bg-[#131625] transition-all">Change Photo</button>
            <div className="flex justify-around mt-5 pt-4 border-t border-[#2A2D3E]">
              <div><div className="text-xl font-bold text-white">24</div><div className="text-[10px] text-[#A0A8C0]">Designs</div></div>
              <div><div className="text-xl font-bold text-white">142</div><div className="text-[10px] text-[#A0A8C0]">Sales</div></div>
              <div><div className="text-xl font-bold text-white">4.9★</div><div className="text-[10px] text-[#A0A8C0]">Rating</div></div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['UI/UX', 'Figma', 'Dashboard', 'SaaS', 'Education'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-[#131625] border border-[#2A2D3E] text-[11px] text-[#A0A8C0]">{tag}</span>
              ))}
            </div>
          </div>

          <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              {[
                { label: 'Design approved', desc: 'When admin approves a design', checked: true },
                { label: 'New sale', desc: 'When someone purchases your design', checked: true },
                { label: 'Payment released', desc: 'When payout is sent to your account', checked: true },
                { label: 'Admin feedback', desc: 'When admin leaves review comments', checked: false },
                { label: 'Weekly summary', desc: 'Weekly performance digest email', checked: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#2A2D3E] last:border-0">
                  <div>
                    <p className="text-[12px] font-medium text-white">{item.label}</p>
                    <p className="text-[10px] text-[#A0A8C0]">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#2A2D3E] rounded-full peer peer-checked:bg-[#6C63FF] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-6">
          <div className="border-b border-[#2A2D3E] pb-5 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-[#6C63FF]" />
              <h3 className="font-semibold text-white text-sm">Personal Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Full Name</label><input type="text" value="Fatima Al-Rashid" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
              <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Username</label><input type="text" value="fatima.designs" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
              <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Email Address</label><input type="email" value="fatima@neezamiya.com" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
              <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Phone</label><input type="tel" value="+966 50 123 4567" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
              <div className="col-span-2"><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Bio</label><textarea rows={3} className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm resize-none">UI/UX Designer specializing in educational platforms and SaaS dashboards. 5+ years of experience building intuitive, conversion-focused interfaces for schools and institutions across the GCC.</textarea></div>
              <div className="col-span-2"><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Portfolio Website</label><input type="url" value="https://fatima.design" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
            </div>
          </div>

          <div className="border-b border-[#2A2D3E] pb-5 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-[#6C63FF]" />
              <h3 className="font-semibold text-white text-sm">Payment Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Payment Method</label><select className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm"><option>Bank Transfer (IBAN)</option><option>PayPal</option></select></div>
              <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Bank Name</label><input type="text" value="Riyad Bank" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
              <div className="col-span-2"><label className="block text-[11px] text-[#A0A8C0] mb-1.5">IBAN / Account Number</label><input type="text" value="SA12 3456 7890 1234 5678 90" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
              <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Swift / BIC Code</label><input type="text" value="RIBLSARI" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
              <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Account Holder Name</label><input type="text" value="Fatima Mohammed Al-Rashid" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-[#6C63FF]" />
              <h3 className="font-semibold text-white text-sm">Security</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Current Password</label><input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
              <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">New Password</label><input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
              <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Confirm Password</label><input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
              <div className="flex items-end"><button className="w-full py-2 border border-[#2A2D3E] text-[#A0A8C0] rounded-lg text-sm hover:bg-[#131625] transition-all">Update Password</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}