# giolendius.github.io
<style>
body {
    font-size: 150% !important;
}
p {
    font-size: 100% !important;
[//]: # (    color: black;)
}
</style>

This is the repository for the webpage of the games we own.

In the ``frontend`` sub-folder you'll find the code for the creation of the GitHubPage 
<a href="http://giolendius.github.io">Great Gallo Games.</a>. Since the is no option for a backend, 
we do not have one. This means that the site database is implemented as a simple, accessible google sheets 
linked in the webpage.

In the sub-folder ``bgg_integration`` there is a python script, executable locally to retrieve and integrate google_sheet 
information with the statistics provided by BGG 
<a href="http://boardgamegeek.com">BGG</a>. 


_"We don’t stop playing because we grow old; We grow old because we stop playing."_

[//]: # (- first month debt  )

[//]: # ($C&#40;1+i&#41;-R$)

[//]: # (- third month:  )

[//]: # ($&#40;&#40;C&#40;1+i&#41;-R&#41;&#40;1+i&#41;-R&#41;&#40;1+i&#41;-R$)

[//]: # (- n-th month  )

[//]: # ($C&#40;1+i&#41;^n- R \sum_{j=0}^{n-1}&#40;1+i&#41;^j$)

[//]: # ()
[//]: # (Since $\sum_{j=0}^{n}a^j=\frac{a^{n+1}-1}{a-1}$ we get)

[//]: # ($$C&#40;1+i&#41;^n- R \frac{&#40;1+i&#41;^n-1}{&#40;1+i&#41;-1}=0$$)

[//]: # (And so we get)

[//]: # ($$R=Ci \frac{&#40;1+i&#41;^n}{&#40;1+i&#41;^n-1}$$)