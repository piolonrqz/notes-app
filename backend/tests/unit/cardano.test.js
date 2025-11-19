// tests/unit/cardano.test.js

import { describe, it, expect } from '@jest/globals';
import {
    createNoteMetadata,
    isValidTxHash,
    getMinimumAda,
    formatOperation,
    parseTxResponse,
    createTxPayload
} from '../../utils/cardano.js';

describe('Cardano Utils', () => {
    describe('createNoteMetadata', () => {
        it('should create valid metadata for CREATE operation', () => {
            const noteData = {
                noteId: 'note123',
                title: 'Test Note',
                content: 'Test content'
            };

            const metadata = createNoteMetadata('CREATE', noteData);

            expect(metadata).toHaveProperty('674');
            expect(metadata[674]).toHaveProperty('msg');
            expect(metadata[674].msg).toBeInstanceOf(Array);
            expect(metadata[674].msg[0]).toBe('Notes App - CREATE');
            expect(metadata[674].msg[1]).toBe('NoteID: note123');
            expect(metadata[674].msg[2]).toBe('Title: Test Note');
        });

        it('should truncate long titles to 50 characters', () => {
            const longTitle = 'A'.repeat(100);
            const noteData = {
                noteId: 'note123',
                title: longTitle,
                content: 'Test content'
            };

            const metadata = createNoteMetadata('CREATE', noteData);
            const titleLine = metadata[674].msg[2];

            expect(titleLine.length).toBeLessThanOrEqual(58); // "Title: " + 50 chars
            expect(titleLine).toBe(`Title: ${longTitle.substring(0, 50)}`);
        });

        it('should handle undefined title', () => {
            const noteData = {
                noteId: 'note123',
                content: 'Test content'
            };

            const metadata = createNoteMetadata('CREATE', noteData);

            expect(metadata[674].msg[2]).toBe('Title: Untitled');
        });

        it('should include timestamp in metadata', () => {
            const noteData = {
                noteId: 'note123',
                title: 'Test Note'
            };

            const metadata = createNoteMetadata('CREATE', noteData);
            const timestampLine = metadata[674].msg[3];

            expect(timestampLine).toMatch(/^Timestamp: \d{4}-\d{2}-\d{2}T/);
        });
    });

    describe('isValidTxHash', () => {
        it('should return true for valid transaction hash', () => {
            const validHash = 'a'.repeat(64);
            expect(isValidTxHash(validHash)).toBe(true);
        });

        it('should return true for valid hash with mixed case', () => {
            const validHash = 'A1b2C3d4'.repeat(8); // 64 chars
            expect(isValidTxHash(validHash)).toBe(true);
        });

        it('should return false for hash with wrong length', () => {
            expect(isValidTxHash('abc123')).toBe(false);
            expect(isValidTxHash('a'.repeat(63))).toBe(false);
            expect(isValidTxHash('a'.repeat(65))).toBe(false);
        });

        it('should return false for hash with invalid characters', () => {
            const invalidHash = 'g'.repeat(64); // 'g' is not a hex character
            expect(isValidTxHash(invalidHash)).toBe(false);
        });

        it('should return false for non-string input', () => {
            expect(isValidTxHash(null)).toBe(false);
            expect(isValidTxHash(undefined)).toBe(false);
            expect(isValidTxHash(123)).toBe(false);
        });
    });

    describe('getMinimumAda', () => {
        it('should return 1 ADA in lovelace', () => {
            expect(getMinimumAda()).toBe('1000000');
        });

        it('should return a string', () => {
            expect(typeof getMinimumAda()).toBe('string');
        });
    });

    describe('formatOperation', () => {
        it('should format create operation', () => {
            expect(formatOperation('create')).toBe('CREATE_NOTE');
        });

        it('should format update operation', () => {
            expect(formatOperation('update')).toBe('UPDATE_NOTE');
        });

        it('should format delete operation', () => {
            expect(formatOperation('delete')).toBe('DELETE_NOTE');
        });

        it('should handle uppercase input', () => {
            expect(formatOperation('CREATE')).toBe('CREATE_NOTE');
            expect(formatOperation('UPDATE')).toBe('UPDATE_NOTE');
        });

        it('should handle mixed case input', () => {
            expect(formatOperation('CrEaTe')).toBe('CREATE_NOTE');
        });

        it('should uppercase unknown operations', () => {
            expect(formatOperation('custom')).toBe('CUSTOM');
        });
    });

    describe('parseTxResponse', () => {
        it('should parse valid transaction response', () => {
            const txHash = 'a'.repeat(64);
            const result = parseTxResponse(txHash);

            expect(result).toHaveProperty('txHash', txHash);
            expect(result).toHaveProperty('timestamp');
            expect(result).toHaveProperty('success', true);
            expect(result.timestamp).toBeInstanceOf(Date);
        });

        it('should throw error for invalid response', () => {
            expect(() => parseTxResponse(null)).toThrow('Invalid transaction response');
            expect(() => parseTxResponse(undefined)).toThrow('Invalid transaction response');
            expect(() => parseTxResponse(123)).toThrow('Invalid transaction response');
        });

        it('should accept any string as tx hash', () => {
            const result = parseTxResponse('test-hash');
            expect(result.txHash).toBe('test-hash');
            expect(result.success).toBe(true);
        });
    });

    describe('createTxPayload', () => {
        it('should create complete transaction payload', () => {
            const noteData = {
                noteId: 'note123',
                title: 'Test Note',
                content: 'Test content'
            };
            const walletAddress = 'addr1test123';

            const payload = createTxPayload('create', noteData, walletAddress);

            expect(payload).toHaveProperty('operation', 'CREATE_NOTE');
            expect(payload).toHaveProperty('metadata');
            expect(payload).toHaveProperty('recipient', walletAddress);
            expect(payload).toHaveProperty('amount', '1000000');
            expect(payload).toHaveProperty('noteId', 'note123');
        });

        it('should include properly formatted metadata', () => {
            const noteData = {
                noteId: 'note456',
                title: 'Another Note'
            };
            const walletAddress = 'addr1test456';

            const payload = createTxPayload('update', noteData, walletAddress);

            expect(payload.metadata).toHaveProperty('674');
            expect(payload.metadata[674].msg[0]).toBe('Notes App - update');
        });

        it('should handle all operation types', () => {
            const noteData = { noteId: 'note789', title: 'Test' };
            const wallet = 'addr1test';

            const createPayload = createTxPayload('create', noteData, wallet);
            expect(createPayload.operation).toBe('CREATE_NOTE');

            const updatePayload = createTxPayload('update', noteData, wallet);
            expect(updatePayload.operation).toBe('UPDATE_NOTE');

            const deletePayload = createTxPayload('delete', noteData, wallet);
            expect(deletePayload.operation).toBe('DELETE_NOTE');
        });
    });
});