import pytest  # noqa

from actions.netflix_action import NetflixAction


def test_netflix_action(card, actions, mocker, monkeypatch):
    # Basic setup
    card["uri"] = "random:title1 title2 title3"
    action = actions["Test Action"]
    action["adb_connect"] = "mock_adb_connect"
    # Mocker setup
    mock_netflix = mocker.MagicMock()
    monkeypatch.setattr("actions.netflix_action.Netflix", mock_netflix)
    chromecast = mocker.MagicMock()
    chromecast.get_name = mocker.MagicMock(return_value="Mock Chromecast")
    # Run action
    processor = NetflixAction(card, action, chromecast=chromecast)
    processor.process()
    # Assertions
    chromecast.start_app.assert_called_with("netflix")
    mock_netflix.assert_called_with("Mock Chromecast", connect_ip="mock_adb_connect")
