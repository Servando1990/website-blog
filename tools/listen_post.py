import os
import re
import subprocess
import tempfile
from pathlib import Path
from typing import Optional
import typer
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from elevenlabs.client import ElevenLabs
import frontmatter
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

console = Console()
app = typer.Typer()


def markdown_to_plain_text(markdown_content: str) -> str:
    """
    Convert markdown content to plain text suitable for TTS.
    Removes code blocks, images, links, and formatting.

    Args:
        markdown_content (str): The markdown content to convert.

    Returns:
        str: Plain text version of the content.
    """
    # Remove code blocks
    text = re.sub(r"```[\s\S]*?```", "", markdown_content)
    text = re.sub(r"`[^`]+`", "", text)

    # Remove images
    text = re.sub(r"!\[.*?\]\(.*?\)", "", text)

    # Convert links to just their text
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)

    # Remove headers formatting but keep the text
    text = re.sub(r"#{1,6}\s+", "", text)

    # Remove bold and italic
    text = re.sub(r"\*\*([^\*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^\*]+)\*", r"\1", text)
    text = re.sub(r"__([^_]+)__", r"\1", text)
    text = re.sub(r"_([^_]+)_", r"\1", text)

    # Remove horizontal rules
    text = re.sub(r"^\s*[-*_]{3,}\s*$", "", text, flags=re.MULTILINE)

    # Remove blockquotes
    text = re.sub(r"^\s*>\s*", "", text, flags=re.MULTILINE)

    # Clean up multiple newlines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Remove leading/trailing whitespace
    text = text.strip()

    return text


def play_audio_macos(file_path: str) -> None:
    """
    Play audio file on macOS using afplay.

    Args:
        file_path (str): Path to the audio file to play.
    """
    try:
        console.print("[cyan]▶ Playing audio...[/cyan]")
        console.print("[dim]Press Ctrl+C to stop playback[/dim]\n")
        subprocess.run(["afplay", file_path], check=True)
        console.print("\n[green]✓ Playback finished[/green]")
    except subprocess.CalledProcessError:
        console.print("[red]Error playing audio file[/red]")
    except KeyboardInterrupt:
        console.print("\n[yellow]⏸ Playback stopped[/yellow]")


def convert_post_to_audio(
    file_path: str,
    api_key: str,
    voice: str = "21m00Tcm4TlvDq8ikWAM",  # Rachel
    model: str = "eleven_multilingual_v2",
) -> None:
    """
    Convert a markdown blog post to audio using ElevenLabs TTS and play it immediately.
    Audio is automatically deleted after playback.

    Args:
        file_path (str): Path to the markdown file.
        api_key (str): ElevenLabs API key.
        voice (str): Voice ID or name to use. Default is "Rachel".
        model (str): Model to use. Default is "eleven_multilingual_v2".
    """
    temp_file = None
    try:
        # Load the markdown file
        post = frontmatter.load(file_path)
        title = post.metadata.get("title", "Untitled Post")

        console.print(f"[cyan]Processing:[/cyan] {title}")

        # Convert markdown to plain text
        plain_text = markdown_to_plain_text(post.content)

        # Add title at the beginning
        full_text = f"{title}. {plain_text}"

        # Count characters for tracking
        char_count = len(full_text)
        console.print(f"[dim]Character count: {char_count:,}[/dim]")

        # Initialize ElevenLabs client
        client = ElevenLabs(api_key=api_key)

        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
        output_path = Path(temp_file.name)
        temp_file.close()

        # Generate audio
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            progress.add_task(description="Generating audio...", total=None)

            audio = client.text_to_speech.convert(
                voice_id=voice,
                text=full_text,
                model_id=model,
            )

            # Save the audio file
            with open(output_path, "wb") as f:
                for chunk in audio:
                    f.write(chunk)

        console.print(
            f"[dim]Free tier usage: ~{char_count} / 10,000 characters[/dim]\n"
        )

        # Play the audio
        play_audio_macos(str(output_path))

        # Clean up temp file
        try:
            os.unlink(output_path)
            console.print("[dim]Cleaned up temporary file[/dim]")
        except Exception as e:
            console.print(f"[dim]Warning: Could not delete temp file: {e}[/dim]")

    except Exception as e:
        console.print(f"[red]Error processing {file_path}: {e}[/red]")
        # Clean up temp file on error
        if temp_file:
            try:
                os.unlink(temp_file.name)
            except Exception:
                pass
        raise typer.Exit(code=1)


@app.command()
def main(
    file_path: str = typer.Argument(
        ..., help="Path to the markdown file to listen to"
    ),
    api_key: Optional[str] = typer.Option(
        None,
        "--api-key",
        "-k",
        envvar="ELEVENLABS_API_KEY",
        help="ElevenLabs API key (or set ELEVENLABS_API_KEY env var)",
    ),
    voice: str = typer.Option(
        "21m00Tcm4TlvDq8ikWAM",  # Rachel
        "--voice",
        "-v",
        help="Voice ID to use. Common voices: Rachel (21m00Tcm4TlvDq8ikWAM), Adam (pNInz6obpgDQGcFmaJgB), Domi (AZnzlk1XvdvUeBnXmlld)",
    ),
    model: str = typer.Option(
        "eleven_multilingual_v2",
        "--model",
        "-m",
        help="Model to use (eleven_multilingual_v2, eleven_monolingual_v1, eleven_turbo_v2)",
    ),
    list_voices: bool = typer.Option(
        False, "--list-voices", help="List available voices and exit"
    ),
):
    """
    Listen to a blog post using ElevenLabs text-to-speech.
    Plays audio immediately and automatically deletes after playback.

    Example usage:
        uv run python listen_post.py ../apps/blog/src/content/posts/my-post.md
        uv run python listen_post.py ../apps/blog/src/content/posts/my-post.md --voice Adam
    """
    if not api_key:
        console.print(
            "[red]Error: ElevenLabs API key is required.[/red]\n"
            "Set the ELEVENLABS_API_KEY environment variable or use --api-key option."
        )
        raise typer.Exit(code=1)

    if list_voices:
        console.print("[cyan]Common Voice IDs:[/cyan]")
        console.print("Rachel:    21m00Tcm4TlvDq8ikWAM")
        console.print("Adam:      pNInz6obpgDQGcFmaJgB")
        console.print("Domi:      AZnzlk1XvdvUeBnXmlld")
        console.print("Josh:      TxGEqnHWrfWFTfGW9XjX")
        console.print("Antoni:    ErXwobaYiN019PkySvjV")
        console.print("Arnold:    VR6AewLTigWG4xSOukaG")
        console.print("Elli:      MF3mGyEYCl7XYWbV9V6O")
        console.print("Emily:     LcfcDJNUP1GQjkzn1xUU")
        console.print("\n[dim]Visit https://elevenlabs.io/voice-library for more voices[/dim]")
        return

    # Check if file exists
    if not os.path.exists(file_path):
        console.print(f"[red]Error: File not found: {file_path}[/red]")
        raise typer.Exit(code=1)

    # Check if it's a markdown file
    if not file_path.endswith(".md"):
        console.print(f"[red]Error: File must be a markdown (.md) file[/red]")
        raise typer.Exit(code=1)

    convert_post_to_audio(file_path, api_key, voice, model)


if __name__ == "__main__":
    app()
