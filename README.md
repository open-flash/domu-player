<a href="https://github.com/open-flash/open-flash">
    <img src="https://raw.githubusercontent.com/open-flash/open-flash/master/logo.png"
    alt="Open Flash logo" title="Open Flash" align="right" width="64" height="64" />
</a>

# Doμ Player

The **Doμ Player** (_domu player_) is a web-based player for SWF files.

It is part of the [Open Flash][ofl] project.

It is intended as a successor to Mozilla's [Shumway][shumway].

See the [demo page](https://open-flash.github.io/domu-player/).

## Features

**This project is still a prototype.** There are no stability or feature guarantees.

The player can currently play simple animation and has initial support for Actionscript 2 bytecode.

## Usage

### Custom tag

The simplest way to use the Doμ Player is through the `<x-swf>` custom tag. Add the lib script to
your page and use the following code:

```html
<x-swf src="movie.swf" width="550" height="400"></x-swf>
```

The will create a custom element mimicking the behavior of `<embed>`.

### Manual

The _custom tag_ approach uses the default renderer, scheduler, etc. You can gain greater control
over how you create your player by instanciating it manually with the `createDomuPlayer` function.

[shumway]: https://github.com/mozilla/shumway
[ofl]: https://github.com/open-flash/open-flash
