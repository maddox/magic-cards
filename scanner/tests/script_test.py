import pytest  # noqa
import os

from actions.script_action import ScriptAction

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))


def test_script_action(card, actions, monkeypatch, mocker):
    check_call = mocker.MagicMock()
    monkeypatch.setattr("subprocess.check_call", check_call)
    card["uri"] = "uri"
    action = actions["Test Action"]
    action["filename"] = "filename"
    processor = ScriptAction(card, action)
    processor.process()

    check_call.assert_called_with(
        ["/".join(CURRENT_DIR.split("/")[:-1]) + "/actions/../../config/filename"],
        env={
            "CARD_CODE": "123456789",
            "CARD_TYPE": "test-type",
            "CARD_ARTURL": "test-URL",
            "CARD_TITLE": "test-Title",
            "CARD_SUBTITLE": "test-Subtitle",
            "CARD_URI": "uri",
            "magic_cards_room": "Living Room",
            "SCRIPT_TYPE": "test-action",
            "SCRIPT_FILENAME": "filename",
        },
    )
