// components/UploadPage.tsx
'use client';

import { useState } from 'react';
import { Upload, AlertCircle, ImageIcon, CheckCircle, Plus, FileText } from 'lucide-react';

interface UploadPageProps {
  setActivePage: (page: string) => void;
}

export function UploadPage({ setActivePage }: UploadPageProps) {
  const [uploadPrice, setUploadPrice] = useState(89);
  const commission = uploadPrice * 0.15;
  const payout = uploadPrice * 0.85;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif">Upload New Design</h1>
          <p className="text-[#A0A8C0] text-sm mt-1">Fill in all details carefully — incomplete submissions may be rejected</p>
        </div>
        <button className="px-4 py-2 border border-[#2A2D3E] text-[#A0A8C0] rounded-lg text-sm hover:bg-[#1E2235] transition-all">Load Draft</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-white text-sm">Design Information</h3>
              <p className="text-[#A0A8C0] text-[11px]">Basic details about your template</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Design Title <span className="text-red-400">*</span></label>
                <input type="text" placeholder="e.g. School Admin Dashboard Pro v2" className="w-full px-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none focus:border-[#6C63FF] transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Description <span className="text-red-400">*</span></label>
                <textarea rows={3} placeholder="Describe your design: features, target users, tech stack, pages included..." className="w-full px-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none focus:border-[#6C63FF] transition-colors resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Category <span className="text-red-400">*</span></label>
                  <select className="w-full px-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none">
                    <option>Admin Dashboard</option>
                    <option>Student Portal</option>
                    <option>Library System</option>
                    <option>Finance Module</option>
                    <option>HR Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Tags</label>
                  <input type="text" placeholder="school, admin, dashboard…" className="w-full px-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none focus:border-[#6C63FF] transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-white text-sm">Pricing & Commission</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Sale Price <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A8C0] text-sm">$</span>
                  <input type="number" value={uploadPrice} onChange={(e) => setUploadPrice(Number(e.target.value))} className="w-full pl-7 pr-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Commission (15%)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-sm">$</span>
                  <input type="text" value={commission.toFixed(2)} readOnly className="w-full pl-7 pr-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Your Payout</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 text-sm">$</span>
                  <input type="text" value={payout.toFixed(2)} readOnly className="w-full pl-7 pr-3 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm outline-none" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#6C63FF]/10 border border-[#6C63FF]/20">
              <AlertCircle className="w-4 h-4 text-[#6C63FF] flex-shrink-0" />
              <p className="text-[12px] text-[#8B84FF]">Platform commission is fixed at <strong>15%</strong> of the sale price. Your payout is released within 5 business days after each successful sale.</p>
            </div>
          </div>

          <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-white text-sm">Design Files</h3>
              <p className="text-[#A0A8C0] text-[11px]">Upload your design files or provide a link</p>
            </div>
            <div className="border-2 border-dashed border-[#2A2D3E] rounded-xl p-6 text-center hover:border-[#6C63FF] transition-colors cursor-pointer mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-5 h-5 text-[#6C63FF]" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">Drop your design files here</h4>
              <p className="text-[11px] text-[#A0A8C0]">or <span className="text-[#6C63FF]">browse to upload</span></p>
              <p className="text-[10px] text-[#5A6180] mt-2">Figma · Adobe XD · ZIP · Max 100MB</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Or Figma / Drive Link</label>
                <input type="url" placeholder="https://figma.com/file/..." className="w-full px-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Live Preview URL (optional)</label>
                <input type="url" placeholder="https://yourpreview.netlify.app" className="w-full px-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#6C63FF] text-white rounded-lg text-sm font-medium hover:bg-[#8B84FF] transition-all">
                <Upload className="w-4 h-4" />
                Submit for Review
              </button>
              <button className="px-5 py-2.5 border border-[#2A2D3E] text-[#A0A8C0] rounded-lg text-sm hover:bg-[#1E2235] transition-all">Save as Draft</button>
              <button onClick={() => setActivePage('designs')} className="px-5 py-2.5 border border-[#2A2D3E] text-[#A0A8C0] rounded-lg text-sm hover:bg-[#1E2235] transition-all">Cancel</button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-white text-sm">Preview Images</h3>
              <p className="text-[#A0A8C0] text-[11px]">Upload up to 6 screenshots</p>
            </div>
            <div className="border-2 border-dashed border-[#2A2D3E] rounded-xl p-4 text-center hover:border-[#6C63FF] transition-colors cursor-pointer mb-3">
              <ImageIcon className="w-8 h-8 text-[#A0A8C0] mx-auto mb-2" />
              <p className="text-[11px] text-[#A0A8C0]">PNG · JPG · WebP · Max 5MB each</p>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-10 h-10 rounded-lg bg-[#131625] border border-[#2A2D3E] flex items-center justify-center cursor-pointer hover:border-[#6C63FF] transition-colors">
                  {i === 1 ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : i === 5 ? <Plus className="w-4 h-4 text-[#A0A8C0]" /> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wide">Submission Guidelines</h3>
            <div className="space-y-3">
              {[
                'All designs must be fully responsive across desktop, tablet, and mobile',
                'Include at least 3 high-quality preview screenshots (min 1280×800px)',
                'Designs must be original work — no plagiarism or copied UI kits',
                'Provide working Figma link or full source files for review',
                'Reviews typically take 2–3 business days after submission',
              ].map((guideline, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] mt-1.5 flex-shrink-0" />
                  <p className="text-[11px] text-[#A0A8C0] leading-relaxed">{guideline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-[12px] font-semibold text-amber-400">Draft Saved</p>
                <p className="text-[11px] text-[#A0A8C0]">Auto-saved 2 mins ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}