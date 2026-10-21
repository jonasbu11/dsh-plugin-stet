# dsh-plugin-stet

[Stet](https://stetworks.com) for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

Your assistant already knows how to write. Stet is what it knows about you:
your standing rules, your processes and who does each step, the work in
flight, your past work. Before the assistant drafts anything it reads your
manual (`recall`); when you correct it, it passes your words along (`learn`),
and Stet makes it a rule when you say it explicitly or say it twice. The same
manual serves Claude through sign-in and DSH through a key.

## Install

1. In the Stet app, open **Connect** and, under **Assistants that cannot sign
   in**, make a key. Copy it; Stet shows it once.
2. Add the plugin to your DSH profile and start DSH with the key:

   ```sh
   dsh plugin --profile web add dsh-plugin-stet
   STET_ACCESS_KEY=stet_k_... dsh web
   ```

The tools appear as `mcp__stet__recall`, `mcp__stet__learn` and the rest.
Without `STET_ACCESS_KEY` the Stet connection stays off and nothing else
changes. Revoke the key in the Stet app and the connection stops on the next call.

## What it changes in DSH

| Row | Change |
| --- | --- |
| `mcp-stet` | Added: DSH's MCP client to Stet over streamable HTTP, `Authorization: Bearer $STET_ACCESS_KEY`. `STET_MCP_URL` overrides the address. |
| `session-log-deepseek` | `enabled: false`. On the official DeepSeek API, DSH otherwise uploads the session log, tool results included, with every request. A Stet answer is your client knowledge. Your own profile patch, or Settings > General, can turn it back on. |

## Tell the assistant when to use it

Paste the standing instructions from [stetworks.com/setup](https://stetworks.com/setup/)
into your DSH profile's `AGENTS.md`.

## Test

```sh
node test/patch.mjs
```

Checks the manifest and the patch. The end-to-end test (a real DSH signing in to a local Stet with a key and listing the tools) runs from the Stet repository.

## License

MIT
