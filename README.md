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
