# Partio-ohjelmasisältö

Partio-ohjelman sisältö koostuu kolmesta sivutyypistä ja muista niihin liittyvistä sisältötyypeistä.

## Sivutyypit

### Age Group / Ikäryhmä

Ikäryhmät ovat ohjelmasisällön alimman tason kohteita, ja sivuston ohjelmasisältö rakentuu niiden perusteella. Kaikki julkaistus ikäryhmät näytetään sivulla, ja kaikki julkaisemattomat tai niiden alla olevat kohteet eivät näy sivulla.

**Kentät:**
- **title**: Otsikko
- **ingress**: Ingressi
- **content**: Pääsisältö
- **minimum_age**: Ikäryhmän minimi-ikä
- **maximum_age**: Ikäryhmän maksimi-ikä
- **activity_groups**: Ikäryhmän aktiviteettipaketit
- **links** Linkit
  - Linkit piirtyvät sivulle ingressin ja pääsisällön oikealle puolelle
- **main_image**: Ikäryhmän pääkuva
  - Pääkuva on sisällön yläreunassa oleva kokoleveä kuva
- **logo**: Ikäryhmän logo
  - Logo näytetään sivulla otsikon vasemmalla puolella
- **upper_content_area**: Ylempi sisältöalue
  - Lohkoalue, joka sijaitsee sivulla ennen aktiviteettipakettien listausta
- **lower_content_area**: Alempi sisältöalue
  - Lohkoalue, joka sijaitsee sivulla aktivitettipakettien listauksen jälkeen
- **color**: Ikäryhmän värikoodi hex-muodossa
  - Ikäryhmän värikoodia käytetään ikäryhmän sivulla, sekä sen alla olevien aktiviteettipakettien ja aktiviteettien sivuilla korostusvärinä

### Activity Group / Aktiviteettpaketti

**Kentät:**
- **title**: Otsikko
- **ingress**: Ingressi
- **content**: Pääsisältö
- **activities**: Aktiviteettipaketin aktiviteetit
- **age_group**: Aktiviteettipaketin ikäryhmä
- **activity_group_category**: Aktiviteettipaketin kategoria
  - Kategorian avulla aktiviteettipaketteja voi ryhmitellä ikäryhmäsivulla haluttuun järjestykseen. Ensimmäisenä näytetään paketit joilla ei ole kategoriaa, ja sen jälkeen paketit kategorioittain ryhmiteltynä. 
- **sort_order**: Järjestysnumero, pienempi luku järjestyy ensin
  - Järjestysnumeroa käytetään ikäryhmäsivulla aktiviteettipakettien järjestämisessä. Mikäli aktiviteettipaketilla on kategoria, vaikuttaa järjestysnumero sen kateogrian alla olevaan järjestykseen.
- **links** Linkit
  - Linkit piirtyvät sivulle ingressin ja pääsisällön oikealle puolelle
- **main_image**: Aktiviteettipaketin pääkuva
  - Pääkuva on sisällön yläreunassa oleva kokoleveä kuva
- **logo**: Aktiviteettipaketin logo
  - Logo näytetään sivulla otsikon vasemmalla puolella
- **content_area**: Sisältöalue
  - Lohkoalue, joka sijaitsee sivun lopussa
- **mandatory_activities_title**: Pakollisten aktiviteettien listan otsikko
- **mandatory_activities_description**: Pakollisten aktiviteettien listan kuvaus
- **optional_activities_title**: Valinnaisten aktiviteettien listan otsikko
- **optional_activities_description**: Valinnaisten aktiviteettien listan kuvaus

### Activity / Aktiviteetti

**Kentät:**
- **title**: Otsikko
- **ingress**: Ingressi
- **content**: Pääsisältö
- **mandatory**: Aktiviteetin pakollisuus
- **main_image**: Ikäryhmän pääkuva
  - Pääkuva on sisällön yläreunassa oleva kokoleveä kuva
- **logo**: Aktiviteetin logo
  - Logo näytetään sivulla otsikon vasemmalla puolella
- **group_sizes**: Aktiviteetin ryhmäkokoot
- **level**: Aktiviteetin taso
- **skill_areas**: Aktiviteetin taitoalueet
- **Equipment**: Aktiviteetin varusteet
- **educational_objectives**: Aktiviteetin kasvatustavoitteet
- **leader_skills**: Aktiviteetin johtajan taidot
- **leader_tasks**: Aktiviteetin johtajan tehtävä
- **suggestions**: Aktiviteetin toteutusvinkit
- **activity_term**: Aktiviteetin termi
- **locations**: Aktiviteetin toteutuspaikat
- **duration**: Aktiviteetin kesto
- **files**: Aktiviteetin tiedostot
- **images**: Aktiviteetin kuvat
- **links**: Aktiviteetin linkit
- **age_group**: Aktiviteetin ikäryhmä
  - Ikäryhmä asettuu automaattisesti hierarkian perusteella
- **activity_group**: Aktiviteetin aktiviteettipaketti
- **preparation_duration**: Aktiviteetin valmistelun kesto


## Muut tyypit:

### Suggestion / Toteutusvinkki

Toteutusvinkkejä voi luoda lisää partio-ohjelma.fi -sivuston kautta, aktiviteetin sivulta. Sivuston kautta luodut vinkit jäävät automaattisesti luonnostilaan, ja ne pitää käydä käsin julkaisemassa. Uusista vinkeistä lähtee automaattisesti sähköpostiviesti osoitteisiin, jotka on syötetty `Settings`-tyypin `Suggestion_notification_recipients`-kenttään pilkulla erotettuina.

**Kentät:**
- **title**: Vinkin otsikko
- **content**: Vinkin teksti
- **author**: Vinkin tekijän nimi
- **files**: Vinkin tiedostot
- **links**: Vinkin linkit
- **comments**: Vinkin kommentit
- **from_web**: Kertoo onko vinkki tullut verkkosivujen kautta
- **like_count**: Vinkin tykkäysten määrä
  - Tykkäysten määrä muodostuu automaattisesti tykkäysten perusteella
- **pinned**: Vinkin kiinitys
  - Kiinittämällä vinkin voit nostaa sen ensimmäiseksi aktiviteettisivun vinkkilistassa
- **locations**: Vinkin toteutuspaikat
- **duration**: Vinkin toteutuksen kesto


### Comment / Toteutusvinkin kommentti

Toteutusvinkin kommentteja voi luoda lisää partio-ohjelma.fi -sivuston kautta, aktiviteetin sivulta. Sivuston kautta luodut kommentit jäävät automaattisesti luonnostilaan, ja ne pitää käydä käsin julkaisemassa. Uusista kommenteista lähtee automaattisesti sähköpostiviesti osoitteisiin, jotka on syötetty `Settings`-tyypin `Suggestion_notification_recipients`-kenttään pilkulla erotettuina.

**Kentät:**
- **title**: Kommentin otsikko
- **text**: Kommentin otsikko
- **author**: Kommentin tekijän nimi
- **scout_group**: Kommentin tekijän lippukunta
- **suggestion**: Kommentin toteutusvinkki

### Activity Group Category / Avtiviteettipaketin kategoria

**Kentät**:
- **name**: Kategorian nimi
- **activity_groups**: Kategorian aktiviteettipaketit
- **sort_order**: Järjestysnumero, pienempi luku järjestyy ensin
  - Järjestysnumeroa käytetään ikäryhmäsivulla aktiviteettipakettien järjestämisessä. Mikäli aktiviteettipaketilla on kategoria, vaikuttaa järjestysnumero sen kateogrian alla olevaan järjestykseen.

### Activity Group Term / Aktiviteettipaketin termi

**Kentät**:
- **name**: Termin nimi
- **singular**: Termin nimi yksikössä
- **plural**: Termin nimi monikossa

### Activity Level / Aktiviteetin taso

**Kentät**:
- **name**: Tason nimi
- **slug**: Tason koodinimi

### Activity Term / Aktiviteetin termi

**Kentät**:
- **name**: Termin nimi
- **singular**: Termin nimi yksikössä
- **plural**: Termin nimi monikossa

### Duration / Aktiviteetin kesto

**Kentät**:
- **name**: Keston nimi
- **slug**: Keston koodinimi
- **activities**: Aktiviteetit joilla on tämä kesto
- **preparation_activities**: Aktiviteetit joilla on tämä kesto valmistelun kestona

### Location / Aktiviteetin toteutuspaikka

**Kentät**:
- **name**: Toteutuspaiksn nimi
- **slug**: Toteutuspaiksn koodinimi
- **icon**: Toteutuspaiksn ikoni
- **activities**: Aktiviteetit joilla on tämä toteutuspaikka

### Educational Objective / Aktiviteetin kasvatustavoite

**Kentät**:
- **name**: Tavoitteen nimi
- **slug**: Tavoitteen koodinimi
- **activities**: Aktiviteetit joilla on tämä kasvatustavoite

### Equipment / Aktiviteetin varusteet

**Kentät**:
- **name**: Varusteen nimi
- **slug**: Varusteen koodinimi

### Group Size / Aktiviteetin ryhmäkoko

**Kentät**:
- **name**: Koon nimi
- **slug**: Koon koodinimi
- **icon**: Koon ikoni

### Leader Skill / Aktivteetin johtajan taito

**Kentät**:
- **name**: Taidon nimi
- **slug**: Taidon koodinimi
- **activities**: Aktiviteetit joilla on tämä johtajan taito

### Skill Area / Aktiviteetin taitoalueet

**Kentät**:
- **name**: Taitoalueen nimi
- **slug**: Taitoalueen koodinimi
- **activities**: Aktiviteetit joilla on tämä taitoalue