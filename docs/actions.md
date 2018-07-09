# Actions!

Actions. This is where the magic happens. Magic Cards has core actions that process your card and do things.

Combined with those, and your configured actions, you can tell your cards exactly what to do.

* [Background](#background)
* [actions.json](#actionsjson)
* [Sonos](#sonos)
* [Home Assistant](#home-assistant)
* [Channels](#channels)
* [Scripts](#scripts)

## Background

Actions are simple little processors that take your card as input and your configured version of the action and do something. Actions need some settings like hostnames or authentication to process correctly. This is where your `actions.json` configuration comes in.

## actions.json

`actions.json` is where you define all of the actions available for cards. Each action you define, will be available in the select box when managing your card.

It's very flexible and you can have as many as you want.

### Example

Magic Cards comes with an example actions configuration in `/config/actions.example.json`. Here's what it looks like:

```json
{
  "Sonos": {
    "type": "sonos",
    "host": "192.168.1.50",
    "port": "5005",
    "username": "myname",
    "password": "mypassword",
    "room": "Living Room",
    "playlist": {
      "shuffle": "on",
      "repeat": "all"
    },
    "album": {
      "shuffle": "off",
      "repeat": "all"
    },
    "song": {
      "shuffle": "off",
      "repeat": "all"
    }
  },
  "Home Assistant": {
    "type": "home_assistant",
    "host": "192.168.1.50",
    "port": "8123",
    "ssl": false,
    "password": "hapassword"
  },
  "Family Room Channels": {
    "type": "channels",
    "host": "192.168.1.120",
    "port": "57000"
  },
  "My Script": {
    "type": "script",
    "filename": "test.sh"
  }
}
```

Explanation about each type can be found below. But what's most important to understand is how they're defined. Each action has a name for a key, with it's configuration as a value. The name is what will show when you are managing your cards.

The `type` value of the config tells Magic Cards what kind of Action it is. When processing the card scan, Magic Card hands the whole configuration of your action to the Action processor and uses all of it's values. So, here is where you can configure exactly how the action will work.

## Sonos

Sonos is probably the best whole home audio system you can get if you're into any kind of automation. It's stable, works great, and open enough that you can control it locally :metal:

The Sonos action utilizes another open source project to talk to your Sonos and tell it what to play. In order to use the Sonos action, you'll have to have the [Sonos HTTP API](https://github.com/jishi/node-sonos-http-api) set up. If you have another home server you use for automation or what not, I'd suggest you just run it there. If you use Docker, it's as easy as starting up [this container](https://hub.docker.com/r/chrisns/docker-node-sonos-http-api/).

**Protip**: You can use the [magic-cards-docker](https://github.com/maddox/magic-cards-docker) project to get Magic Cards and Sonos HTTP API up and running all at once. This uses Docker to simply load both projects at once. Easy peasy.

### Sonos Action Configuration

The Sonos action is quite customizable. Here's an example of the config:

```json
{
  "type": "sonos",
  "host": "192.168.1.50",
  "port": "5005",
  "username": "myname",
  "password": "mypassword",
  "room": "Living Room",
  "playlist": {
    "shuffle": "on",
    "repeat": "all"
  },
  "album": {
    "shuffle": "off",
    "repeat": "none"
  },
  "song": {
    "shuffle": "off",
    "repeat": "one"
  }
}
```

The `host`, `port`, `username`, `password` are for your node-sonos-http-api install.

`room` allows you to tell Magic Cards which Sonos speaker you want to start playing music on. `room` is case sensitive.

The next few config options let you tell Magic Cards what kind of play style to be set when that type of content is started.

#### Spotify

If you want to queue Spotify music, you'll need to get a `Client ID` and `Client Secret` from Spotify and add it to the configuration of Sonos HTTP API. That's how it's able to look up and queue music from Spotify. You can read more about how to get these in the [configuration documentation](install.md#spotify). Once you get those, you can use them for Magic Cards and for Sonos HTTP API's settings. Read about that [here](https://github.com/jishi/node-sonos-http-api#settingsjson).

### Sonos URI

The Sonos action uses the Sonos HTTP API project to talk to your Sonos speaker. The Sonos Action uses path fragments that are eventually used to create API endpoints to communicate with Sonos HTTP API. If you're just creating albums and using [Quick Fill](cards.md#quick-fill), Magic Cards takes care of all of this for you. But if you want to get fancy, you can do even more with the URI.

#### Endpoint Creation

Magic Cards takes the host you provided in your Sonos action config, and pieces it together with your URI to talk to Sonos HTTP API. For example, if you want to queue a Sonos favorite, you can use `favorite/Salsa` for your URI. The action will then join the host, port, room name, and the URI. So:

`host`: 192.168.1.150  
`port`: 5005  
`room`: Kitchen  
`uri`: `favorite/Salsa`

will output...

`http://192.168.1.150:5005/Kitchen/favorite/Salsa`

...which will queue your Salsa Sonos favorite.

You could even make a card that pauses the music using the URI `pause`. It can be as simple or as powerful as you want.

Learn about creating [Presets](https://github.com/jishi/node-sonos-http-api#presetsjson-deprecated-use-preset-files-instead) and [queueing directly from streaming services](https://github.com/jishi/node-sonos-http-api#spotify-apple-music-and-amazon-music-experimental).

Just remember, the URI is completing the API endpoint. You can do anything that Sonos HTTP API supports.

Note: Sonos URIs need to be URL encoded. Ex: `favorite/Cooking%20Music`.

## Home Assistant

If you have [Home Assistant](https://home-assistant.io) set up at home, integrating with it is super simple.

The Home Assistant action simply pushes the event `magic_card_scanned`. All you have to do is set up an automation that uses that event as a trigger.

Magic Cards delivers all of the card's properties in the event data payload prefixed with `card_` when it pushes the events, so they're available to you in your automation. Use `trigger.event.data` in your automation templates to get the data. Ex: `trigger.event.data.card_uri`, `trigger.event.data.card_title`.

### Card URI

When you're creating Home Assistant cards, you can send serialized data to your automations with the card's URI property.

Your automation can use this information in the way it needs, to do the thing it needs to do.

### Example Automation

Heres an example automation that is only triggered if the type of card is an `album`. Once triggered, it reads the URI from the event data.

In this example, the URI of the card sent is: `office_music|Maddox Music`

```yaml
automation:
  - alias: Play favorite from Magic Cards
    trigger:
      - platform: event
        event_type: magic_card_scanned
        event_data:
          card_type: album
    action:
      - service: media_player.select_source
        data_template:
          entity_id: "media_player.{{ trigger.event.data.card_uri.split('|')[0] }}"
          source: "{{ trigger.event.data.card_uri.split('|')[1] }}"
```

When triggered, this automation reads from the card's URI property and uses the first part to set the entity id of the media player that will be used. It uses the second part as the name of the source that should be played.

### Home Assistant Action Configuration

The Home Assistant configuration is pretty simple. Just point it at your Home Assistant insall, and boom.

```json
{
  "type": "home_assistant",
  "host": "192.168.1.50",
  "port": "8123",
  "ssl": false,
  "password": "hapassword"
}
```

## Channels

[Channels](https://getchannels.com) is an app that lets you watch live TV with cable or internet. It runs on Apple TV, Android TV, and Fire TV.

Using it's [API](https://getchannels.com/api), Magic Cards can make it change channels or, if you're a [Channels DVR](https://getchannels.com/dvr) subscriber, start playing back any recording.

This is great for movies for kids. Let them just scan a card and their favorite movies instantly start playing!

### Channels Action Configuration

The Channels configuration is pretty basic. Point it at the device that Channels is running on that you want Magic Cards to control, and voila.

```json
{
  "type": "channels",
  "host": "192.168.1.120",
  "port": "57000"
}
```

### Channels Action URI

When your card has a content type of `Channel`, use the channel number for its URI. The Channels action will then use it when changing channels.

ex: `12.1`

If your card has a content of `Movie` or `Show`, use the ID of the recording in your Channels DVR library. You can find this ID by clicking on a movie or recording in the Channels DVR web admin.

ex: `4021`

## Scripts

If the existing Actions don't help you make Magic Cards useful, you can use the Script Action to have Magic Cards run custom scripts.

This is useful if you want something to happen on the Pi itself, or you just want to integrate with another service.

### Script Action Configuration

Configuring a custom script action is as simple as providing the name of the file.

```json
{
  "type": "script",
  "filename": "test.sh"
}
```

All custom scripts need to be placed in the `/config` directory.

When run, your script will receive all of the properties of your card as environment variables. You can use them like `$CARD_TITLE`, `$CARD_URI`, etc.
