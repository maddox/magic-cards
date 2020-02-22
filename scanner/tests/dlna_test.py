import pytest  # noqa

from actions.dlna_action import DLNAAction
from utils.chromecast import MockChromecast


def test_dlna_action(card, actions, monkeypatch):
    monkeypatch.setattr("actions.dlna_action.parse_dlna", lambda *args: {"title1": "url1"})
    card["uri"] = ":title1"
    action = actions["Test Action"]
    action["dlnaserver_ip"] = ""
    processor = DLNAAction(card, action, chromecast=MockChromecast(None))
    processor.process()
    assert processor.card["uri"].strip() == "url1"
