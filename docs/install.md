# Install Magic Cards!

Magic Cards isn't terribly hard to set up, but there's some assumptions made for the project. It's assumed that you're running it on a Raspberry Pi.

Magic Cards will only run on Linux due to how it listens for input from the card reader.

* [Prerequisites](#prerequisites)
* [Install](#install)
* [Configure](#configure)
* [Start it up](#start)
* [Stop & Restart](#stop--restart)
* [Upgrade](#upgrade)

## Prerequisites

You should have a Raspberry Pi already flashed and ready to install software on with SSH access. Magic Cards was developed for a Raspberry Pi Zero W, but it should work on anything newer than the original Raspberry Pi. The Pi will of course need to be connected to your network.

### Git

You should have the git source control system installed so you can pull down the code and upgrade it later.

You can install it with:

```bash
sudo apt-get install git
```

### Node.js & Yarn

Magic Cards is written in Node.js. It starts as 2 processes. The server that lets you manage the cards and the scanner that listens for card scans.

You'll need to have node and yarn installed on your Pi before you start setting up Magic Cards.

If you don't have Node or yarn installed, here's some simple instructions. Using [this repo](https://github.com/sdesalas/node-pi-zero), you can get node installed with a single command:

```bash
wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v9.8.0.sh | bash
```

After you have node installed, edit your `~/.profile` file to add:

```bash
export PATH=$PATH:/opt/nodejs/bin
```

This will add support for node CLI tools, like yarn.

Finally, if you don't have yarn installed, install it:

```bash
npm install yarn -g
```

You should be all set up to get Magic Cards running now.

## Install

Follow these steps to get Magic Cards running on your Pi.

### Pull down the code

You should pull Magic Cards down from GitHub into your Pi's home directory.

```bash
cd ~
git clone git@github.com:maddox/magic-cards.git
cd magic-cards
```

### Set Up Magic Cards

Magic Cards comes with a bunch of easy scripts that you can use to manage it. Start by setting it up.

```bash
script/setup
```

This will fulfill all the dependencies of the project and build it. It will take a little bit of time depending on the Raspberry Pi you're running it on.

## Configure

Once you have Magic Cards set up, you need to configure it a little bit.

### actions.json

In the `magic-cards` directory, there's a `config` directory. Open it and create an `actions.json` file so you can add the Actions your cards will use.

Learn more about configuring Actions with the [Actions documentation](actions.md).

### config.json

This is the main configuration file. You'll need to edit a few things. Here's an example version of the file:

```json
{
  "input_device": "event0",
  "spotify": {
    "clientID": "XXX",
    "clientSecret": "XXX"
  }
}
```

You need to define which input device that Magic Cards uses to detect card scanning. If the only thing you have plugged into the Pi is the scanner, more than likely it'll be `event0`. Otherwise you'll have to determine which device it is by looking in the `/dev/input` directory on your Pi.

The Spotify settings have to do with the [Quick Fill](cards.md#quick-fill) feature for creating cards. Magic Cards can populate your cards via Spotify URLs, but in order to do it, it needs to use the API. The API requires credentials to be used.

This seems like a pain, but it's as easy as going to Spotify's [Developer Dashboard](https://beta.developer.spotify.com/dashboard/applications). Just log in, and click `Create a Client ID`. It will walk you through everything. When you're done, you'll have the Client ID and Client Secret that you need for Magic Cards. Enter them into your `config.json` and Magic Cards will then be able to populate your cards automatically with a URL.

## Start

Once you've configured Magic Cards, you can start it up.

```bash
script/install
```

This will start Magic Cards and set it up to run automatically on boot.

Voila! It should be running.

Visit port 5000 on the IP address of your Pi to see it in action and start creating cards.

## Stop & Restart

There are some convenience scripts to let you stop and restart Magic Cards.

```bash
script/stop
script/restart
```

Protip: You don't have to restart Magic Cards if you edit your Actions configuration.

## Upgrade

If you ever need to upgrade Magic Cards, you can simply do it with:

```bash
script/upgrade
```

This will pull down the newest code from GitHub, rebuild it, and restart it.
