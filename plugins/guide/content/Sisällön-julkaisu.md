# Sisällöntuottaminen

## Sisällön luominen

Uuden sisällön luominen tapahtuu aina kyseisen sisältötyypin listausnäkymästä, jonka saat avattua vasemmasta navigaatiosta `Collection types` tai `Single types` kategorioiden alta. Listausnäkymässä oikeassa yläkulmassa on painike `Add new X`, jota painamalla aukeaa uuden sisältökohteen näkymä. Kun kaikki vaaditut kentät on täytetty, voi tallentaa sisällön oikean yläkulman painikkeesta `Save`. Mikäli `Save`-painikkeen vieressä on painike `Publish`, sisältö voi olla joko julkaistu-, tai luonnostilassa (published/draft). Ainoastaan julkaistu-tilassa olevat sisällöt päätyvät verkkosivulle (ja palautuvat rajapinnasta). Jos `Publish`-painiketta ei ole, on sisältö aina julkaistu-tilassa tallennuksen jälkeen.

**Huomio julkaistu/draft -tiloista**: Kun muokkaat julkaistua sisältökohdetta ja tallennat sen, sisältö päivittyy suoraan julkaistuun versioon, eikä toista luonnostilassa olevaa versiota luoda. Tämä on Strapin ominaisuus (ongelma), joka on kuitenkin osittain kierretty sisällöntuotannon helpottamiseksi, kts. [Sivuston julkaisu](#sivuston-julkaisu). 

## Sivuston navigaatio

Sivuston navigaatio rakentuu osin automaattisesti ja osin manuaalisesti.

### Ohjelmasisältö
![](/public/images/ohjelma-navigaatio.png)

Ohjelmasisällön (Ikäryhmät, Aktiviteettipaketit ja Aktiviteetit) navigaatio muodostuu automaattisesti sen hierarkian perusteella, ja se löytyy sivuston päänavigaatiosta aina ensimmäiseltä paikalta.

### Muut sivut
![](/public/images/muu-navigaatio.png)

Muiden sisältösivujen navigaatio on sisällöntuottajien muokattavissa `Front page`-sisällön kautta, joka löytyy vasemmasta navigaatiosta kategorian `Single types` alta. Siellä navigaatio on muokattavissa kohdassa `Navigation`. Siinä olevat kohteet määrittävät sivuston navigaation muiden kuin ohjelmasisällön osalta. Ensimmäisen tason navigaatiokohteilla on kentät `Title` ja `Subnavigation`. `Title` määrittää luodun navigaatiolinkin tekstin, ja `Subnavigation` sen alle muodostuvan alinavigaation. `Subnavigationiin` tulevat kohteet ovat samankaltaisia kuin ylemmällä tasolla, mutta niissä ei ole `Subnavigation`-kenttää, vaan `Page`-kenttä, johon valitaan sivu mihin luotu linkki tulee osoittamaan.

## <a name="sivuston-julkaisu"></a> Sivuston julkaisu

Sivuston julkaisu eli sisällön päivitys tapahtuu manuaalisesti `Github Actions Plugin` -lisäosan (löytyy vasemmasta navigaatiosta `Plugins`-kategorian alta) avulla. Sieltä löytyy toiminto `Deploy site`, jonka voi ajaa painamalla vasemmalta `Start`. Tämä käynnistää sivuston julkaisun.