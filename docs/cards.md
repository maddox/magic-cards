# Cards!

The core to all of Magic Cards is...the cards! Read below to learn how to create cards in Magic Cards.

* [Creating Cards](#creating-cards)
* [Managing Cards](#managing-cards)
* [Testing Cards](#testing-cards)
* [Printing Cards](#printing-cards)


## Creating Cards

Creating a new card is as easy as clicking the Add Card button in the top right corner. This will open a form to let you add all of the information that a card needs.

All cards have these properties:

* Content Type
* Action
* Title
* Subtitle
* Art URL
* Card Code
* URI

![](/docs/images/quick-fill.gif)

### Quick Fill

If you're creating cards for Apple Music or Spotify, you can simply paste the url in the field at the top of the form. Magic Cards will read it and automatically populate the card with the data it needs.

\*Quick filling with Spotify URLs requires you to set it up appropriatly. Learn how to do that in the [configuration documentation](/docs/install.md#configjson).


### Content Type

Cards represent different types of media, or even an `event` type. The types are:

* Album
* Song
* Playlist
* Station
* Movie
* Show
* Channel
* Event

These types are used by the built in actions and can be helpful if you're handling the action yourself in something like Home Assistant or a custom script.

### Action

Action defines what the card should do when it gets scanned. Magic Cards lets you define your own actions that are based on the built in Action handlers. This way you could say, have multiple script actions available for your cards.

You can learn more about Actions in the [Actions documentation](actions.md).

### Title, Subtitle, and Art URL

These should be obvious. If you leave off a subtitle, it won't show. Art URL is the url for the cover art that you want on the card.

### Card Code

The card code is the actual unique code on the physical RFID card you want to map to the card. RFID card readers show up as simple keyboards to computers.  Once you've created your card, just focus the Card Code input and scan your card and the code will be entered automatically.

**Protip**: buy a second scanner to keep plugged into your computer so you can just manage all your cards from your browser. That's what makes Magic Cards so great.

### URI

URI communicates exactly what to do to the Action that processes the card scan. URI can be anything you want. But some actions expect specific types of URIs.

The Sonos action expects a specific format for music. If you're using the Home Assistant action, you can pick your own URI, but this will be what you use to communicate to Home Assistant what to do with the card that has been scanned. The same goes for the Script Action. Fill the URI with data that you can do something with later when processing it.

## Managing Cards

Any time you want to edit a card, just click it and update any of its fields.

If you want to delete the card, you can click the delete button badged on the top right of the card that shows up after hovering over it.

## Testing Cards

After creating a card, you can simply test it by clicking the play button badged on the top left of the card that shows up after hovering over it.

This makes it real easy to make sure the card will do what it's supposed to when scanned.

## Printing Cards

Magic Cards doesn't have the ability to print cards directly. But, [Brainstorm ID](https://brainstormidsupply.com) the company that sells the inkjet cards has some [great guides and tutorials on doing it](https://brainstormidsupply.com/guides-videos-tutorials/).

They provide [lots of templates](https://brainstormidsupply.com/learning-center/inkjet-pvc-cards-help.html) for different printer configurations and even [a nice PDF generator](https://brainstormidsupply.com/id-card-printing-layout-tool.html) that you can just add card images to and get a ready to print document.
