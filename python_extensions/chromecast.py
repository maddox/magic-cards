#! /usr/bin/env python
# -*- coding: utf-8 -*-

import pychromecast
from pychromecast.controllers.youtube import YouTubeController

NETFLIX_APP_ID = 'CA5E8412'


class Chromecast():
    """
    Helper class, which is basically the same as pychromecast.Chromecast
    """
    def __init__(self, chromecast_ip):
        self.cast = pychromecast.Chromecast(chromecast_ip)
        self.cast.wait()

    def stop(self):
        self.cast.quit_app()

    def get_name(self):
        return self.cast.device.friendly_name

    def start_app(self, app):
        if app.lower() == 'netflix':
            self.cast.start_app(NETFLIX_APP_ID)
        else:
            raise NotImplementedError()

    def play_media(self, url, content_type='video/mp4', **kwargs):
        """
        kwargs can consist of:

        title: str - title of the media.
        thumb: str - thumbnail image url.
        current_time: float - seconds from the beginning of the media
            to start playback.
        autoplay: bool - whether the media will automatically play.
        stream_type: str - describes the type of media artifact as one of the
            following: "NONE", "BUFFERED", "LIVE".
        subtitles: str - url of subtitle file to be shown on chromecast.
        subtitles_lang: str - language for subtitles.
        subtitles_mime: str - mimetype of subtitles.
        subtitle_id: int - id of subtitle to be loaded.
        metadata: dict - media metadata object, one of the following:
            GenericMediaMetadata, MovieMediaMetadata, TvShowMediaMetadata,
            MusicTrackMediaMetadata, PhotoMediaMetadata.
        """
        self.cast.play_media(url, content_type=content_type, **kwargs)


if __name__ == "__main__":
    import argparse
    import sys

    parser = argparse.ArgumentParser(description="Chromecast Mediaplayer")
    parser.add_argument("--chromecast_ip", help="Chromecast IP", required=True)
    parser.add_argument("--app", help="App name", default='mediacontroller', required=False)
    parser.add_argument(
        "options", metavar="option", type=str, nargs="+", help="Media url data (one or more)",
    )
    args = vars(parser.parse_args())
    # Clear args for any extra checks (There is one in android/viewclient.py", line 2796)
    sys.argv = [sys.argv[0]]
    if len(args["options"]) > 1:
        print(
            "Warning: Chromecast currenlty only takes a single url argument: Ignored {}".format(
                ", ".join(args["options"][1:])
            )
        )
    chromecast = Chromecast(args['chromecast_ip'])
    if args['app'] == 'mediaplayer':
        if args['options'][0] == 'stop':
            chromecast.stop()
        else:
            chromecast.play_media(args['options'][0])
    elif args['app'] == 'youtube':
        yt = YouTubeController()
        chromecast.register_handler(yt)
        yt.play_video(args['options'][0])
