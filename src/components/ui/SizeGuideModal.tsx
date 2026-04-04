'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler } from 'lucide-react';
import { useState } from 'react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'abayas' | 'dresses' | 'scarves'>('abayas');

  const sizeCharts = {
    abayas: [
      { size: 'S', length: '130', shoulder: '38', chest: '46', sleeve: '58' },
      { size: 'M', length: '135', shoulder: '40', chest: '48', sleeve: '60' },
      { size: 'L', length: '140', shoulder: '42', chest: '50', sleeve: '62' },
      { size: 'XL', length: '145', shoulder: '44', chest: '52', sleeve: '64' },
      { size: 'XXL', length: '150', shoulder: '46', chest: '54', sleeve: '66' },
    ],
    dresses: [
      { size: 'XS', bust: '86', waist: '66', hips: '91', length: '135' },
      { size: 'S', bust: '91', waist: '71', hips: '96', length: '140' },
      { size: 'M', bust: '96', waist: '76', hips: '101', length: '145' },
      { size: 'L', bust: '101', waist: '81', hips: '106', length: '150' },
      { size: 'XL', bust: '106', waist: '86', hips: '111', length: '155' },
    ],
    scarves: [
      { size: 'Standard', width: '70', length: '180' },
      { size: 'Large', width: '90', length: '220' },
      { size: 'Hijab', width: '60', length: '160' },
    ],
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1C1614]/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DF]">
              <div className="flex items-center gap-3">
                <Ruler size={20} className="text-[#C4748C]" />
                <h2 className="text-lg font-serif text-[#1C1614]">Size Guide</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-[#6B6560] hover:text-[#1C1614] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E8E4DF]">
              {(['abayas', 'dresses', 'scarves'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                    activeTab === tab
                      ? 'text-[#C4748C] border-b-2 border-[#C4748C]'
                      : 'text-[#6B6560] hover:text-[#1C1614]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Tips */}
              <div className="bg-[#FAF7F4] p-4 mb-6">
                <h3 className="text-xs font-medium text-[#1C1614] mb-2">How to Measure</h3>
                <ul className="text-[10px] text-[#6B6560] space-y-1">
                  <li>• Use a soft measuring tape</li>
                  <li>• Measure while wearing fitted clothes</li>
                  <li>• For best results, ask someone to help</li>
                  <li>• If between sizes, choose the larger size</li>
                </ul>
              </div>

              {/* Size Chart */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E8E4DF]">
                      {activeTab === 'abayas' && (
                        <>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Size</th>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Length (cm)</th>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Shoulder (cm)</th>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Chest (cm)</th>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Sleeve (cm)</th>
                        </>
                      )}
                      {activeTab === 'dresses' && (
                        <>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Size</th>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Bust (cm)</th>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Waist (cm)</th>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Hips (cm)</th>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Length (cm)</th>
                        </>
                      )}
                      {activeTab === 'scarves' && (
                        <>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Width (cm)</th>
                          <th className="text-left py-3 px-4 font-medium text-[#1C1614]">Length (cm)</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-[#6B6560]">
                    {sizeCharts[activeTab].map((row: any, i) => (
                      <tr key={i} className="border-b border-[#E8E4DF]/50">
                        <td className="py-3 px-4 font-medium text-[#1C1614]">{row.size}</td>
                        {Object.entries(row).filter(([key]) => key !== 'size').map(([_, value], j) => (
                          <td key={j} className="py-3 px-4">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#E8E4DF] bg-[#FAF7F4]">
              <p className="text-[10px] text-[#6B6560] text-center">
                Need help? <a href="#/contact" className="text-[#C4748C] hover:underline">Contact us</a> for personalized sizing assistance.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}