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
            response = requests.get(
                "https://lrclib.net/api/search",
                params={"q": query},
                headers={
                    "User-Agent": "Poem-Generator from my portfolio dev site (https://github.com/rho2-pdx/dev_site)"
                },
            )
            results = response.json()
            lyrics = results[0].get("plainLyrics") or ""  # the actual song lyrics
            if not lyrics or label.lower() not in lyrics:
                return None

            label_index = lyrics.find(label.lower())
            snippet_start = max(0, label_index - len(label))
            snippet_end = min(len(lyrics), label_index + 75)
            snippet_start = lyrics.rfind("\n", 0, snippet_start) + 1
            snippet_end = lyrics.find("\n", snippet_end)
            snippet_end = snippet_end if snippet_end != -1 else len(lyrics)

            lyrics_snippet = lyrics[snippet_start:snippet_end]

            return lyrics_snippet

        result = self.client.search_songs(label.lower())
        # printing dictionary
        print(json.dumps(result, indent=4))
        try:
            # output of search is a dict, so we dive-down nested labels
            hits = result.get("hits", [])
            if hits:
                random_hit = random.choice(hits)
                result = random_hit.get("result", {})
                song_title = result.get("title")
                song_artist = result.get("primary_artist_names")
                print(song_title, song_artist, label)
                snippet = get_lyrics_for_song(song_title, song_artist, label)
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
        while len(snippets) < 3:
            snippets.append("No matching lyrics found for remaining labels.")
        return " ".join(snippets)
