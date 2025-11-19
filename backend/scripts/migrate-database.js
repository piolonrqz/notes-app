import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db.js";
import Note from "../models/Note.js";
import { randomUUID } from "crypto";

async function migrate() {
	try {
		await connectDB();

		console.log("Ensuring indexes for Note model...");
		// Make sure indexes declared in the schema are created
		await Note.syncIndexes();

		// Add missing noteId values
		const missingNoteId = await Note.find({ noteId: { $exists: false } }).limit(100).lean();
		if (missingNoteId.length) {
			console.log(`Found ${missingNoteId.length} documents without noteId; assigning uuids...`);
			for (const doc of missingNoteId) {
				await Note.updateOne({ _id: doc._id }, { $set: { noteId: randomUUID(), updatedAt: new Date() } });
			}
		} else {
			console.log("No documents without noteId found.");
		}

		// Ensure transaction history entries have timestamps
		const notes = await Note.find({ "transactionHistory.0": { $exists: true } }).limit(200);
		let updatedCount = 0;
		for (const note of notes) {
			let changed = false;
			for (const tx of note.transactionHistory) {
				if (!tx.timestamp) {
					tx.timestamp = note.createdAt || new Date();
					changed = true;
				}
			}
			if (changed) {
				await note.save();
				updatedCount++;
			}
		}
		console.log(`Updated ${updatedCount} notes to add missing transaction timestamps.`);

		console.log("Migration finished.");
		process.exit(0);
	} catch (err) {
		console.error("Migration failed:", err);
		process.exit(1);
	}
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("migrate-database.js")) {
	migrate();
}

