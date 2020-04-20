# PFA-SEGMent

## Sommaire
* [Description du projet](#description-du-projet)
* [Technologies](#technologies)
* [Architecture](#architecture)
* [Installation](#installation)
* [Démarrage](#démarrage)


##  Description du projet

Ce projet a pour objectif de permettre une conversion Web d'un jeu Escape Game nommé Subpoena afin de faciliter son accessibilité.
Il est également possible de pouvoir créer son propre jeu en suivant la démarche décrite ci-après.


## Technologies

Le projet a été créé avec les outils de programmation suivants :
* Javascript version : 8.10.0
* HTML5


## Architecture

Le code a ét& séparé en plusieurs fichiers. Voici le contenu global de chaque fichier :
* **cookie.js** : contient toutes les fonctions permettant d'enregistrer et d'accéder à des éléments dans des cookies.
* **diary.js** : contient toutes les fonctions permettant d'afficher les éléments du journal
* **digicode.js** : contient toutes les fonctions permettant de gérer les réponses du digicode.
* **game.html** : page html affichant la scène du jeu
* **gif.js** : fonctions permettant de gérer les gifs (pas l'affichage)
* **global.js** : contient toutes les variables "globales" utilisées dans plusieurs autres fichiers js, ainsi que des définitions de classes.
* **index.html** : première page permettant de charger le json dans le code et de lancer le jeu
* **init.js** : contient les fonctions permettant d'initialiser certaines variables globales importantes, et contient aussi certaines fonctions utiles (fileExists).
* **load_game.js** : script lié à index.html, permettant de charger le json et démarrer le jeu
* **load.js** : fonctions permettant de charger une scène
* **main.js** : fonctions permettant de dérouler la scène et de la resize si besoin
* **object.js** : fonctions permettant d'afficher les éléments de type objet (sauf les pièces de puzzle)
* **parser_json.js** : fonctions permettant de récupérer de l'information du JSON
* **puzzle.js** : fonctions permettant de gérer les énigmes de type puzzle
* **resize.js** : contient setWindowsValues() permettant de mettre à jour la variable globale windowsValues
* **sound.js** : fonctions permettant de jouer les différents sons après avoir cliqué sur certains éléments
* **test_clicks.js** : fonctions permettant de savoir sur quels éléments l'utilisateur à cliqué + fonctions pour modifier le pointeur de souris
* **text.js** : fonctions permettant d'afficher et gérer le texte
* **transition.js** : fonctions liées au changement de scène
* **video_load.js** : fonctions permettant de charger une vidéo et de passer à la scène video.html
* **video_scene.js** : fonctions permettant de jouer la video. Lié à video.html
* **video.html** : page html permettant de jouer une vidéo



## Installation et démarrage

veuillez vous référer au manuel d'installation afin d'avoir une explication détaillée


## Auteurs

BERTIN Clément
BOUCHERIT Hind
CHOISY Floris
COUTOLLEAU Eléonore
DUCHEMIN Emeric
LE METAYER Corentin
CHEVALLIER Pierre
ZHU Jean
