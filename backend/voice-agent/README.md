# LiveKit Voice Agent - Manpreet's Portfolio Assistant

A voice AI agent that serves as Manpreet Singh's portfolio assistant, powered by LiveKit Agents SDK.

## Stack
- **STT**: Deepgram Nova-3 (Speech-to-Text)
- **LLM**: OpenAI GPT-4.1 Mini
- **TTS**: Cartesia Sonic-3 (Text-to-Speech)
- **Framework**: LiveKit Agents SDK v1.4

## Setup

1. Install [uv](https://docs.astral.sh/uv/getting-started/installation/)
2. Install dependencies:
   ```bash
   uv sync
   ```
3. Download model files:
   ```bash
   uv run agent.py download-files
   ```

## Development

Run in dev mode (connects to LiveKit Cloud):
```bash
uv run agent.py dev
```

Run in console mode (terminal-only):
```bash
uv run agent.py console
```

## Deploy to LiveKit Cloud

```bash
lk agent create
```
