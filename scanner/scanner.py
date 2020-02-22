import json
import os
import traceback

from utils.chromecast import Chromecast, MockChromecast
from utils.keyboard import Reader

from actions.dlna_action import DLNAAction
from actions.mediaurl_action import MediaUrlAction
from actions.netflix_action import NetflixAction
from actions.yleareena_action import YLEAreenaAction
from actions.youtube_action import YoutubeAction

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))

with open(CURRENT_DIR + "/../config/config.json", "r") as f:
    config = json.load(f)

if "chromecast_ip" in config:
    if config["chromecast_ip"] == "mock_chromecast":
        chromecast = MockChromecast(config["chromecast_ip"])
    else:
        chromecast = Chromecast(config["chromecast_ip"])


def handle_code(code):
    found = False
    with open(CURRENT_DIR + "/../config/cards.json", "r") as f:
        cards = json.load(f)

    for card in cards:
        if card["code"] == code:
            found = True
            break

    if not found:
        print("Card not found.")
        return

    with open(CURRENT_DIR + "/../config/actions.json", "r") as f:
        actions = json.load(f)

    action = actions.get(card["action"], None)
    if not action:
        print("Action not found: {}".format(card["action"]))
        return

    print("Processing action {}".format(card["action"]))

    action_processor = None
    if action["type"] == "chromecast-dlna":
        action_processor = DLNAAction(card, action, chromecast=chromecast)
    elif action["type"] == "chromecast-mediaurl":
        action_processor = MediaUrlAction(card, action, chromecast=chromecast)
    elif action["type"] == "chromecast-netflix":
        action_processor = NetflixAction(card, action, chromecast=chromecast)
    elif action["type"] == "chromecast-yleareena":
        action_processor = YLEAreenaAction(card, action, chromecast=chromecast)
    elif action["type"] == "chromecast-youtube":
        action_processor = YoutubeAction(card, action, chromecast=chromecast)

    if action_processor:
        action_processor.process()


if __name__ == "__main__":
    import argparse
    import sys

    parser = argparse.ArgumentParser(description="Scanner")
    parser.add_argument("--code", help="Code to input, disable scanner", required=False)

    args = vars(parser.parse_args())
    # Clear args for any extra checks (There is one in android/viewclient.py", line 2796)
    sys.argv = [sys.argv[0]]

    if args.get('code', ''):
        handle_code(args['code'])
    else:
        print("Starting reader: {}".format(config["input_device"]))
        while True:
            try:
                with Reader("/dev/input/{}".format(config["input_device"])) as reader:
                    line = reader.read()
                    print("Read Card ID: {}".format(line))
                    handle_code(line)
            except KeyboardInterrupt:
                break
            except FileNotFoundError:
                raise
            except Exception:
                traceback.print_exc()
                continue
