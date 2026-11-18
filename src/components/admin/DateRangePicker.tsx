'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export type DateRange = 'today' | '7d' | '30d' | '90d' | 'custom';

interface DateRangePickerProps {
  value: DateRange;
  customFrom?: string;
  customTo?: string;
  onChange: (range: DateRange, from?: string, to?: string) => void;
}

export default function DateRangePicker({
  value,
  customFrom,
  customTo,
  onChange
}: DateRangePickerProps) {
  const [showCustom, setShowCustom] = useState(value === 'custom');
  const [from, setFrom] = useState(customFrom || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]);
  const [to, setTo] = useState(customTo || new Date().toISOString().split('T')[0]);

  const ranges: { id: DateRange; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: 'custom', label: 'Custom Range' },
  ];

  const handleSelect = (r: DateRange) => {
    if (r === 'custom') {
      setShowCustom(true);
      onChange('custom', from, to);
    } else {
      setShowCustom(false);
      onChange(r);
    }
  };

  const handleApplyCustom = () => {
    onChange('custom', from, to);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs text-xs font-semibold">
        <Calendar className="w-4 h-4 text-purple-900 ml-2 mr-1 shrink-0" />
        {ranges.map(r => (
          <button
            key={r.id}
            onClick={() => handleSelect(r.id)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              value === r.id
                ? 'bg-purple-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="flex items-center gap-2 bg-white border border-purple-200 p-1.5 rounded-xl text-xs shadow-xs">
          <input
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="px-2 py-1 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-700"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
            className="px-2 py-1 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-700"
          />
          <button
            onClick={handleApplyCustom}
            className="px-3 py-1 bg-purple-900 text-white font-bold rounded-lg hover:bg-purple-950 transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
