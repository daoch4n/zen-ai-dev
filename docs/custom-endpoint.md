# Custom Gemini API Endpoint Configuration

The Gemini CLI supports configuring custom API endpoints through environment variables. This is useful for:

- Using proxy servers
- Self-hosted Gemini API instances
- Development/testing environments
- API gateways or load balancers

## Environment Variables

You can set either of these environment variables to override the default Gemini API endpoint:

- `GEMINI_API_ENDPOINT` - Primary environment variable for custom endpoint
- `GOOGLE_GENAI_ENDPOINT` - Alternative environment variable name

## Default Endpoint

By default, the CLI uses: `https://generativelanguage.googleapis.com`

## Usage Examples

### Using a proxy server
```bash
export GEMINI_API_ENDPOINT="https://my-proxy.example.com"
gemini "What is the weather like?"
```

### Using a custom API gateway
```bash
export GEMINI_API_ENDPOINT="https://api.mycompany.com/gemini"
gemini "Help me debug this code"
```

### Temporary override for testing
```bash
GEMINI_API_ENDPOINT="https://test-api.example.com" gemini "Test query"
```

## Configuration Files

You can also set the environment variable in your `.env` file:

```env
# In .env file in your project root or ~/.gemini/.env
GEMINI_API_ENDPOINT=https://my-custom-endpoint.example.com
```

## Important Notes

1. **Authentication**: Your API key will still be sent to the custom endpoint, so ensure it's trusted
2. **Compatibility**: The custom endpoint must implement the same API interface as the official Gemini API
3. **HTTPS Required**: For security, always use HTTPS endpoints in production
4. **API Version**: The CLI appends `/v1beta/models/` to your base URL, so don't include API version paths in your endpoint

## Troubleshooting

- Verify your custom endpoint is accessible: `curl -I https://your-endpoint.example.com`
- Check that your endpoint implements the Gemini API specification
- Ensure your API key works with the custom endpoint
- Review network/firewall settings if using corporate proxies

## Security Considerations

- Only use trusted endpoints for your API keys
- Consider using environment-specific API keys when testing
- Monitor your custom endpoint's access logs for security
- Use secure authentication methods for your custom endpoints
