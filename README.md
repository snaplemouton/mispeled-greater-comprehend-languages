# Mispeled’s Greater Comprehend Languages

**Mispeled’s Greater Comprehend Languages** is a Foundry VTT module that adds immersive, language-based roleplay to chat.

Using the `/gcl` command, characters can speak in a specific language. Non-speakers see a believable, stylized gibberish version of the message, while characters who know the language receive the original message privately via whisper.

## Features

- `/gcl` slash command for language-based speech
- Public chat messages rendered as language-flavored gibberish
- Automatic private whispers of the original message to fluent characters
- Default gibberish algorithm with support for custom language styles (Currently only Elven and Dwarven)
- Designed for immersive roleplay and narrative-heavy games
- Optional **Comprehend Languages** status effect:
  - Allows a character to understand all `/gcl` speech regardless of known languages
  - Can be toggled via the `/bcl` command or directly from the token status effect UI

---

## Commands

### `/gcl <language> <message>`

Sends a message spoken in the specified language.

- Characters who understand the language receive the original message in a private whisper.
- Characters who do not understand the language see a stylized gibberish version.

Using curly brackets `{}` in a message will protect words from being turned into gibberish.

**Example**
`/gcl Elvish We do not like Dwarves here in {Elvandar}.`

Public chat output:
`Fa ia fon hume Nilorhl fias fa Elvandar.` 

Whispered to fluent characters:
`[Elven] We do not like Dwarves here in Elvandar.`

---

### `/bcl`

Toggles the **Comprehend Languages** status effect on the actor.

While active, the character understands all `/gcl` speech, regardless of known languages.

The status effect can also be toggled manually from the token status effect menu.

---

## Status Effects

This module registers a custom status effect for **Comprehend Languages**:

- The status effect serves as a flag for the `/gcl` command
- It is displayed on the token like any other Foundry status effect
- No permanent changes are made to the actor

---

## Compatibility

- Foundry VTT v13
- Pathfinder 1e
- System-agnostic by design (language handling is module-driven)

## License

MIT License
