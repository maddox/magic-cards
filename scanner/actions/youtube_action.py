from .action import ChromecastAction
from pychromecast.controllers.youtube import YouTubeController


class YoutubeAction(ChromecastAction):
    def process(self):
        yt = YouTubeController()
        self.chromecast.register_handler(yt)
        yt_id = self.card["uri"].split(":")[0]
        yt.play_video(yt_id, playlist_id=":".join(self.card["uri"].split(":")[1:]) or None)
