import traceback

from time import sleep
from .action import ChromecastAction
from utils.androidviewclient import Netflix


class NetflixAction(ChromecastAction):
    def process(self):
        if self.chromecast.running_app == 'netflix':
            # TODO: Async needed here. If netflix is running, it needs to be stopped. But chromecast
            # is really slow to first stop an app, then start another one (takes up to 10 seconds).
            # Blocking for 10 seconds here is not something we want, so just "quit" netflix by running
            # an empty file.
            self.chromecast.play_media('http://localhost')
        else:
            # Start the netflix app, just for show (otherwise chromecast dashboard would load here
            # while we wait: Bad UI)
            self.chromecast.start_app("netflix")
        try:
            netflix = Netflix(
                self.chromecast.get_name(), connect_ip=self.config["adb_connect"] or None
            )
            netflix.main(self.card["uri"])
        except Exception:
            traceback.print_exc()
            self.chromecast.quit()
