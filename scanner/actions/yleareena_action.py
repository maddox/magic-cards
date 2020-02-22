from .mediaurl_action import MediaUrlAction
from utils.areena import Areena


class YLEAreenaAction(MediaUrlAction):
    def process(self):
        self.chromecast.stop()
        areena = Areena(self.config["areena_key"])
        uri = self.card["uri"]
        flag = uri.split(":")[0]
        the_rest = "".join(uri.split(":")[1:])
        # No latest or random flag = series
        if flag == "latest":
            url = areena.get_series_url_latest(the_rest)
        elif flag == "random":
            url = areena.get_series_url_random(the_rest)
            # No flag or empty flag = single program
        elif flag == "":
            url = areena.get_program_url(the_rest)
        else:
            url = areena.get_program_url(uri)
        self.card["uri"] = url
        super().process()
