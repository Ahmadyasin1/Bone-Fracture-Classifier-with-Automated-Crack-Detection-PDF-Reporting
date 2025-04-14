import React from 'react';
import { AlertCircle, Check, Info, Calendar, Target, Activity } from 'lucide-react';

interface FractureLocation {
  x: number;
  y: number;
  width: number;
  height: number;
  size: number;
}

interface RecoveryEstimation {
  min_weeks: number;
  max_weeks: number;
  notes: string[];
}

interface Report {
  timestamp: string;
  diagnosis: {
    prediction: string;
    confidence: number;
    severity: string;
  };
  fracture_analysis: {
    number_of_fractures: number;
    total_fracture_size: number;
    fracture_locations: FractureLocation[];
  };
  recovery_estimation: RecoveryEstimation;
}

interface ResultsPanelProps {
  prediction: string;
  confidence: number;
  markedImage?: string;
  report?: Report;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  prediction,
  confidence,
  markedImage,
  report
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Analysis Details */}
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-400" />
            Analysis Details
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li>• Advanced AI analysis completed</li>
            <li>• Multiple detection algorithms applied</li>
            <li>• {confidence}% confidence in prediction</li>
            {report && (
              <>
                <li>• Severity: {report.diagnosis.severity}</li>
                <li>• Fractures detected: {report.fracture_analysis.number_of_fractures}</li>
              </>
            )}
          </ul>
        </div>

        {/* Recommendation */}
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            {prediction === 'Fracture' ? (
              <AlertCircle className="w-5 h-5 text-red-400" />
            ) : (
              <Check className="w-5 h-5 text-green-400" />
            )}
            Recommendation
          </h3>
          <p className="text-slate-300">
            {prediction === 'Fracture'
              ? 'Based on the analysis, immediate medical consultation is recommended. The detected fracture requires professional evaluation.'
              : 'No immediate medical attention required based on this analysis, but consult a medical professional if you experience persistent pain or discomfort.'}
          </p>
        </div>
      </div>

      {/* Marked Image Display */}
      {markedImage && (
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            Fracture Detection Visualization
          </h3>
          <div className="relative">
            <img
              src={markedImage}
              alt="Marked fracture areas"
              className="w-full rounded-lg"
            />
            <p className="text-sm text-slate-400 mt-2">
              Green rectangles indicate detected fracture areas
            </p>
          </div>
        </div>
      )}

      {/* Recovery Timeline */}
      {report && report.recovery_estimation && (
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Estimated Recovery Timeline
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Activity className="w-5 h-5 text-amber-400" />
              <span className="text-slate-300">
                Estimated recovery time: {report.recovery_estimation.min_weeks}-
                {report.recovery_estimation.max_weeks} weeks
              </span>
            </div>
            <div className="space-y-2">
              {report.recovery_estimation.notes.map((note, index) => (
                <p key={index} className="text-sm text-slate-400">
                  • {note}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
        <p className="text-sm text-amber-200">
          <strong>Important Medical Disclaimer:</strong> This analysis is provided
          as a preliminary screening tool and should not be considered as a final
          medical diagnosis. Always consult with qualified healthcare
          professionals for proper medical evaluation and treatment. The recovery
          timeline is an estimate and may vary based on individual factors.
        </p>
      </div>
    </div>
  );
};