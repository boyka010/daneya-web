'use client';

import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

export default function SizeGuidePage() {
  return (
    <>
      <SEO 
        title="Size Guide | DANEYA Egypt"
        description="Find your perfect fit with our comprehensive size guide. Measure yourself and find the right size for abayas, dresses, and more."
      />
      <div className="min-h-screen bg-[#FAF7F4] pt-20 pb-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1614] mb-4">
              Size Guide
            </h1>
            <p className="text-[#6B6560] font-light">
              Find your perfect fit with our measurement guide
            </p>
          </motion.div>

          {/* Abaya Size Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 border border-[#E8E4DF] mb-8"
          >
            <h2 className="text-lg font-serif text-[#1C1614] mb-6">Abaya Size Chart</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8E4DF]">
                    <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Length (cm)</th>
                    <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Shoulder (cm)</th>
                    <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Chest (cm)</th>
                    <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Sleeve (cm)</th>
                  </tr>
                </thead>
                <tbody className="text-[#6B6560]">
                  {[
                    { size: 'S', length: '130', shoulder: '38', chest: '46', sleeve: '58' },
                    { size: 'M', length: '135', shoulder: '40', chest: '48', sleeve: '60' },
                    { size: 'L', length: '140', shoulder: '42', chest: '50', sleeve: '62' },
                    { size: 'XL', length: '145', shoulder: '44', chest: '52', sleeve: '64' },
                    { size: 'XXL', length: '150', shoulder: '46', chest: '54', sleeve: '66' },
                  ].map((row) => (
                    <tr key={row.size} className="border-b border-[#E8E4DF]">
                      <td className="py-3 px-4 font-medium text-[#1C1614]">{row.size}</td>
                      <td className="py-3 px-4">{row.length}</td>
                      <td className="py-3 px-4">{row.shoulder}</td>
                      <td className="py-3 px-4">{row.chest}</td>
                      <td className="py-3 px-4">{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* How to Measure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 border border-[#E8E4DF] mb-8"
          >
            <h2 className="text-lg font-serif text-[#1C1614] mb-6">How to Measure</h2>
            <div className="space-y-4 text-sm text-[#6B6560]">
              <div>
                <h3 className="font-medium text-[#1C1614] mb-2">Length</h3>
                <p>Measure from shoulder to desired length (ankle, floor, etc.)</p>
              </div>
              <div>
                <h3 className="font-medium text-[#1C1614] mb-2">Shoulder</h3>
                <p>Measure from one shoulder seam to the other across the back</p>
              </div>
              <div>
                <h3 className="font-medium text-[#1C1614] mb-2">Chest</h3>
                <p>Measure around the fullest part of your chest, under armpits</p>
              </div>
              <div>
                <h3 className="font-medium text-[#1C1614] mb-2">Sleeve</h3>
                <p>Measure from shoulder seam to wrist</p>
              </div>
            </div>
          </motion.div>

          {/* Size Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#F5F2EE] p-6 border border-[#E8E4DF]"
          >
            <h2 className="text-lg font-serif text-[#1C1614] mb-4">Size Tips</h2>
            <ul className="space-y-2 text-sm text-[#6B6560]">
              <li>• For a looser fit, choose one size up</li>
              <li>• Our abayas are designed to be flowy</li>
              <li>• If you're between sizes, we recommend the larger size</li>
              <li>• Custom length available upon request</li>
              <li>• Contact us for personalized sizing assistance</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </>
  );
}