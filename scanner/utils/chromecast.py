#! /usr/bin/env python
# -*- coding: utf-8 -*-

import random
from time import sleep

import pychromecast
from pychromecast.controllers.youtube import YouTubeController

from .androidviewclient import Netflix
from .areena import Areena

NETFLIX_APP_ID = 'CA5E8412'
AREENA_APP_ID = 'A9BCCB7C'


class Chromecast():
    """
    Helper class, which is basically the same as pychromecast.Chromecast
    """
    def __init__(self, chromecast_ip):
        self.cast = pychromecast.Chromecast(chromecast_ip)
        self.cast.wait()

    def quit(self):
        self.cast.quit_app()

    def stop(self):
        if self.cast.media_controller.status.player_state == 'UNKNOWN':
            self.quit()
        self.cast.media_controller.stop()

    def get_name(self):
        return self.cast.device.friendly_name

    def start_app(self, app):
        if app.lower() == 'netflix':
            self.cast.start_app(NETFLIX_APP_ID)
        elif app.lower() == 'areena':
            self.cast.start_app(AREENA_APP_ID)
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
        print('playing media {}'.format(url))
        self.cast.play_media(url, content_type=content_type, **kwargs)
        # Try a few times, sometimes the media simply refuses to play the first time.
        sleep(2)
        if self.cast.media_controller.status.player_state != 'PLAYING':
            self.cast.play_media(url, content_type=content_type, **kwargs)
        sleep(2)
        if self.cast.media_controller.status.player_state != 'PLAYING':
            self.cast.play_media(url, content_type=content_type, **kwargs)

    def register_handler(self, *args, **kwargs):
        self.cast.register_handler(*args, **kwargs)


class MockChromecast(Chromecast):
    """
    When you're developing and don't really want to cast
    """
    def __init__(self, chromecast_ip):
        pass

    def quit(self):
        print("MockChromecast: quit()")

    def stop(self):
        print("MockChromecast: stop()")

    def get_name(self):
        return "Mock Chromecast"

    def start_app(self, app):
        if app.lower() == 'netflix':
            print("MockChromecast: start_app {}".format(app))
        elif app.lower() == 'areena':
            print("MockChromecast: start_app {}".format(app))
        else:
            raise NotImplementedError()

    def play_media(self, url, content_type='video/mp4', **kwargs):
        print("MockChromecast: play_media {}".format(url))

    def register_handler(self, handler, *args, **kwargs):
        pass
