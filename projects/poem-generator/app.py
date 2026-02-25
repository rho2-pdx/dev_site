"""
Highly Intelligent Poem Generator - Flask app.
"""

import flask
from index import Index
from upload_image import UploadImage


class ReverseProxied:
    """Middleware that adjusts SCRIPT_NAME from the X-Script-Name header
    set by the nginx reverse proxy, so url_for() generates correct paths."""

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        script_name = environ.get("HTTP_X_SCRIPT_NAME", "")
        if script_name:
            environ["SCRIPT_NAME"] = script_name
            path_info = environ.get("PATH_INFO", "")
            if path_info.startswith(script_name):
                environ["PATH_INFO"] = path_info[len(script_name) :]
        return self.app(environ, start_response)


app = flask.Flask(__name__)
app.wsgi_app = ReverseProxied(app.wsgi_app)

app.add_url_rule("/", view_func=Index.as_view("index"), methods=["GET"])

app.add_url_rule(
    "/upload_image",
    view_func=UploadImage.as_view("upload_image"),
    methods=["GET", "POST"],
)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
