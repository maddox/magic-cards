import pychromecast

NETFLIX_APP_ID = 'CA5E8412'


class Chromecast():
    def __init__(self, chromecast_ip):
        self.cast = pychromecast.Chromecast(chromecast_ip)
        self.cast.wait()

    def stop(self):
        self.cast.quit_app()

    def get_name(self):
        return self.cast.device.friendly_name

    def start_app(self, app):
        if app.lower() == 'netflix':
            self.cast.start_app(NETFLIX_APP_ID)
        else:
            raise NotImplementedError()
