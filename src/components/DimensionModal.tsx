import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import { submitJeux } from '../api/jeux';
import type { TeamCriteriaSubmission } from '../types';

interface DimensionModalProps {
  dimensionId: number;
  dimensionName: string;
  submission: TeamCriteriaSubmission | null;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitted: boolean;
}

export const DimensionModal: React.FC<DimensionModalProps> = ({
  dimensionId,
  dimensionName,
  submission,
  onClose,
  onSubmit,
  isSubmitted,
}) => {
  const handleVerify = async () => {
    if (isSubmitted) return;
    
    try {
      const criteriaValues = submission?.criteria_data 
        ? Object.values(submission.criteria_data)
        : [];

      await submitJeux({
        dimension_id: dimensionId,
        atelier: criteriaValues,
        bbox: [],
      });
      
      onSubmit();
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert('Failed to verify submission. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{dimensionName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Atelier Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Atelier</h3>
            {submission?.criteria_data ? (
              <div className="space-y-2">
                {Object.values(submission.criteria_data).map((value, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    {value}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No criteria data available</p>
            )}
          </div>

          {/* Black Box Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Black Box</h3>
            <p className="text-gray-500">
              No AI Processing is required for this dimension.
            </p>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={handleVerify}
            disabled={isSubmitted}
            className={`
              px-4 py-2 rounded-lg flex items-center space-x-2
              ${isSubmitted 
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isSubmitted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Verified</span>
              </>
            ) : (
              <span>Verify</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};