import os
import base64
import requests
import traceback
import urllib.parse

from time import sleep

from .action import Action

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))


class SonosAction(Action):
    def process(self):
        content_config = self.config.get(self.card["type"], {})
        self.set_repeat(content_config.get("repeat", ""))
        self.force_playlist_playback()
        self.clearqueue()
        self.set_shuffle(content_config.get("shuffle", ""))
        sleep(0.2)
        self.room_request(self.card["uri"])

    def set_shuffle(self, mode):
        if not mode:
            return
        return self.shuffle(mode)

    def set_repeat(self, mode):
        if not mode:
            return
        return self.repeat(mode)

    def clearqueue(self):
        return self.room_request("clearqueue")

    def play(self):
        return self.room_request("play")

    def shuffle(self, mode):
        return self.room_request("shuffle/{}".format(mode))

    def repeat(self, mode):
        return self.room_request("repeat/{}".format(mode))

    def force_playlist_playback(self):
        room = self.config["room"]
        zones = self.request("zones")
        zone = [z for z in zones if z["coordinator"]["roomName"] == room][0]
        return self.room_request("SetAVTransportURI/x-rincon-queue:{}%230".format(zone["uuid"]))

    def room_request(self, path):
        room = urllib.parse.quote(self.config["room"])
        self.request("{}/{}".format(room, path))

    def request(self, path):
        base_url = "http://{}:{}/{}".format(self.config["host"], self.config["port"], path)

        print("Calling {}".format(base_url))

        headers = {}
        if self.config.get("username", "") and self.config.get("password", ""):
            headers["Authorization"] = "Basic {}".format(
                base64.b64encode("{}:{}".format(self.config["username"], self.config["password"]))
            )

        resp = requests.get(base_url, headers=headers)
        try:
            resp.raise_for_status()
        except Exception:
            traceback.print_exc()
        else:
            return resp.json()
