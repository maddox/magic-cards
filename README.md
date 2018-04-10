<div align="center">
<img src="/docs/images/logo.png" width="300px">
</div>

<br>

Magic Cards merges the physical world with the digital world. It lets you create RFID scannable cards that you can program to do anything.

* Start playing music
* Play a movie
* Tune to a TV channel
* Unlock your back door

## How does it work?

RFID cards each have a unique ID. These cards are cheap, inkjet printable, and the card readers cost about $10. Magic Cards lets you create cards with art, titles, and actions that happen when the specific cards are scanned.

Magic Cards runs on a simple Raspberry Pi Zero with an RFID card reader plugged in. It gives you a full management console to create and manage all of your cards. It listens in the background for a card scan and when it sees one, it looks up that card and processes the action you defined for it.

While this is still very much a DIY project, the hopes of Magic Cards is that it makes it much more manageable and fun!


![](/docs/images/cards-shot.png)

## What can it do?

Magic Cards lets you program cards to start music on [Sonos](https://sonos.com), trigger an event on [Home Assistant](https://home-assistant.io), change a channel or play a recording with [Channels](https://getchannels.com), or run your own specific script.

This isn't all. Magic Cards makes it easy to add more actionable platforms for the future. Pull Requests welcome!

<div align="center">
<a href="https://sonos.com"><img src="/docs/images/logos/sonos.png" height="100px"></a> &nbsp;&nbsp;
<a href="https://home-assistant.io"><img src="/docs/images/logos/hass.png" height="100px"></a> &nbsp;&nbsp;
<a href="https://getchannels.com"><img src="/docs/images/logos/channels.png" height="100px"></a>
</div>


## Why?

You might be wondering why you would want to bring back physical media after finally ridding ourselves of all of it.

Why use these physical cards when we can start music just by using our voice now. Well, why not both?

Yes, physical media had its downsides. You had to store it, get up to play it, and it would get damaged. And digital media is transparent, accessible from almost anywhere, and never wears out.

Ridding our world of physical media ends up having quite a few drawbacks:

* Browsing or picking music from 10m available albums creates a paradox of choice.
* Scrolling through huge libraries on a glass screen isn't really that fast and it definitely doesn't feel that great.
* Voice queuing is great, if you can remember or even KNOW what you want to listen to.
* Some members of the household (mainly kids) get completely left out of the experience. They have no means to play something.

Having a subset of your favorite music or movies ends up being a really great way to pick something to put on. Our brains are faster than any scrolling list of album covers. Physically holding and sifting through music/movies ends up being way faster.

As our media leaves the physical space and enters the digital space, kids start to get left out. They have no books to pull off a shelf and sift through. They have no music to browse and experiment with listening to. These things are important for growing up. Checking out your parents' music is part of growing up!

And for the little ones, this gives them a real way to put music on themselves.

Magic Cards lets you marry what's great about physical media with what's great about digital media.

![](/docs/images/cards-fanned.jpg)

## Setup

You can find more information about installation and how to use Magic Cards in the [documentation](/docs).

## Community

Check out the Magic Cards community on Spectrum. Chat about cool tricks or visit for some troubleshooting.

[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/magic-cards)


## Contributions

Find a bug, or want to add a new action? Contributions are very welcomed!

* Fork the repo
* Create a feature branch
* Open a Pull Request

## Attributions

None of this would exist without [@fsahli](https://github.com/fsahli) and [@hoveeman](https://github.com/hoveeman)'s [music-card](https://github.com/hoveeman/music-cards) project. [@hoveeman](https://github.com/hoveeman)'s [YouTube video](https://www.youtube.com/watch?v=AvCseOQidSw) inspired all of this. Thanks [@hoveeman](https://github.com/hoveeman)!


## To Dos

Magic Cards is pretty fun, but there's some other things I'd love for it to do eventually. Pull Requests very much welcomed!

- [ ] Ability to print cards directly from Magic Cards.
- [ ] Kodi support
- [ ] Direct Chromecast support

Some of these can be done by integrating with Home Assistant, but not everyone has Home Assistant set up.
