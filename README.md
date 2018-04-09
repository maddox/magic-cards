<div align="center">
<img src="/docs/images/logo.png" width="300px">
</div>

<br>

Magic Cards merges the physical world with the digital world. It lets you create RFID scannable cards that you can program to do anything with.

* Start playing music
* Play a movie
* Tune to a TV channel
* Unlock your back door

## How does it work?

RFID cards each have a unique ID. These cards are cheap, inkjet printable, and the card readers cost about $10. Magic Cards lets you create cards with art, titles, and actions that happen when the specific cards are scanned.

Magic Cards runs on a simple Raspberry Pi Zero with an RFID scanner plugged in. It gives you a full management console to create and manage all of your cards. It listens in the background for a card scan and when it sees one, it looks up that card and processes the action you defined for it.


![](/docs/images/card-shot.png)

## What can it do?

Magic Cards lets you program cards to start music on Sonos, trigger an event on Home Assistant, change channels or start a recording with Channels, or run your own specific script.

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

## Setup

You can find more information about installation and how to use Magic Cards in the [documentation](/docs).

## Contributions

Find a bug, or want to add a new action? Contributions are very welcomed!

* Fork the respo
* Create a feature branch
* Open a Pull Request


## To Dos

Magic Cards is pretty fun, but there's some other things I'd love for it to do eventually. Pull Requests very much welcomed!

- [ ] Ability to print cards directly from Magic Cards.
- [ ] Kodi support
- [ ] Direct Chromecast support

Some of these can be done by integrating with Home Assistant, but not everyone has Home Assistant set up.
