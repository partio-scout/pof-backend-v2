# Sisällöntuottaminen

## Sisällön luominen

Uuden sisällön luominen tapahtuu aina kyseisen sisältötyypin listausnäkymästä, jonka saat avattua vasemmasta navigaatiosta `Collection types` tai `Single types` kategorioiden alta. Listausnäkymässä oikeassa yläkulmassa on painike `Add new X`, jota painamalla aukeaa uuden sisältökohteen näkymä. Kun kaikki vaaditut kentät on täytetty, voi tallentaa sisällön oikean yläkulman painikkeesta `Save`. Mikäli `Save`-painikkeen vieressä on painike `Publish`, sisältö voi olla joko julkaistu-, tai luonnostilassa (published/draft). Ainoastaan julkaistu-tilassa olevat sisällöt päätyvät verkkosivulle (ja palautuvat rajapinnasta). Jos `Publish`-painiketta ei ole, on sisältö aina julkaistu-tilassa tallennuksen jälkeen.

**Huomio julkaistu/luonnos -tiloista**: Kun muokkaat julkaistua sisältökohdetta ja tallennat sen, sisältö päivittyy suoraan julkaistuun versioon, eikä toista luonnostilassa olevaa versiota luoda. Tämä on Strapin ominaisuus (ongelma), joka on kuitenkin osittain kierretty sisällöntuotannon helpottamiseksi. Kun sisältökohdetta päivitetään, se ei automaattisesti päivity verkkosivulle, vaan sivuston päivitys pitää ajaa manuaalisesti, kts. [Verkkosivuston päivitys](#sivuston-julkaisu). Strapin rajapintaan sisältö päivittyy kuitenkin sen tilan mukaisesti, eli jos kohde on julkaistu, se palautuu rajapinnasta.

## Sivuston navigaatio

Sivuston navigaatio rakentuu osin automaattisesti ja osin manuaalisesti Strapissa olevan sisällön mukaan.

### Ohjelmasisältö
![](/images/ohjelma-navigaatio.png)

Ohjelmasisällön (Ikäryhmät, Aktiviteettipaketit ja Aktiviteetit) navigaatio muodostuu automaattisesti sen hierarkian perusteella, ja se löytyy sivuston päänavigaatiosta aina ensimmäiseltä paikalta.

### Muut sivut
![](/images/muu-navigaatio.png)

Muiden sisältösivujen navigaatio on sisällöntuottajien muokattavissa `Front page`-sisällön kautta, joka löytyy vasemmasta navigaatiosta kategorian `Single types` alta. Siellä navigaatio on muokattavissa kohdassa `Navigation`. Siinä olevat kohteet määrittävät sivuston navigaation muiden kuin ohjelmasisällön osalta. Ensimmäisen tason navigaatiokohteilla on kentät `Title` ja `Subnavigation`. `Title` määrittää luodun navigaatiolinkin tekstin, ja `Subnavigation` sen alle muodostuvan alinavigaation. `Subnavigationiin` tulevat kohteet ovat samankaltaisia kuin ylemmällä tasolla, mutta niissä ei ole `Subnavigation`-kenttää, vaan `Page`-kenttä, johon valitaan sivu mihin luotu linkki tulee osoittamaan.

## <a name="sivuston-julkaisu"></a> Verkkosivuston päivitys

Verkkosivuston sisällön päivitys tapahtuu manuaalisesti `Github Actions Plugin` -lisäosan avulla (löytyy vasemmasta navigaatiosta `Plugins`-kategorian alta). Sieltä löytyy toiminto `Deploy site`, jonka voi ajaa painamalla vasemmalta `Start`. Tämä käynnistää sivuston päivittämisen.
![](/images/julkaisu.png)

Ennen sivuston päivitystä kannattaa tarkistaa mitä muutoksia sivustolle on menossa. Kaikki muutokset tallennetaan `Content-changes`-sisältötyyppeinä, ja ne löytyvät vasemmasta navigaatiosta kohdasta `Collection types / Content-changes`. Jokainen muutos näyttää mikä sisältötyyppi on kyseessä, mikä sen nimi on, minkä tyylinen muutos on kyseessä, koska muutos on tapahtunut ja koska muutos on julkaistu. Jos julkaistu (deployed_at) sarake on tyhjä, se tarkoittaa että sisältöä ei ole vielä julkaistu sivustolle ja se päivittyy seuraavassa ajossa. Julkaistu-sarake päivittyy n. minuutin viiveellä julkaisusta, joten jos tulet heti sivuston julkaisun jälkeen tarkastamaan muutokset, se tieto ei todennäköisesti ole vielä päivittynyt.

**HUOM!** Listaa sisältömuutoksista ei ole tarkoitus muokata käsin. Yli kuukauden vanhat julkaistut muutokset poistuvat automaattisesti, jolloin tallennettujen muutosten määrä pysyy automaattisesti aisoissa.