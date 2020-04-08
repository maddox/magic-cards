from evdev import InputDevice, categorize, ecodes

# fmt: off
SCANDCODES = {
    # Scancode: ASCIICode
    0: None, 1: u'ESC', 2: u'1', 3: u'2', 4: u'3', 5: u'4', 6: u'5', 7: u'6', 8: u'7', 9: u'8',
    10: u'9', 11: u'0', 12: u'-', 13: u'=', 14: u'BKSP', 15: u'TAB', 16: u'q', 17: u'w', 18: u'e',
    19: u'r', 20: u't', 21: u'y', 22: u'u', 23: u'i', 24: u'o', 25: u'p', 26: u'[', 27: u']',
    28: u'CRLF', 29: u'LCTRL', 30: u'a', 31: u's', 32: u'd', 33: u'f', 34: u'g', 35: u'h',
    36: u'j', 37: u'k', 38: u'l', 39: u';', 40: u'"', 41: u'`', 42: u'LSHFT', 43: u'\\', 44: u'z',
    45: u'x', 46: u'c', 47: u'v', 48: u'b', 49: u'n', 50: u'm', 51: u',', 52: u'.', 53: u'/',
    54: u'RSHFT', 56: u'LALT', 57: u' ', 100: u'RALT'
}
# fmt: on


class Reader:
    def __init__(self, path):
        self.path = path

    def __enter__(self):
        self.device = InputDevice(self.path)
        return self

    def read(self):
        print("Reading string...")
        while True:
            ret = ""
            for event in self.device.read_loop():
                if event.type == ecodes.EV_KEY:
                    data = categorize(event)
                    if data.keystate == 1:  # Down events only
                        key_lookup = SCANDCODES.get(data.scancode) or u"UNKNOWN:{}".format(
                            data.scancode
                        )  # Lookup or return UNKNOWN:XX
                        if key_lookup != "CRLF":
                            ret += key_lookup
                        else:
                            print(ret)
                            return ret

    def __exit__(self, type, value, traceback):
        print("Closing the device")
        self.device.close()
