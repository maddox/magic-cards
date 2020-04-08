import pytest


@pytest.fixture
def card():
    return {
        "code": "123456789",
        "type": "test-type",
        "action": "test-action",
        "artURL": "test-URL",
        "title": "test-Title",
        "subtitle": "test-Subtitle",
        "uri": "test-uri",
        "id": 123456789,
    }


@pytest.fixture
def config():
    return {
        "room": "Test Room",
        "input_device": "test-input-device",
        "spotify": {"clientID": "test-clientID", "clientSecret": "test-clientSecret"},
        "dlnaserver_ip": "test-dlnaserver_ip",
        "chromecast_ip": "test-chromecast_ip",
    }


@pytest.fixture
def actions():
    return {
        "Test Action": {"type": "test-action"},
    }
