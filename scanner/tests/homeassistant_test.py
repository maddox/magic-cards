import pytest  # noqa

from actions.homeassistant_action import HomeAssistantAction


def test_homeassistant_action(card, actions, monkeypatch, mocker):
    requests_post = mocker.MagicMock()
    monkeypatch.setattr("requests.post", requests_post)
    card["uri"] = "uri"
    action = actions["Test Action"]
    action["token"] = "token"
    action["host"] = "hostname"
    action["port"] = "1337"
    action["verify_ssl"] = False
    processor = HomeAssistantAction(card, action)
    processor.process()

    requests_post.assert_called_with(
        "http://hostname:1337/api/events/magic_card_scanned",
        data={
            "card_code": "123456789",
            "card_type": "test-type",
            "card_arturl": "test-URL",
            "card_title": "test-Title",
            "card_subtitle": "test-Subtitle",
            "card_uri": "uri",
            "magic_cards_room": "Living Room",
        },
        headers={"Authorization": "Bearer token", "Content-Type": "application/json"},
        verify=False,
    )
