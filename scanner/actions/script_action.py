import os
import subprocess

from .action import Action

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))


class ScriptAction(Action):
    def process(self):
        env_vars = self.env_vars()
        script_path = CURRENT_DIR + "/../../config/" + self.config["filename"]

        subprocess.check_call(script_path.split(" "), env=env_vars)
