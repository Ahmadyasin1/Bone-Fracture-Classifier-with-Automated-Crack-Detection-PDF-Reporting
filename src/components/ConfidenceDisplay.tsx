import React from 'react';

interface ConfidenceDisplayProps {
  confidence: number;
}

export const ConfidenceDisplay: React.FC<ConfidenceDisplayProps> = ({ confidence }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-slate-400">Confidence Level</span>
        <span className="text-sm font-bold text-amber-400">{confidence}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000 ease-out"
          style={{ width: `${confidence}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-slate-400">
        {confidence > 90
          ? 'Very High Confidence'
          : confidence > 80
          ? 'High Confidence'
          : confidence > 70
          ? 'Moderate Confidence'
          : 'Low Confidence'}
      </div>
    </div>
  );
};