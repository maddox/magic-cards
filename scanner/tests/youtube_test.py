import pytest  # noqa

from actions.youtube_action import YoutubeAction
from utils.chromecast import MockChromecast


def test_youtube_action(card, actions, monkeypatch, mocker):
    mock_youtube = mocker.MagicMock()
    monkeypatch.setattr("actions.youtube_action.YouTubeController", lambda *args: mock_youtube)
    card["uri"] = "id1"
    action = actions["Test Action"]
    processor = YoutubeAction(card, action, chromecast=MockChromecast(None))
    processor.process()

    mock_youtube.play_video.assert_called_with("id1", playlist_id=None)

    card["uri"] = "id1:playlist1"
    processor = YoutubeAction(card, action, chromecast=MockChromecast(None))
    processor.process()

    mock_youtube.play_video.assert_called_with("id1", playlist_id="playlist1")
