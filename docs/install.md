# Install Magic Cards!

Magic Cards isn't terribly hard to set up, but there's some assumptions made for the project. It's assumed that you're running it on a Raspberry Pi.

Magic Cards will only run on Linux due to how it listens for input from the card reader.

* [Prerequisites](#prerequisites)
* [Standalone or Docker](standalone-or-docker)
* [Docker Install](docker-install)
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

## Standalone or Docker

Magic Cards can be run standalone on your Pi or with a Docker container. The choice is yours. I highly suggest you just use Docker though. It means you don't have to do anything to get your environment right.

Protip: If you want to get up and running with Magic Cards and Sonos the fastest, you could use the [magic-cards-docker](https://github.com/maddox/magic-cards-docker). This is a repo that combines Magic Cards and the project that powers Sonos queueing all in one.

## Docker Install

Installing using Docker is the easiest path. You'll need to make sure you have Docker installed on your Pi first.

### Install Docker

Installing Docker is as easy as a couple of commands:

```bash
curl -sSL https://get.docker.com/ | sh
```

Once it's installed, run this command so your `pi` user can use Docker.

```bash
sudo usermod -G docker pi
```

Log out of your Pi and back in so your user has permissions to use Docker.

### Run Container

To run the Docker container, you need to do a couple things first. Create a directory for it to run in, set up your configuration, and then run the command to load up the container.

```bash
mkdir magic-cards
cd magic-cards
mkdir config
cd config
```

After that, you should be in the `config` directory. Read the [standalone docs](#configure) to learn how to configure Magic Cards.

Once you've set up your configuration, just load the Docker container:

```bash
docker run \
  --name magic-cards \
  --restart=always \
  -d \
  -p 5000:5000 \
  -v `pwd`/config:/usr/src/app/config \
  --device=/dev/input/event0 \
  jonmaddox/magic-cards
```

This will download, build, and run the container and pass in your `config` directory so it knows how to run. You may need to edit the `device` param to properly map to the input device Magic Cards will be reading from for your card reader. You can read about that in the [standalone docs](#configure).

After that, the container will start up. It may take a little bit. It's just a little Raspberry Pi after all.



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

#### Spotify

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
