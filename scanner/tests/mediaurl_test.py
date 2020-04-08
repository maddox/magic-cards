import pytest  # noqa

from actions.mediaurl_action import MediaUrlAction


def test_mediaurl_action_random(card, actions, mocker, monkeypatch):
    monkeypatch.setattr("actions.mediaurl_action.random.randrange", lambda *args: 1)
    card["uri"] = "random:title1 title2 title3"
    action = actions["Test Action"]
    chromecast = mocker.MagicMock()
    processor = MediaUrlAction(card, action, chromecast=chromecast)
    processor.process()
    chromecast.play_media.assert_called_with("title2")


def test_mediaurl_action(card, actions, mocker):
    card["uri"] = "title1 title2 title3"
    action = actions["Test Action"]
    chromecast = mocker.MagicMock()
    processor = MediaUrlAction(card, action, chromecast=chromecast)
    processor.process()
    chromecast.play_media.assert_called_with("title1")
