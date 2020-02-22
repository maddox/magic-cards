from time import sleep
from .action import ChromecastAction
from utils.androidviewclient import Netflix


class NetflixAction(ChromecastAction):
    def process(self):
        if self.chromecast.running_app == 'netflix':
            self.chromecast.play_media('http://localhost')
        else:
            # Start the netflix app, just for show (otherwise chromecast dashboard would load here
            # while we wait: Bad UI)
            self.chromecast.start_app("netflix")
        netflix = Netflix(
            self.chromecast.get_name(), connect_ip=self.config["adb_connect"] or None
        )
        netflix.main(self.card["uri"])
