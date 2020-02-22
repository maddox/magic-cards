import random

from .action import ChromecastAction


class MediaUrlAction(ChromecastAction):
    def process(self):
        if self.card["uri"] == "stop":
            self.chromecast.stop()
        else:
            first = self.card["uri"].split(" ")[0]
            flag = first.split(":")[0]
            if flag == "random":
                all_urls = [":".join(first.split(":")[1:])] + self.card["uri"].split(" ")[1:]
                url = all_urls[random.randrange(0, len(all_urls) - 1)]
            else:
                url = first

            self.chromecast.play_media(url)
