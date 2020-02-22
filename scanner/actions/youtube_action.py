from .action import ChromecastAction
from pychromecast.controllers.youtube import YouTubeController


class YoutubeAction(ChromecastAction):
    def process(self):
        yt = YouTubeController()
        self.chromecast.register_handler(yt)
        yt.play_video(self.card["uri"])
