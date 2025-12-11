import React from 'react';
import { ShieldCheck, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

const BlockchainStatus = ({ status, txHash }) => {
  // 1. Define the Explorer URL for Preview Network
  const explorerUrl = txHash 
    ? `https://preview.cardanoscan.io/transaction/${txHash}` 
    : '#';

  // 2. Render based on status
  if (status === 'confirmed') {
    return (
      <div className="flex items-center gap-3">
        {/* Verified Badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-400 rounded-md border border-green-500/20" title="Verified on Blockchain">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-xs font-medium font-mono">On-Chain</span>
        </div>

        {/* View on Explorer Link */}
        {txHash && (
          <a 
            href={explorerUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-light transition-colors group"
            title="View Transaction"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
          </a>
        )}
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-md border border-yellow-500/20">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span className="text-xs font-medium font-mono">Confirming...</span>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 text-red-400 rounded-md border border-red-500/20">
        <AlertCircle className="w-3.5 h-3.5" />
        <span className="text-xs font-medium font-mono">Failed</span>
      </div>
    );
  }

  return null;
};

export default BlockchainStatus;