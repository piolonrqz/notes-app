import { Blaze, Core, Maestro, WebWallet } from "@blaze-cardano/sdk";

const BLOCKFROST_PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID;
const METADATA_LABEL = BigInt(process.env.METADATA_LABEL || 42819);

class CardanoTransactionService {
  /**
   * CRITICAL: Format content with 64-byte chunking
   * Cardano metadata has strict 64-byte limit per string
   */
  formatContent(content) {
    if (!content) return Core.Metadatum.newText("");
    
    // If content fits in 64 bytes, return as-is
    if (content.length <= 64) {
      return Core.Metadatum.newText(content);
    }
    
    // Split into 64-byte chunks
    const chunks = content.match(/.{1,64}/g) || [];
    const list = new Core.MetadatumList();
    
    chunks.forEach(chunk => {
      list.add(Core.Metadatum.newText(chunk));
    });
    
    return Core.Metadatum.newList(list);
  }

  /**
   * Build transaction metadata
   */
  buildMetadata(noteData, action) {
    const metadatumMap = new Core.MetadatumMap();

    // Add action (CREATE, UPDATE, DELETE)
    metadatumMap.insert(
      Core.Metadatum.newText("action"),
      Core.Metadatum.newText(action)
    );

    // Add note_id
    metadatumMap.insert(
      Core.Metadatum.newText("note_id"),
      Core.Metadatum.newText(noteData.noteId)
    );

    // Add content fields (skip for DELETE)
    if (action !== "DELETE") {
      metadatumMap.insert(
        Core.Metadatum.newText("title"),
        this.formatContent(noteData.title || "")
      );

      metadatumMap.insert(
        Core.Metadatum.newText("content"),
        this.formatContent(noteData.content || "")
      );
    }

    // Add timestamp
    metadatumMap.insert(
      Core.Metadatum.newText("timestamp"),
      Core.Metadatum.newText(new Date().toISOString())
    );

    // Wrap metadata
    const metadata = new Map();
    const metadatum = Core.Metadatum.newMap(metadatumMap);
    metadata.set(METADATA_LABEL, metadatum);
    
    return new Core.Metadata(metadata);
  }

  /**
   * Send transaction to blockchain
   */
  async sendTransaction(walletApi, noteData, action) {
    try {
      // Initialize Blaze provider
      const provider = new Maestro({
        network: process.env.NETWORK || "preview",
        apiKey: BLOCKFROST_PROJECT_ID,
        turboSubmit: false
      });

      const wallet = new WebWallet(walletApi);
      const blaze = await Blaze.from(provider, wallet);

      // Get wallet address
      const address = await wallet.getChangeAddress();
      const targetAddress = address.toBech32();

      console.log(`📝 Sending ${action} transaction...`);

      // Build transaction (send 1 ADA to self with metadata)
      let tx = blaze
        .newTransaction()
        .payLovelace(
          Core.Address.fromBech32(targetAddress),
          1000000n // 1 ADA
        );

      // Attach metadata
      const metadata = this.buildMetadata(noteData, action);
      tx.setMetadata(metadata);

      // Complete, sign, and submit
      console.log("🔨 Building transaction...");
      const completedTx = await tx.complete();
      
      console.log("✍️ Requesting signature from wallet...");
      const signedTx = await blaze.signTransaction(completedTx);
      
      console.log("📤 Submitting to blockchain...");
      const txId = await blaze.provider.postTransactionToChain(signedTx);

      console.log(`✅ Transaction submitted: ${txId}`);

      return {
        success: true,
        txHash: txId,
        action
      };
    } catch (error) {
      console.error("❌ Transaction failed:", error);
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }

  /**
   * Reconstruct chunked content (for reading from blockchain)
   */
  reconstructContent(data) {
    if (!data) return "";
    if (typeof data === "string") return data;
    if (Array.isArray(data)) return data.join("");
    return "";
  }
}

export default new CardanoTransactionService();