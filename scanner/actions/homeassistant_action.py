import requests
import traceback
from .action import Action


class HomeAssistantAction(Action):
    def process(self):
        self.request(self.payload())

    def payload(self):
        env_vars = self.env_vars()
        payload = {}
        for key, value in env_vars.items():
            if "HOMEASSISTANT" in key:
                continue
            payload[key.lower()] = value

        return payload

    def request(self, payload):
        protocol = "https://" if self.config.get("ssl", False) else "http://"
        base_url = "{}{}:{}/api/events/magic_card_scanned".format(
            protocol, self.config["host"], self.config["port"]
        )

        headers = {"Content-Type": "application/json"}
        if self.config.get("token", ""):
            headers["Authorization"] = "Bearer {}".format(self.config["token"])
        elif self.config.get("password", ""):
            headers["x-ha-access"] = self.config["password"]

        verify = True
        if self.config.get("verify_ssl", None) is False:
            verify = False

        try:
            resp = requests.post(base_url, data=payload, headers=headers, verify=verify)
            resp.raise_for_status()
        except Exception:
            traceback.print_exc()
        else:
            return resp.json()
