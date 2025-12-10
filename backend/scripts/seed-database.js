import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db.js";
import Note from "../models/Note.js";
import { randomUUID, randomBytes } from "crypto";

// Read wallet address from env (useful for dev). If not provided, use a safe test address.
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || "addr1q8fhxws5mfruxqw2jtv0gzxk7cmnx87rnsufru4ruu0323gdy0s9l0swj7w0ljf8v0g8gs8vwp9c5ldxm9regrmr9a8s9j5zgk";

const makeTxHash = () => randomBytes(32).toString("hex");

const sampleNotes = [
	{
		noteId: randomUUID(),
		walletAddress: WALLET_ADDRESS,
		title: "Welcome to Notes (Cardano)",
		content: "This is a seeded note created for testing the Cardano/Lace integration.",
		archived: false,
		pinned: true,
		starred: false,
		tags: ["welcome", "cardano"],
		color: "#fffbcc",
		transactionHistory: [
			{ operation: "CREATE_NOTE", txHash: makeTxHash() }
		],
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		noteId: randomUUID(),
		walletAddress: "addr_test1qpmorewalletaddressxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		title: "Second Note",
		content: "A second seeded note to exercise list and filter features.",
		archived: false,
		pinned: false,
		starred: true,
		tags: ["lists"],
		color: "#e6f7ff",
		transactionHistory: [
			{ operation: "CREATE_NOTE", txHash: makeTxHash() },
			{ operation: "UPDATE_NOTE", txHash: makeTxHash() }
		],
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
		updatedAt: new Date()
	},
	{
		noteId: randomUUID(),
		walletAddress: "addr_test1qpdifferentwalletaddressxxxxxxxxxxxxxxxxxxxxxx",
		title: "Archived Note",
		content: "This note is archived and should be filtered out by default in the UI.",
		archived: true,
		pinned: false,
		starred: false,
		tags: [],
		color: null,
		transactionHistory: [
			{ operation: "CREATE_NOTE", txHash: makeTxHash() },
			{ operation: "DELETE_NOTE", txHash: makeTxHash() }
		],
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
		updatedAt: new Date()
	}
];

async function seed() {
	try {
		await connectDB();

		console.log("Clearing existing notes (if any)...");
		await Note.deleteMany({});

		console.log(`Inserting ${sampleNotes.length} sample notes...`);
		await Note.insertMany(sampleNotes);

		console.log("Database seeding completed.");
		process.exit(0);
	} catch (err) {
		console.error("Seeding failed:", err);
		process.exit(1);
	}
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("seed-database.js")) {
	seed();
}

