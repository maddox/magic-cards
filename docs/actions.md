# Actions!

Actions. This is where the magic happens. Magic Card has core actions that process your card and do things.

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

Explanation about each type can be found below. But what's most important right now is how they're defined. Each action has a name for a key, with it's configuration as a value. The name is what will show when you are managing your cards.

The type value of the config tells Magic Cards what kind of Action it is. When processing the card scan, Magic Card hands the whole configuration of your action to the Action processor and uses all of it's values. So here is where you can configure exactly how the action will work.

## Sonos

Sonos is probably the best whole home audio system you can get, if you're into any kind of automation like this. It's stable, and open enough that you can control it locally :metal:

The Sonos action utilizes another open source project to talk to your Sonos and tell it what to play. In order to use the Sonos action, you'll have to have the [Sonos HTTP API](https://github.com/jishi/node-sonos-http-api) set up. If you use Docker, it's as easy as starting up [this container](https://hub.docker.com/r/chrisns/docker-node-sonos-http-api/).

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

The host, port, username, password should be self explanatory.

`room` allows you to tell Magic Cards which room you want to start playing music on. `room` is case sensitive.

The next few config options let you tell Magic Cards what kind of play style to be set when that type of content is started.

## Home Assistant

If you have [Home Assistant](https://home-assistant.io) set up at home, integrating with it is super simple.

The Home Assistant action simply pushes the event `magic_card_scanned`. All you have to do is set up an automation that uses that event as a trigger. Magic Cards delivers all of the card's properties when it pushes the events, so they're available to you in your automation.

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
          type: album
    action:
      - service: media_player.select_source
        data_template:
          entity_id: "media_player.{{ trigger.event.data.uri.split('|')[0] }}"
          source: "{{ trigger.event.data.uri.split('|')[1] }}"
```

When triggered, the automation reads from the URI property and uses the first part to set the entity id of the media player that will be used. It uses the second part as the name of the source that should be played.

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
