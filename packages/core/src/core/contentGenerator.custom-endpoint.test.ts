/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import { createContentGenerator, AuthType } from './contentGenerator.js';

// Mock GoogleGenAI constructor
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation((config) => ({
    models: {
      generateContent: vi.fn(),
      generateContentStream: vi.fn(),
      countTokens: vi.fn(),
      embedContent: vi.fn(),
    },
    config,
  })),
}));

describe('Custom Endpoint Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment
    process.env = { ...originalEnv };
    delete process.env.GEMINI_API_ENDPOINT;
    delete process.env.GOOGLE_GENAI_ENDPOINT;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should use default endpoint when no custom endpoint is set', async () => {
    const config = {
      model: 'gemini-pro',
      apiKey: 'test-key',
      authType: AuthType.USE_GEMINI,
    };

    await createContentGenerator(config);

    expect(GoogleGenAI).toHaveBeenCalledWith({
      apiKey: 'test-key',
      vertexai: undefined,
      httpOptions: {
        headers: {
          'User-Agent': expect.stringContaining('GeminiCLI/'),
        },
      },
    });
  });

  it('should use custom endpoint when GEMINI_API_ENDPOINT is set', async () => {
    process.env.GEMINI_API_ENDPOINT = 'https://custom-api.example.com';
    
    const config = {
      model: 'gemini-pro',
      apiKey: 'test-key',
      authType: AuthType.USE_GEMINI,
    };

    await createContentGenerator(config);

    expect(GoogleGenAI).toHaveBeenCalledWith({
      apiKey: 'test-key',
      vertexai: undefined,
      baseUrl: 'https://custom-api.example.com',
      httpOptions: {
        headers: {
          'User-Agent': expect.stringContaining('GeminiCLI/'),
        },
      },
    });
  });

  it('should use custom endpoint when GOOGLE_GENAI_ENDPOINT is set', async () => {
    process.env.GOOGLE_GENAI_ENDPOINT = 'https://alternative-api.example.com';
    
    const config = {
      model: 'gemini-pro',
      apiKey: 'test-key',
      authType: AuthType.USE_GEMINI,
    };

    await createContentGenerator(config);

    expect(GoogleGenAI).toHaveBeenCalledWith({
      apiKey: 'test-key',
      vertexai: undefined,
      baseUrl: 'https://alternative-api.example.com',
      httpOptions: {
        headers: {
          'User-Agent': expect.stringContaining('GeminiCLI/'),
        },
      },
    });
  });

  it('should prioritize GEMINI_API_ENDPOINT over GOOGLE_GENAI_ENDPOINT', async () => {
    process.env.GEMINI_API_ENDPOINT = 'https://primary-api.example.com';
    process.env.GOOGLE_GENAI_ENDPOINT = 'https://secondary-api.example.com';
    
    const config = {
      model: 'gemini-pro',
      apiKey: 'test-key',
      authType: AuthType.USE_GEMINI,
    };

    await createContentGenerator(config);

    expect(GoogleGenAI).toHaveBeenCalledWith({
      apiKey: 'test-key',
      vertexai: undefined,
      baseUrl: 'https://primary-api.example.com',
      httpOptions: {
        headers: {
          'User-Agent': expect.stringContaining('GeminiCLI/'),
        },
      },
    });
  });

  it('should work with Vertex AI and custom endpoint', async () => {
    process.env.GEMINI_API_ENDPOINT = 'https://vertex-proxy.example.com';
    
    const config = {
      model: 'gemini-pro',
      apiKey: 'test-key',
      vertexai: true,
      authType: AuthType.USE_VERTEX_AI,
    };

    await createContentGenerator(config);

    expect(GoogleGenAI).toHaveBeenCalledWith({
      apiKey: 'test-key',
      vertexai: true,
      baseUrl: 'https://vertex-proxy.example.com',
      httpOptions: {
        headers: {
          'User-Agent': expect.stringContaining('GeminiCLI/'),
        },
      },
    });
  });

  it('should not add baseUrl for OAuth authentication types', async () => {
    process.env.GEMINI_API_ENDPOINT = 'https://custom-api.example.com';
    
    const config = {
      model: 'gemini-pro',
      authType: AuthType.LOGIN_WITH_GOOGLE_PERSONAL,
    };

    // This should use the code assist path, not the GoogleGenAI constructor
    await createContentGenerator(config);

    // GoogleGenAI should not be called for OAuth auth types
    expect(GoogleGenAI).not.toHaveBeenCalled();
  });
});
