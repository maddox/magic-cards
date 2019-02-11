# Changelog
All notable changes to this project will be documented in this file.

## [1.1.4] - 2019-02-11
### Improved
- Magic Cards now supports authenticating Home Assistant using long lived access tokens.

## [1.1.3] - 2018-10-19
### Improved
- Magic Cards now defaults to the `/queue/` command when auto generating a card. This fixes an issue where the `/now/` command advanced one track in the queue when queueing and playing.

## [1.1.2] - 2018-05-16
### Improved
- Magic Cards will now force your Sonos player to play from the queue after scanning if it was previously playing a radio station.

### Fixed
- The client web app is now pinned to node version `9.11.1` and the Docker container uses that version of node as well.

## [1.1.1] - 2018-04-18
### Improved
- Sonos queue is cleared before queuing music.

### Fixed
- `repeat` and `shuffle` settings for Sonos Actions actually work now.

## [1.1.0] - 2018-04-17
### Added
- `room` parameter to general config. [Documentation](/docs/install.md#room).

### Changed
- Card properties are now prefixed with `card_` for the Home Assistant Action.

## [1.0.0] - 2018-04-09
### Added
- Initial Release
