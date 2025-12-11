import React from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

/**
 * Global blockchain sync indicator
 * Shows in NavigationBar when there are pending transactions
 */
const BlockchainSyncIndicator = ({ pendingCount, isSyncing }) => {
  if (!isSyncing || pendingCount === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
      <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
      <span className="text-xs font-medium text-yellow-400">
        {pendingCount} {pendingCount === 1 ? 'transaction' : 'transactions'} syncing
      </span>
    </div>
  );
};

export default BlockchainSyncIndicator;

