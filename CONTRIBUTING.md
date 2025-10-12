# Contributing Rules

[**Global Contributing Rules**](https://github.com/INeedJobToStartWork/INeedJobToStartWork/tree/main/other/contribute/CONTRIBUTING.md) - Here you can find general contribution guide for most of [INEEDJ](https://github.com/INeedJobToStartWork) projects.

## Local contributing rules

### Ink Version

Currently we are using Ink version `5.x` and we will not update it to `6.x` or higher until `ink-testing-library` will support it.

### Why There is no different actions between Backspace and Delete?

Ink version `5.x` and current version `6.x` (state at 12.10.2025) do not support `DECBKM`.
It makes much harder to implement `Backspace` and `Delete` keys and use as we expect on Windows Terminals and others which support `DKB`.
