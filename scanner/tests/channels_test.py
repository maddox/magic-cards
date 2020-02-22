import pytest  # noqa

from actions.channels_action import ChannelsAction


def test_channels_action(card, actions, monkeypatch, mocker):
    requests_post = mocker.MagicMock()
    monkeypatch.setattr("requests.post", requests_post)
    card["uri"] = "uri"
    card["type"] = "channel"
    action = actions["Test Action"]
    action["host"] = "hostname"
    action["port"] = "1337"
    processor = ChannelsAction(card, action)
    processor.process()

    requests_post.assert_called_with("http://hostname:1337/api/play/channel/uri")
