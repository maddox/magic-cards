"""
Use Yle areena API to fetch media urls ready for playing with the chromecast
mediaplayer app.
"""


import requests
from random import randrange
from yledl import yledl

AREENA_URL = "https://external.api.yle.fi/v1/"


def monkeypatched(lines):
    yledl.retval = lines


yledl.print_lines = monkeypatched


class Areena:
    def __init__(self, api_key):
        self.api_key = api_key

    def get_series_url_latest(self, series_id):
        data = self.api_call(
            (
                "programs/items.json?&"
                "series={series_id}&"
                "order=publication.starttime:desc&limit=1&"
                "type=program&"
                "availability=ondemand"
            ).format(series_id=series_id)
        )
        return self.get_program_url(data["data"][0]["id"])

    def get_series_url_random(self, series_id):
        data = self.api_call(
            (
                "programs/items.json?&"
                "series={series_id}&"
                "order=publication.starttime:asc&limit=10&"
                "type=program&"
                "availability=ondemand"
            ).format(series_id=series_id)
        )
        return self.get_program_url(data["data"][randrange(len(data["data"]) - 1)]["id"])

    def api_call(self, url):
        try:
            full_url = AREENA_URL + url + "&" + self.api_key
            print("full_url:", full_url)
            response = requests.get(full_url)
            return response.json()
        except Exception as e:
            print(e, response.content)

    def get_program_url(self, program_id):
        print("Fetching url for program", program_id)
        yledl.main(["yledl", "--showurl", "https://areena.yle.fi/%s" % program_id])
        return yledl.retval[0]
