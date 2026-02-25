import json
import os
import random

import lyricsgenius

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
        print("Searching Genius API...", label)

        result = self.client.search_lyrics(label.lower())
        # printing dictionary
        print(json.dumps(result, indent=4))
        try:
            # output of search is a dict, so we dive-down nested labels
            sections = result.get("sections", [])
            for section in sections:
                if section.get("type") == "lyric" and section.get("hits"):
                    random_hit = random.choice(section["hits"])
                    result = random_hit.get("result", [])
                    song_id = result.get("id")
                    lyrics = self.client.lyrics(song_id)
                    label_index = lyrics.find(label.lower())
                    snippet_start = max(0, label_index - len(label))
                    snippet_end = min(len(lyrics), label_index + 75)
                    snippet_start = lyrics.rfind("\n", 0, snippet_start) + 1
                    snippet_end = lyrics.find("\n", snippet_end)
                    snippet_end = snippet_end if snippet_end != -1 else len(lyrics)

                    snippet = lyrics[snippet_start:snippet_end]

                    return snippet

        except Exception as e:
            print("Error extracting snippet:", e)
        return None

    def get_lines(self, labels):
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
