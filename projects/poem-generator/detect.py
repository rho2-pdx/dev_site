#!/usr/bin/env python

# Copyright 2017 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""This application demonstrates how to perform basic operations with the
Google Cloud Vision API.

Example Usage:
python detect.py labels ./resources/landmark.jpg

For more information, the documentation at
https://cloud.google.com/vision/docs.
"""

import argparse

# [START vision_label_detection]
def detect_labels(path):
    """
    TAKEN FROM THE SNIPPETS AND MODIFIED A BIT
    Detects labels in the file."""
    from google.cloud import vision

    client = vision.ImageAnnotatorClient()

    # [START vision_python_migration_label_detection]
    with open(path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.label_detection(image=image)
    labels = response.label_annotations
    print("Labels:")

    label_list = [label.description for label in labels]
    print("Detected labels: ", label_list)

    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )
    return label_list
    # [END vision_python_migration_label_detection]


# [END vision_label_detection]


def run_local(args):

    if args.command == "labels":
        detect_labels(args.path)



if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Detect labels with Vision API"
    )
    parser.add_argument("command", choices=["labels"])
    parser.add_argument("path")

    args = parser.parse_args()
    run_local(args)
