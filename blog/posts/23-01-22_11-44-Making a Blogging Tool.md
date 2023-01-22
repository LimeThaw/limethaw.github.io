I decided to record my projects a little bit better. I hope that this helps
me reflect a little bit more on what I am doing and why, and learn a bit more
from my adventures. For this purpose I decided to start this little blog.

First things first, I needed to settle on a platform. Since I only intend
to share static content here, and I am already using GitHub a lot, I decided
to use GitHubs pages infrastructure to host the blog. I didn't immediately find
a blogging software that I really liked, since most seemed to be a little much
setup for what I need. And since I am a programmer and looking for projects to
learn new things, I decided to make my own. I settled on simple markdown as
format to write the articles, JSON to store metainfo in a concise manner that
is readable to both machines and humans, and python to write a little command
line tool to help me manage everything.

As of writing this, I am implementing the Python tool. It seems interesting
to create such a minimalistic piece of software, since I don't really have
to think too much about use- and edge cases, but just conde in what I need
right now.

Next up is the design. I usesome boilerplate code that I made a few years
back when I experimented with web design during the pandemic. Back then, I
used LESS stylesheets, but I have since realized that the longer load times
caused by the Just-In-Time compilation makes for a pretty bad user experience,
so I switched to SCSS instead, which I can compile within VS Code. I also use
Bootstrap, which is handy, but I don't have a lot of experience with it, so
I scavenged some online examples and tutorials for inspiration. Keeping in
line with the tone of this project, the design is very minimalistic and only
contains what is absolutely necessary for the current state.

For the final part, the generation of the actual website. I split my design
into one template for the page, and one for an article. I then used Python's
Template substitution to insert my data in a two-step process, one substitution
for every article, and then the insertion into the page. Thanks to Python's
extensive library ecosystem I could simply use a library to translate the
Markdown into HTML.

So for now, this blog page seems to be complete. It is very simplistic,
but does exactly what I want for now. Next steps could include a better
design, dev-ops and monitoring of some kind, or an article view to read
single articles. These could be generated into their own HTML files,
which would probably even scale, since the required space is still roughly
linear to the number of articles. If I want to reduce redundancy, I could
also load the article part using JavaScript, so I only have to store the
page part of the template once.

But I'm getting ahead of myself. For now I'm done.