from google.cloud import texttospeech
import os

def get_banned_words():
    """
    please don't think too hard about this
    i used ascii because it feels less uncomfortable
    :return: the map that indicates what to replace with what
    """
    banned_word_ascii = [110, 105, 103, 103, 97] # i am not allowed to write this down
    banned_word_ascii_plural = [110, 105, 103, 103, 97, 115]
    banned_word = ''.join(chr(c) for c in banned_word_ascii)
    banned_word_plural = ''.join(chr(c) for c in banned_word_ascii_plural)
    return {banned_word: "friend", banned_word_plural: "friends"}

def protect_career(text, banned_map=None):
    """
    used to filter out a couple words
    :param text: input text that will be read
    :param banned_map: words not to say and their replacements
    :return: returns the post-replacement words
    """
    if banned_map is None:
        banned_map = get_banned_words() # the voice saying it out loud felt too uncomfortable
    text_lower = text.lower()
    for word, replacement in banned_map.items():
        text_lower = text_lower.replace(word, replacement)
    return text_lower

def run_speech(text, output_filename="static/audio/poem.mp3"):
    # [START tts_quickstart]
    """
    TAKEN FROM THE GOOGLE SNIPPETS AND MODIFIED A BIT

    Synthesizes speech from the input string of text or ssml.
    Make sure to be working in a virtual environment.

    Note: ssml must be well-formed according to:
        https://www.w3.org/TR/speech-synthesis/
    """
    safe_text = protect_career(text, get_banned_words())

    # Instantiates a client
    client = texttospeech.TextToSpeechClient()

    # Set the text input to be synthesized
    synthesis_input = texttospeech.SynthesisInput(text=safe_text)

    # Build the voice request, select the language code ("en-US") and the ssml
    # voice gender ("neutral")
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US", ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )

    # Select the type of audio file you want returned
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    # Perform the text-to-speech request on the text input with the selected
    # voice parameters and audio file type
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    # Ensure the output directory exists.
    os.makedirs(os.path.dirname(output_filename), exist_ok=True)

    with open(output_filename, "wb") as out:
        out.write(response.audio_content)
        print(f"Audio content written to {output_filename}")

    return output_filename
    # [END tts_quickstart]


if __name__ == "__main__":
    run_speech()
