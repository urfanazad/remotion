# Setup Guide

## Steps

```bash
# 1. Copy to your project root (outside any existing repo)
cp -r kloudstack-agents/ ~/kloudstack/
cd ~/kloudstack

# 2. Fill in your tokens
cp .env.example .env
# Edit .env with your values

# 3. Start Claude Code
claude
```

Claude Code automatically reads `CLAUDE.md` and `.mcp.json` on startup.

---

## Verify MCP packages before first use

Some packages in `.mcp.json` need version verification — run these checks first:

```bash
# Verified official packages
npx -y @modelcontextprotocol/server-github --version
npx -y @vercel/mcp-adapter --version

# Check these exist under the names used (update .mcp.json if the name differs)
npm view netlify-mcp version
npm view @stripe/agent-toolkit version
npm view @atlassian/mcp-server version
npm view @canva/mcp-server version
npm view @adobe/mcp-server version
npm view @heygen/hyperframes-mcp version
npm view @lucid/mcp-server version
npm view @mirohq/mcp-server version
npm view @descript/mcp-server version
npm view @docusign/mcp-server version
npm view @paypal/mcp-server version
```

If any `npm view` command returns `404`, that package doesn't exist under that name.
Search `npmjs.com` or the provider's developer docs for the correct package name,
then update `.mcp.json` accordingly.

---

## Fill in before using docs-agent

Open `agents/docs-agent.md` and replace the placeholder lines:

```
Company number (fill in: ________________)
VAT number (fill in: ________________)
Registered address (fill in: ________________)
```

with KloudStack Ltd's actual details.

---

## Token scoping (for security)

Currently all tokens are in one `.env` file and Claude Code loads them all.
For tighter scoping, consider running separate Claude Code instances per agent type,
each with only that agent's `.env` subset. This prevents, for example, the content
agent from accidentally having access to Stripe keys.
