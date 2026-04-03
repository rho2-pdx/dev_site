import json
import os
import random
from typing import Concatenate

import lyricsgenius
import requests

GENIUS_CLIENT_ID = os.environ.get("GENIUS_CLIENT_ID")
GENIUS_CLIENT_SECRET = os.environ.get("GENIUS_CLIENT_SECRET")
GENIUS_ACCESS_TOKEN = os.environ.get("GENIUS_ACCESS_TOKEN")


class Genius(object):
    def __init__(self, access_token=None):
        self.access_token = access_token or GENIUS_ACCESS_TOKEN
        if not self.access_token:
            raise Exception(
                "GENIUS_ACCESS_TOKEN is not set in the environment variables."
            )
        self.client = lyricsgenius.Genius(self.access_token, timeout=15, retries=3)

    def search_and_extract_lyrics(self, label):
        """
        Search Genius API with labels and return result
        :param label:  these were generated with vision API
        :return: lyrics from a song to be read by text-to-speech
        """
        print("Searching Genius API for...", label)

        def get_lyrics_for_song(title, artist, label):
            """This uses lrclib to get the lyrics from the song
            (I was using Genius but they cloudflare block my vps)
            """
            query = title + " " + artist
            try:
                response = requests.get(
                    "https://lrclib.net/api/search",
                    params={"q": query},
                    headers={
                        "User-Agent": "Poem-Generator from my portfolio dev site (https://github.com/rho2-pdx/dev_site)"
                    },
                    timeout=10,
                )
                results = response.json()
                if not results:
                    return None
            except Exception as e:
                print("lrclib request failed:", e)
                return None

            # try each lrclib result, not just the first
            for result in results:
                lyrics = result.get("plainLyrics") or ""
                if not lyrics:
                    continue

                lyrics_lower = lyrics.lower()
                label_lower = label.lower()

                # check each word in the label individually (helps multi-word labels like "facial hair")
                search_terms = [label_lower]
                if " " in label_lower:
                    search_terms.extend(label_lower.split())

                for term in search_terms:
                    label_index = lyrics_lower.find(term)
                    if label_index == -1:
                        continue

                    snippet_start = max(0, label_index - len(term))
                    snippet_end = min(len(lyrics), label_index + 75)
                    snippet_start = lyrics.rfind("\n", 0, snippet_start) + 1
                    snippet_end = lyrics.find("\n", snippet_end)
                    snippet_end = snippet_end if snippet_end != -1 else len(lyrics)

                    lyrics_snippet = lyrics[snippet_start:snippet_end]
                    return lyrics_snippet

            return None

        result = self.client.search_songs(label.lower())
        print(json.dumps(result, indent=4))
        try:
            hits = result.get("hits", [])
            random.shuffle(hits)
            for hit in hits:
                song = hit.get("result", {})
                song_title = song.get("title")
                song_artist = song.get("primary_artist_names")
                print(song_title, song_artist, label)
                snippet = get_lyrics_for_song(song_title, song_artist, label)
                if snippet:
                    return snippet

        except Exception as e:
            print("Error extracting snippet:", e)
        return None

    def get_lines(self, labels):
        """Gets called from the image upload

        Trims label count to 3
        runs the search_and_extract_lyrics
        appends together into snippets and returns the "poem"
        """

        if not labels:
            return "No labels provided"

        random.shuffle(labels)  # shuffle the vision api labels, we only use up to 3
        snippets = []
        for label in labels:
            snippet = self.search_and_extract_lyrics(
                label
            )  # grab lyrics containing label
            if snippet:
                snippets.append(snippet)
            if (
                len(snippets) >= 3
            ):  # only use up to 3, don't really need more, it's arbitrary
                break
        if not snippets:
            return "No matching lyrics could be found for this image."
        return " ".join(snippets)
