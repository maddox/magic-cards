import os
import json

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))


class Action:
    def __init__(self, card, config):
        config.pop("action", None)

        self.card = card
        self.config = config

    def env_vars_for_object(self, config, prefix):
        env_vars = {}

        config.pop("action", None)
        config.pop("id", None)

        for key, value in config.items():
            if value and isinstance(value, dict):
                nested_env_vars = self.env_vars_for_object(
                    value, "{}_{}".format(prefix, key.upper())
                )
                env_vars = {**env_vars, **nested_env_vars}
            else:
                env_vars["{}_{}".format(prefix, key.upper())] = value

        return env_vars

    def env_vars(self):
        with open(CURRENT_DIR + "/../../config/config.json", "r") as f:
            global_config = json.load(f)

        env_vars = self.env_vars_for_object(self.card, "CARD")
        env_vars["magic_cards_room"] = global_config["room"]

        prefix = self.__class__.__name__.replace("Action", "").upper()
        return {**env_vars, **self.env_vars_for_object(self.config, prefix)}


class ChromecastAction(Action):
    def __init__(self, card, config, chromecast):
        super().__init__(card, config)
        self.chromecast = chromecast
