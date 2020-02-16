#! /usr/bin/env python
# -*- coding: utf-8 -*-


import subprocess
import re
import traceback
from time import sleep, time

from com.dtmilano.android.viewclient import ViewClient

from chromecast import Chromecast


def loop_until(func, seconds=15, nofail=False):
    """
    Helper method for try-until behaviour
    """
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


class AndroidViewBase:
    def __init__(self, chromecast_name, connect_ip=None):
        self.chromecast_name = chromecast_name
        self.connect_ip = connect_ip

    def main(self, *args, **kwargs):
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
        self.vc = ViewClient(device, serialno, **kwargs2)
        self.vc.device.shell("input keyevent KEYCODE_WAKEUP")
        self.vc.device.shell("input keyevent KEYCODE_WAKEUP")

        self.run(*args, **kwargs)

        self.vc.device.shell("input keyevent KEYCODE_HOME")
        self.vc.device.shell("input keyevent KEYCODE_SLEEP")

    def run(self, *args, **kwargs):
        """
        Override this to get a basic script running, with the screen woken and
        going to sleep after finished,
        """
        raise NotImplementedError()


class Netflix(AndroidViewBase):
    def run(self, netflix_url):
        self.vc.device.shell("am force-stop com.netflix.mediaclient")
        self.vc.device.shell("am start -a android.intent.action.VIEW -d {}".format(netflix_url))

        def _cast(**kwargs):
            self.vc.dump(window="-1", sleep=1)
            self.vc.findViewById("com.netflix.mediaclient:id/ab_menu_cast_item").touch()
            self.vc.dump(window="-1", sleep=1)
            self.vc.findViewWithTextOrRaise(re.compile(self.chromecast_name)).touch()

        loop_until(_cast)

        def _play(**kwargs):
            self.vc.dump(window="-1", sleep=1)
            self.vc.findViewById("com.netflix.mediaclient:id/video_img").touch()

        loop_until(_play)
