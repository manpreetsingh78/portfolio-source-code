from __future__ import annotations

import asyncio
import io
from dotenv import load_dotenv

import av
import numpy as np
import edge_tts

from livekit import agents
from livekit.agents import AgentServer, AgentSession, Agent
from livekit.agents.tts import TTS, ChunkedStream, TTSCapabilities
from livekit.agents.types import DEFAULT_API_CONNECT_OPTIONS, APIConnectOptions
from livekit.agents.utils import shortuuid
from livekit.plugins import openai, silero

load_dotenv(".env.local")

# ---------------------------------------------------------------------------
# Edge TTS adapter for LiveKit agents  (free, no API key)
# ---------------------------------------------------------------------------
_EDGE_SAMPLE_RATE = 24000  # resample to 24kHz mono PCM for LiveKit
_EDGE_VOICE = "en-IN-NeerjaNeural"  # Indian female neural voice


class _EdgeChunkedStream(ChunkedStream):
    """ChunkedStream that synthesises audio via Edge TTS."""

    def __init__(self, *, tts: EdgeTTS, input_text: str, conn_options: APIConnectOptions) -> None:
        super().__init__(tts=tts, input_text=input_text, conn_options=conn_options)

    async def _run(self, output_emitter) -> None:
        output_emitter.initialize(
            request_id=shortuuid(),
            sample_rate=_EDGE_SAMPLE_RATE,
            num_channels=1,
            mime_type="audio/pcm",
            stream=False,
        )

        # Collect MP3 bytes from Edge TTS
        communicate = edge_tts.Communicate(self._input_text, _EDGE_VOICE)
        mp3_buf = io.BytesIO()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                mp3_buf.write(chunk["data"])

        # Decode MP3 → PCM int16 using PyAV (already installed for livekit-agents)
        mp3_buf.seek(0)
        container = av.open(mp3_buf, format="mp3")
        resampler = av.AudioResampler(
            format="s16", layout="mono", rate=_EDGE_SAMPLE_RATE
        )

        for frame in container.decode(audio=0):
            resampled = resampler.resample(frame)
            for rf in resampled:
                pcm_bytes = rf.to_ndarray().astype(np.int16).tobytes()
                output_emitter.push(pcm_bytes)

        container.close()
        output_emitter.flush()


class EdgeTTS(TTS):
    """Free neural TTS via Microsoft Edge speech service."""

    def __init__(self, voice: str = _EDGE_VOICE) -> None:
        self._voice = voice
        super().__init__(
            capabilities=TTSCapabilities(streaming=False),
            sample_rate=_EDGE_SAMPLE_RATE,
            num_channels=1,
        )

    @property
    def model(self) -> str:
        return self._voice

    @property
    def provider(self) -> str:
        return "edge-tts"

    def synthesize(
        self, text: str, *, conn_options: APIConnectOptions = DEFAULT_API_CONNECT_OPTIONS
    ) -> ChunkedStream:
        return _EdgeChunkedStream(tts=self, input_text=text, conn_options=conn_options)

    async def aclose(self) -> None:
        pass


# ---------------------------------------------------------------------------
# Agent
# ---------------------------------------------------------------------------

class ManpreetAssistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are Manpreet Singh's AI voice assistant on his portfolio website.
You speak as if you are Manpreet himself, talking directly to the visitor.

ABOUT MANPREET:
- Full Stack Developer based in India with 3 plus years of professional experience.
- Backend-heavy engineer who builds scalable web applications, real-time platforms, and AI-integrated systems.
- Core stack includes Python, TypeScript, JavaScript, FastAPI, Django, Node.js, React, Next.js, and Angular.
- Strong in PostgreSQL, MongoDB, Docker, AWS, Azure, CI/CD with GitHub Actions.
- Has built real-time systems using WebSockets, LiveKit, and SIP-based voice pipelines.
- Experience with Gemini Live API, audio streaming pipelines, subtitle extraction, and searchable transcript systems.
- Built automated trading systems including a Binance Futures bot with backtesting, stop-loss logic, trailing take profit, and PnL tracking.
- Domain exposure spans healthcare software, service center dashboards, trip management, vehicle insurance portals, and quick commerce architecture.
- Engineering style prioritizes clean architecture, reusable components, security-first thinking, and production-ready code.
- This portfolio itself runs on a live VM with real-time system metrics, NLP tools, and this voice agent, all self-hosted.

HOW TO SPEAK:
- Be natural, conversational, and confident. No buzzwords or filler.
- Keep answers to one or two sentences when possible. Be direct.
- Show technical depth without over-explaining.
- Never fabricate projects, companies, or metrics.
- If unsure about a detail, say so honestly and offer to discuss related skills.
- For hiring or contact inquiries, point them to the contact section on the site.
- No markdown, no emojis, no special formatting. This is voice output.""",
        )


server = AgentServer()


@server.rtc_session(agent_name="manpreet-assistant")
async def my_agent(ctx: agents.JobContext):
    session = AgentSession(
        stt=openai.STT(
            model="whisper-1",
            language="en",
        ),
        llm=openai.LLM(model="gpt-4.1-mini"),
        tts=EdgeTTS(),
        vad=silero.VAD.load(
            min_silence_duration=0.8,
            activation_threshold=0.65,
        ),
    )

    await session.start(
        room=ctx.room,
        agent=ManpreetAssistant(),
    )

    # Static greeting — goes directly to TTS, no LLM call needed
    await session.say(
        "Hey! I'm Manpreet's AI assistant. Ask me anything about his skills, experience, or projects.",
        allow_interruptions=False,
    )


if __name__ == "__main__":
    agents.cli.run_app(server)
