#! /usr/bin/env python
# -*- coding: utf-8 -*-


import subprocess
import re
import traceback
from time import sleep, time

from com.dtmilano.android.viewclient import ViewClient

from chromecast import Chromecast


def loop_until(func, seconds=15, nofail=False):
    start = time()
    firstrun = True
    while True:
        try:
            print("Looping " + str(func))
            ret = func(firstrun=firstrun)
            if ret != "continue":
                break
        except Exception:
            traceback.print_exc()
            if (time() - start) > seconds:
                if nofail:
                    return
                else:
                    raise
        if (time() - start) > seconds:
            return
        sleep(0.5)
        firstrun = False


class Netflix:
    def __init__(self, chromecast_name, connect_ip=None):
        self.chromecast_name = chromecast_name
        self.connect_ip = connect_ip

    def cast(self, netflix_url):
        if self.connect_ip:
            subprocess.check_call(["adb", "connect", self.connect_ip])

        kwargs1 = {"verbose": False, "ignoresecuredevice": False, "ignoreversioncheck": False}
        device, serialno = ViewClient.connectToDeviceOrExit(**kwargs1)

        kwargs2 = {
            "forceviewserveruse": False,
            "startviewserver": True,
            "autodump": False,
            "ignoreuiautomatorkilled": True,
            "compresseddump": True,
            "useuiautomatorhelper": False,
            "debug": {},
        }
        vc = ViewClient(device, serialno, **kwargs2)
        vc.device.shell("input keyevent KEYCODE_WAKEUP")
        vc.device.shell("input keyevent KEYCODE_WAKEUP")

        vc.device.shell("am force-stop com.netflix.mediaclient")
        vc.device.shell("am start -a android.intent.action.VIEW -d {}".format(netflix_url))

        # NOTE: Netflix app should be turned off before running this script!
        def _cast(**kwargs):
            vc.dump(window="-1", sleep=1)
            vc.findViewById("com.netflix.mediaclient:id/ab_menu_cast_item").touch()
            vc.dump(window="-1", sleep=1)
            vc.findViewWithTextOrRaise(re.compile(self.chromecast_name)).touch()

        loop_until(_cast)

        def _play(**kwargs):
            vc.dump(window="-1", sleep=1)
            vc.findViewById("com.netflix.mediaclient:id/video_img").touch()

        loop_until(_play)

        vc.device.shell("input keyevent KEYCODE_HOME")
        vc.device.shell("input keyevent KEYCODE_SLEEP")


if __name__ == "__main__":
    import argparse
    import sys

    parser = argparse.ArgumentParser(description="AndroidViewClient")
    parser.add_argument("--type", help="Action type", required=True)
    parser.add_argument("--chromecast_ip", help="Chromecast IP", required=True)
    parser.add_argument("--connect_ip", help="IP for remote adb connection", required=False)
    parser.add_argument(
        "options", metavar="option", type=str, nargs="+", help="Action data (one or more)",
    )
    args = vars(parser.parse_args())
    # Clear args for any extra checks (There is one in android/viewclient.py", line 2796)
    sys.argv = [sys.argv[0]]

    chromecast = Chromecast(args['chromecast_ip'])
    chromecast.stop()

    if args["type"].lower() == "netflix":
        if len(args["options"]) > 1:
            print(
                "Warning: Netflix only takes a single argument: Ingored {}".format(
                    ", ".join(args["options"][1:])
                )
            )
        # Start the netflix app, just for show (otherwise chromecast dashboard would load here
        # while we wait: Bad UI)
        chromecast.start_app('netflix')
        netflix = Netflix(chromecast.get_name(), connect_ip=args["connect_ip"] or None)
        netflix.cast(args["options"][0])
    else:
        print("Type {} is not implemented".format(args["type"]))
