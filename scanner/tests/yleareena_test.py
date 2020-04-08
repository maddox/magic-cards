import pytest  # noqa

from actions.yleareena_action import YLEAreenaAction
from utils.chromecast import MockChromecast


def test_yleareena_action(card, actions, monkeypatch, mocker):
    mock_areena = mocker.MagicMock()
    mock_areena.get_series_url_latest = mocker.MagicMock(return_value="url1")
    mock_areena.get_series_url_random = mocker.MagicMock(return_value="url2")
    mock_areena.get_program_url = mocker.MagicMock(return_value="url3")
    monkeypatch.setattr("actions.yleareena_action.Areena", lambda *args: mock_areena)
    card["uri"] = "latest:id1"
    action = actions["Test Action"]
    action["areena_key"] = ""
    processor = YLEAreenaAction(card, action, chromecast=MockChromecast(None))
    processor.process()
    assert processor.card["uri"].strip() == "url1"

    card["uri"] = "random:id1"
    processor = YLEAreenaAction(card, action, chromecast=MockChromecast(None))
    processor.process()
    assert processor.card["uri"].strip() == "url2"

    card["uri"] = ":id1"
    processor = YLEAreenaAction(card, action, chromecast=MockChromecast(None))
    processor.process()
    assert processor.card["uri"].strip() == "url3"
