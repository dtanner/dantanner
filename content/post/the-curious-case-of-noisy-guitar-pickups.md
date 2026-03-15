---
title: "The Curious Case of Noisy Guitar Pickups"
description: "Some things I learned about sources and solutions of interference"
date: 2026-03-15
draft: false
tags:
  - music
  - experiments
  - home
---

Wanna hear the most annoying sound in the world?

<audio controls preload="metadata">
  <source src="/pickup-hum/hum.m4a" type="audio/mp4">
</audio>

That's the sound of a guitar pickup affected by a horrendous amount of interference, and this made recording guitars in my home studio nearly impossible.

I finally fixed the issue after what seemed like forever, and the root cause was not at all obvious to me.
It doesn't help that the internet is filled with gobs of misinformation. The problem is that there are different types and sources
of interference.

I'm not an expert on this, but I learned a lot on the journey to fix my problem. The intent of this article is to share a little of what I
learned to help others more quickly fix their situation.

## Interference sources and solutions

<img src="/pickup-hum/sources-and-solutions.svg" alt="Interference sources and solutions" style="width:100%; height:auto; max-width:900px;">

If interference is caused by a _magnetic_ field (power lines, transformers, dimmers), the amount of hum changes based on which way the guitar is facing. When pointed at the source of the interference, the hum will be quietest.
The symptom for power line interference will be a steady hum starting at 50 or 60 hz with interference at multiples of that frequency (e.g. for 60 hz power sources, you might see interference spikes at 120 hz, 180, 240, etc... up to a few thousand hz).

If interference is an _electric_ field (radio waves, Wi-Fi, etc...), the symptoms will often be sporadic interference in higher
frequencies.

When interference is caused by a magnetic field, shielding (copper tape and conductive paint) won't help at all. Those waves go right
through shielding. Buying a filter won't help either, because that's a line source of interference.
I learned all this the hard way, buying equipment and trying solutions that didn't help at all.

This is why it can be so frustrating when people on forums confidently give wrong advice in response to "halp i have hum".

## My problem

That audio clip of the interference was recorded through a P90 guitar pickup going into an otherwise quiet amp setup.
You might think, "that's what humbuckers are for" but even humbuckers were affected to the point of causing real problems:

<audio controls preload="metadata">
  <source src="/pickup-hum/humbucker.m4a" type="audio/mp4">
</audio>

After hours of investigation and failed experiments spanning weeks, I eventually found the primary source of my interference:

**The grounding wire connected between my water main and power panel.**

My home's electrical grounding system uses the incoming water main as a grounding electrode. This is code compliant even though it seems like a bad idea; every house whose plumbing connects to the same water infrastructure might be dumping ground current into those pipes.

The tool I used to find the problem was a [Trifield TF2 EMF](https://trifield.com/products/trifield%C2%AE-emf-meter-model-tf2). It has sensors
for magnetic, electric and radio frequency sources. In my case, the magnetic interference sensor was the useful gauge.

Some levels I measured:

| Location                     |    Level |
|------------------------------|---------:|
| Studio                       |      0.9 |
| Transformer at street        |       15 |
| Phone junction box at street |        3 |
| Other locations in my house  | 0.2 - 10 |

Here's the grounding wire connected to my water main:
![](/pickup-hum/ground-wire.jpeg)

And here's the level for it (it ended up being measured at 1200 mG):
![](/pickup-hum/meter-on-wire.jpeg)

An article by Charles Keen of [EMF Services](https://emfservices.com/ground.htm) gave me the idea to look at the grounding wire.
I was lost without that hint because the grounding wire runs in my walls to the electrical panel and created
multiple sources of interference that threw me off. That happened to be in the wall next to my studio, which was by far the largest source
of interference. But other parts of my house also had problematic interference levels because they were near...plumbing! Which was not
something I would've thought would be connected to an electrical problem.

Charles then connected me with a local EMF specialist, Nate Johnson at [New Light EMF](https://www.newlightemf.com), who confirmed the issue
and gave me detailed instructions on how to fix it safely. Basically, the fix for this problem was to break the electrical connection in my plumbing
near the main and install grounding rods outside connected to the panel. The grounding rods are needed to replace the plumbing as a
grounding solution.
I hired this out; don't do this yourself unless you're qualified. Even the plumbing work can kill you if you disconnect the pipe and
complete the circuit with your body.

![](/pickup-hum/pex.jpeg)

Here's the level in my studio now:

![](/pickup-hum/normal-level.jpeg)

And here's how things sound now &#128558;&#8205;&#128168;:

<audio controls preload="metadata">
  <source src="/pickup-hum/quiet.m4a" type="audio/mp4">
</audio>

### Bonus: Dimmer switches

Another thing I learned along the way was that dimmer switches are a common source of magnetic field interference.
The amount of interference they caused wasn't anywhere near the amount caused by the grounding wire, but it was noticeable.

If you can avoid using dimmer switches or ensure they're off when you're recording, that's the cheapest and simplest solution.
That's not practical in my situation, so there's a pretty good solution in using a different type of dimmer switch.
The basic way LED dimmers work is that they rapidly cut the current to the light, and they do this in one of two ways:
- Leading-edge dimmers: cut the first half of the AC wave. Cheaper and most common, but they cause much more interference.
- Trailing-edge dimmers: cut the second half of the AC wave. More expensive, but causes less interference.

Trailing-edge dimmers are also known as **reverse-phase** dimmers, which is a keyword you can search for when shopping.
I swapped out my dimmers with a [Lutron Maestro PRO LED+](https://www.lutron.com/us/en/control/dimmers-switches/maestro-dimmers?sku=ma-pro-la),
which reduced the interference to an acceptable level. Every problematic dimmer compounds the problem, so keep that in mind when solving
your situation.

Extra bonus tip on dimmers: If you use a [breaker finder](https://www.fluke.com/en-us/product/building-infrastructure/wire-tracers/fluke-bk120) to know which circuit an outlet is connected to, leading-edge dimmers
can cause enough interference that these tools don't work correctly; they'll incorrectly identify multiple circuits. Replacing the dimmer
also fixed that problem for me.

---

Hope this helps; good luck!
