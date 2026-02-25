import os
import tempfile

from detect import detect_labels
from flask import render_template, request
from flask.views import MethodView
from genius import Genius
from tts import run_speech


class UploadImage(MethodView):
    """
    used to upload an image
    """

    def get(self):
        """
        :return: goes to the upload page
        """
        return render_template("upload_image.html")

    def post(self):
        """
        checks if the upload is a picture, then applies all three APIs to it
        :return: goes to the results page
        """
        if "image" not in request.files or request.files["image"].filename == "":
            print("nothing detected")
            return render_template("upload_image.html", error="Invalid image")

        image = request.files["image"]
        valid_extensions = {"png", "jpg", "jpeg", "gif"}
        if "." in image.filename:
            ext = image.filename.rsplit(".", 1)[1].lower()
            if ext not in valid_extensions:
                return render_template(
                    "upload_image.html",
                    error="File type not allowed. Please upload an image.",
                )

        with tempfile.TemporaryDirectory() as tmpdirname:
            tmp_path = os.path.join(tmpdirname, image.filename)
            image.save(tmp_path)
            labels = detect_labels(tmp_path)  # where the labels are made

        print("Detected labels:", labels)  # logging

        genius_client = Genius()
        poem = genius_client.get_lines(labels)  # the labels are used to build the poem
        print("Generated poem:\n", poem)

        audio_file = run_speech(poem)  # file generated from text-to-speech's output

        return render_template(
            "label_display.html", labels=labels, poem=poem, audio_file=audio_file
        )
