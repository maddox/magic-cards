import re

from .mediaurl_action import MediaUrlAction
from utils.dlna import parse_dlna


class DLNAAction(MediaUrlAction):
    def process(self):
        self.chromecast.stop()
        uri = self.card['uri']
        dlna_mappings = parse_dlna(self.config['dlnaserver_ip'])
        flag = uri.split(':')[0]
        regex = uri.split(':')[1]
        new_uri = ''
        if flag != '':
            new_uri = '{}:'.format(flag)
        for title, url in dlna_mappings.items():
            if re.search(regex, title) is not None:
                new_uri += "{} ".format(url)
        self.card['uri'] = new_uri
        super().process()
