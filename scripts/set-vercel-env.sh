#!/bin/bash

# Required environment variables
declare -A env_vars=(
    ["NEXTAUTH_URL"]="https://synapticai.app"
    ["NEXTAUTH_SECRET"]="$(openssl rand -base64 32)"
    ["GITHUB_ID"]="your-github-oauth-id"
    ["GITHUB_SECRET"]="your-github-oauth-secret"
    ["DATABASE_URL"]="your-production-postgresql-url"
    ["REDIS_URL"]="your-production-redis-url"
    ["REDIS_TOKEN"]="your-redis-token"
    ["NEXT_PUBLIC_CLAUDE_API_KEY"]="your-claude-api-key"
    ["ANTHROPIC_API_KEY"]="your-anthropic-api-key"
    ["NEXT_PUBLIC_USE_MOCK_CLAUDE"]="false"
    ["NEXT_PUBLIC_SENTRY_DSN"]="your-sentry-dsn"
    ["LOGTAIL_TOKEN"]="your-logtail-token"
    ["NEXT_PUBLIC_POSTHOG_KEY"]="your-posthog-key"
    ["NEXT_PUBLIC_POSTHOG_HOST"]="your-posthog-host"
)

# Optional environment variables with defaults
declare -A opt_env_vars=(
    ["LOG_LEVEL"]="info"
    ["CACHE_TTL"]="3600"
    ["NEXT_PUBLIC_API_URL"]="https://api.synapticai.app"
    ["NODE_ENV"]="production"
)

# Set required variables
for key in "${!env_vars[@]}"; do
    echo "Setting $key..."
    vercel env add "$key" production
done

# Set optional variables
for key in "${!opt_env_vars[@]}"; do
    echo "Setting $key..."
    vercel env add "$key" production
done

echo "Environment variables set successfully!" 