import React from 'react';
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';

/**
 * Multi-stage transaction progress indicator
 * Shows different stages: building, signing, submitting, confirming
 */
const TransactionProgress = ({ stage, txHash, error }) => {
  const stages = [
    { id: 'building', label: 'Building Transaction', icon: Loader2 },
    { id: 'signing', label: 'Signing Transaction', icon: Loader2 },
    { id: 'submitting', label: 'Submitting to Blockchain', icon: Loader2 },
    { id: 'confirming', label: 'Waiting for Confirmation', icon: Clock },
    { id: 'confirmed', label: 'Transaction Confirmed', icon: CheckCircle2 },
    { id: 'failed', label: 'Transaction Failed', icon: XCircle },
  ];

  const currentStageIndex = stages.findIndex(s => s.id === stage);
  const currentStage = stages[currentStageIndex] || stages[0];

  return (
    <div className="w-full p-4 rounded-xl bg-gray-800/50 border border-white/10">
      <div className="space-y-3">
        {/* Current Stage */}
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 ${
            error ? 'text-red-400' :
            stage === 'confirmed' ? 'text-green-400' :
            'text-brand-lighter'
          }`}>
            {error ? (
              <XCircle className="w-5 h-5" />
            ) : stage === 'confirmed' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              error ? 'text-red-400' :
              stage === 'confirmed' ? 'text-green-400' :
              'text-white'
            }`}>
              {error ? 'Transaction Failed' : currentStage.label}
            </p>
            {error && (
              <p className="text-xs text-red-300 mt-1">{error}</p>
            )}
            {txHash && !error && (
              <p className="text-xs text-white/60 mt-1 font-mono">
                TX: {txHash.slice(0, 16)}...{txHash.slice(-8)}
              </p>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        {!error && (
          <div className="space-y-2">
            {stages.slice(0, 4).map((stageItem, index) => {
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const Icon = stageItem.icon;

              return (
                <div
                  key={stageItem.id}
                  className={`flex items-center gap-2 text-xs ${
                    isCompleted
                      ? 'text-green-400'
                      : isCurrent
                      ? 'text-brand-lighter'
                      : 'text-white/40'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-500/20 border border-green-500/50'
                      : isCurrent
                      ? 'bg-brand-light/20 border border-brand-light/50'
                      : 'bg-white/10 border border-white/20'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </div>
                  <span>{stageItem.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionProgress;

