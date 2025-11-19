import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../../config/db.js";
import Note from "../../models/Note.js";

// Note: this test file uses Jest. Install jest as a devDependency and run `npm test` in the backend.

describe('Database integration', () => {
	beforeAll(async () => {
		await connectDB();
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	test('connects and can create a Note', async () => {
		const noteId = `test-note-${Date.now()}`;
		const payload = {
			noteId,
			walletAddress: 'addr_test1qptestwalletxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			title: 'Test Note',
			content: 'Created by automated test',
		};

		const note = new Note(payload);
		await note.save();

		const found = await Note.findOne({ noteId }).lean();
		expect(found).not.toBeNull();
		expect(found.title).toBe(payload.title);

		// cleanup
		await Note.deleteOne({ noteId });
	});
});

