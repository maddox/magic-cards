import pytest  # noqa
import os

from actions.sonos_action import SonosAction

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))


def test_sonos_action(card, actions, monkeypatch, mocker):
    """
    Doesn't really check anything, just make sure the functions run without errors
    """
    requests_get = mocker.MagicMock()

    def mock_get(url, **kwargs):
        if "zones" in url:
            mock_resp = mocker.MagicMock()
            mock_resp.json = mocker.MagicMock(
                return_value=[{"coordinator": {"roomName": "Sonos Room"}, "uuid": "mock_uuid"}]
            )
            return mock_resp

    requests_get.side_effect = mock_get
    monkeypatch.setattr("requests.get", requests_get)
    card["uri"] = "uri"
    action = actions["Test Action"]
    action["token"] = "token"
    action["host"] = "hostname"
    action["port"] = "1337"
    action["room"] = "Sonos Room"
    action["shuffle"] = True
    action["repeat"] = True
    action["verify_ssl"] = False
    processor = SonosAction(card, action)
    processor.process()
