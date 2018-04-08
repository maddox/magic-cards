## Magic Cards


### Home Assistant

```yaml
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


### Docker

Create your config directory.

```bash
mkdir config
```

Create an `actions.json` file based on `config/actions.example.json` in this project.

Boot up the docker container.

```bash
docker run \
  --name magic-cards \
  --restart=always \
  -d \
  -p 5000:5000 \
  -v `pwd`/config:/usr/src/app/config \
  -v /dev/input:/dev/input \
  maddox/magic-cards
```
