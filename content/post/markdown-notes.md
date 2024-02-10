---
title: "Markdown Notes"
description: "How I keep my notes organized"
date: 2017-07-16
tags:
  - productivity
---

**tl;dr; markdown files + file syncing + built-in OS file searching = easy organized notes**

I've been doing more devops work the last couple years,
which requires a broader and shallow level of knowledge vs. writing code in one or two languages for months at a time.

Because of the dozens of tools I need to juggle, because I forget things, and because I forget things, keeping good notes is essential.

I'm surprised at how many programmers don't keep any notes at all, so hopefully this will convince a couple people to invest a little in their flow.
Thanks to [Ted Naleid](http://naleid.com/) for showing me his workflow; it motivated me to properly organize my notes.

# History

I've used a few different combination of styles for keeping programming notes over the years:

- whatever notepads were available in the office supply cabinet
- moleskine notebook + space pen during my hipster Getting Things Done phase
- .txt files semi-randomly organized on my computer
- various notes programs like OneNote, Evernote, and Google Keep


I've never been content with any of them.  None of them had all these features:

- easy
- fast
- copy/pasteable
- reliable
- flexible
- durable
- portable


Here's what works for me:

# Step 1 - Choose Your File Format
I use markdown.  I would suggest that unless you really like some competing but similarly simple format.
Don't use a binary format.
Don't use HTML.
Don't use a format that will be hard to programmatically convert from ten years from now when it becomes obsolete.

# Step 2 - Choose Your File Syncing Tool
I use dropbox, and keep my notes in `/Dropbox/code/notes`.

# Step 3 - Organization
Now it's just a matter of creating your files and filling them up as you go along.
I have a file per tool or concept, and keep project-specific notes in their folder. e.g.:
``` bash
➜  notes tree
.
├── cassandra.md
├── consul.md
├── curl.md
├── docker.md
├── drone.md
...
├── linux-debugging.md
...
├── weatherbane
    ├── weatherbane-notes.md
...
```

# Step 4 - Workflow Notes
I can usually remember the name of the file I want to open, and that's how I usually access the files.
e.g. with Alfred on OS X, where Cmd-Space is the hotkey to bring up the search box:
_Cmd-Space_ `open postg` and then the tool will autocomplete to postgres.md, and I'll hit enter to open the file in my favorite text editor.

On my Android phone, I use JotterPad to view and (rarely) edit notes.


# More Ideas
https://www.reddit.com/r/archlinux/comments/3a0ibj/notetaking_and_markdown/
http://lifehacker.com/5943320/what-is-markdown-and-why-is-it-better-for-my-to-do-lists-and-notes
