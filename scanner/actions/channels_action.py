import requests
import traceback

from .action import Action


class ChannelsAction(Action):
    def process(self):
        path = "play/"

        if self.card["type"] == "channel":
            path += "channel"
        else:
            path += "recording"

        path += "/{}".format(self.card["uri"])

        print(path)

        self.request(path)

    def request(self, path):
        request_url = "http://{host}:{port}/api/{path}".format(
            host=self.config["host"], port=self.config["port"], path=path
        )
        resp = requests.post(request_url).text()
        try:
            resp.raise_for_status()
        except Exception:
            print(resp.content)
            traceback.print_exc()
