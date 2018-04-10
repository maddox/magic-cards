# Hardware Requirements!

While Magic Cards is just software, the magic comes from the hardware you set it up on.

Magic Cards was designed to run on a Raspberry Pi Zero with a simple RFID scanner attached. But you also need some cards and a way to print those cards.

Here's what you need to get started.

* [Raspberry Pi + RFID Reader](#raspberry-pi--rfid-reader)
* [Programming the Reader](#programming-the-reader)
* [Cards & Printing](#cards--printing)

## Raspberry Pi + RFID Reader

Raspberry Pis Zeros are cheap. You can get them some places for just $10. But if you want to get it fast, you can get a kit that includes a power adapter and case from [Canakit on Amazon](https://amzn.to/2GLPDde) for $25.

The RFID card reader used to make this project is [this one](https://amzn.to/2GLiKO5). It's probably best to stick with it. Yours for the low price of $11.

If you're using a Raspberry Pi Zero, you'll need to get an [OTG USB cable](https://amzn.to/2uWiOZX). And don't forget a micro SD card for the Pi.

<div align="center">
<a href="https://amzn.to/2GLPDde"><img src="https://images-na.ssl-images-amazon.com/images/I/91uW4T%2BbuqL._SL1500_.jpg" height="200px"></a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://amzn.to/2GLiKO5"><img src="https://images-na.ssl-images-amazon.com/images/I/61gh-9A9smL._SL1500_.jpg" height="200px"></a>
</div>

Protip: buy a second scanner to keep plugged into your computer so you can just manage all your cards from your browser. That's what makes Magic Cards so great.

## Programming the Reader

One little gotcha is that your RFID card reader will be delivered in an incompatible mode. You're going to need to reprogram it to output in a different format.

You will need a Windows computer to do this. VMWare or Parallels won't work. They see the reader as a normal keyboard and not a programmable USB device. (Open an issue if you do get this to work somehow.)

You'll need to download [this software](https://www.dropbox.com/s/ena4ukh9wewhj9x/rfid-reader-programmer.zip?dl=0). Just plug the card reader into the Windows computer, open the software, and configure it according to the screenshot below.

![](/docs/images/card-programmer.png)

Click `Set` to write the config to the card reader. It takes about 1 second to do it. Once you've done this, it's good to go forever.


## Cards & Printing

Once you have your Pi set up, you'll need cards. You can get a set of 50 from [Brainstorm ID](https://brainstormidsupply.com) through [Amazon](https://amzn.to/2GHk9sZ). Or, order directly from their site.

In order to print the cards on a printer, you'll need a special tray. Not all printers support them. The makers of the printable cards, Brainstorm ID, [makes and sells trays](https://brainstormidsupply.com/inkjet-id-cards/printer-trays).

Be sure you get the right tray for your printer. If your printer doesn't support this type of printing, you can use their page to see which printers do support it.

I'm personally using [this printer](https://amzn.to/2GLn13T) and [this tray](https://amzn.to/2GHkUSR).

<div align="center">
<a href="https://amzn.to/2GHk9sZ"><img src="https://images-na.ssl-images-amazon.com/images/I/61%2BAvp0mCBL._SL1024_.jpg" height="200px"></a> &nbsp;&nbsp;&nbsp;
<a href="https://amzn.to/2GHkUSR"><img src="https://images-na.ssl-images-amazon.com/images/I/61FzcmJTk1L._SL1498_.jpg" height="200px"></a> &nbsp;&nbsp;&nbsp;
<a href="https://amzn.to/2GLn13T"><img src="https://images-na.ssl-images-amazon.com/images/I/61NNyBDr1gL._SL1000_.jpg" height="200px"></a>
</div>

### Canon Printing Protip

Here's a protip if you use macOS and get the suggested Canon printer. Get [these drivers](https://support.apple.com/kb/DL1928?locale=en_US) from Apple so you can AirPrint and still use the special tray. The drivers currently on macOS don't include it. You'll need to install them, then add your printer. Pick your printer and then pick it again from the `Use` select box:

![](https://user-images.githubusercontent.com/260/38050246-5a074950-3298-11e8-8ff6-e2e920ff2238.png)
