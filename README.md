# Test pratique React / JavaScript — Recensement des foyers

Ce dépôt sert de support à un exercice destiné à une personne ayant terminé une formation aux bases de JavaScript et React. L'objectif est de réaliser une petite application permettant de recenser des foyers en consommant l'API PHP déjà fournie.

La partie `front` est volontairement vide : son installation, son organisation et son implémentation font partie du test. La partie `api` ne doit normalement pas être modifiée.

## Fonctionnalités attendues

L'application doit permettre de :

- afficher la liste des foyers ;
- ajouter un foyer avec un formulaire ;
- consulter les informations d'un foyer ;
- modifier un foyer existant ;
- supprimer un foyer après confirmation ;
- afficher clairement les états de chargement et les erreurs de l'API ;
- afficher un message adapté lorsque la liste est vide.

Un foyer contient les informations suivantes :

| Champ | Type | Règle |
| --- | --- | --- |
| `nomResponsable` | chaîne | obligatoire, non vide |
| `adresse` | chaîne | obligatoire, non vide |
| `commune` | chaîne | obligatoire, non vide |
| `nombrePersonnes` | entier | obligatoire, minimum 1 |
| `telephone` | chaîne ou `null` | facultatif |

L'API ajoute automatiquement `id`, `createdAt` et `updatedAt`.

## Ce qui est évalué

- installation autonome d'un projet React dans `front` (Vite est conseillé) ;
- découpage pertinent en composants JSX ;
- utilisation correcte des props, des événements et des listes avec une `key` ;
- gestion de l'état avec `useState` et des effets avec `useEffect` ;
- formulaires contrôlés et validation simple côté navigateur ;
- manipulation des tableaux et objets JavaScript (`map`, `filter`, spread, destructuration...) ;
- appels asynchrones avec `fetch`, promesses ou `async`/`await` ;
- gestion des réponses HTTP réussies et en erreur ;
- code lisible, noms explicites et commits Git réguliers.

Le style reste libre. Une interface simple, propre et utilisable est suffisante. Il n'est pas demandé d'utiliser Redux, TypeScript, un framework CSS ou une bibliothèque de composants.

## Structure du dépôt

```text
.
├── api/                 API PHP fournie
│   ├── public/index.php point d'entrée HTTP
│   ├── src/             gateway en mémoire
│   └── router.php       routeur du serveur PHP local
├── front/               application React à créer
└── README.md
```

## Lancer l'API

Prérequis : PHP 8.1 ou plus récent.

Depuis la racine du dépôt :

```bash
php -S localhost:8000 -t api/public api/router.php
```

L'API est alors disponible sur `http://localhost:8000/api/foyers`.

Les foyers sont conservés temporairement dans la session PHP. Ils ne sont pas enregistrés dans une base de données, peuvent disparaître à l'arrêt du serveur ou à la suppression des cookies, et sont propres à chaque client. Dans les appels `fetch`, utiliser l'option `credentials: 'include'` afin que les différentes requêtes partagent la même session :

```js
const response = await fetch('http://localhost:8000/api/foyers', {
  credentials: 'include',
});
```

## Documentation de l'API

Toutes les réponses contenant un foyer utilisent la forme `{ "data": ... }`. Les erreurs utilisent `{ "error": "..." }` et les erreurs de validation possèdent aussi un objet `details`.

### Lister les foyers

```http
GET /api/foyers
```

Réponse `200` :

```json
{
  "data": []
}
```

### Consulter un foyer

```http
GET /api/foyers/1
```

Réponses : `200` si le foyer existe, `404` sinon.

### Ajouter un foyer

```http
POST /api/foyers
Content-Type: application/json
```

```json
{
  "nomResponsable": "Amina Soilihi",
  "adresse": "12 rue des Manguiers",
  "commune": "Mamoudzou",
  "nombrePersonnes": 4,
  "telephone": "0639000000"
}
```

Réponses : `201` si le foyer est créé, `400` si le JSON est invalide, `422` si les données sont invalides.

### Modifier complètement un foyer

```http
PUT /api/foyers/1
Content-Type: application/json
```

Envoyer tous les champs d'un foyer. Réponses : `200`, `404` ou `422`.

### Modifier partiellement un foyer

```http
PATCH /api/foyers/1
Content-Type: application/json
```

Envoyer uniquement les champs à changer, par exemple :

```json
{
  "nombrePersonnes": 5
}
```

Réponses : `200`, `404` ou `422`.

### Supprimer un foyer

```http
DELETE /api/foyers/1
```

Réponses : `204` sans contenu si la suppression réussit, `404` sinon.

## Tester rapidement avec curl

L'option `-c /tmp/foyers-cookie.txt -b /tmp/foyers-cookie.txt` conserve la session entre les commandes.

```bash
curl -c /tmp/foyers-cookie.txt -b /tmp/foyers-cookie.txt \
  -H 'Content-Type: application/json' \
  -d '{"nomResponsable":"Amina Soilihi","adresse":"12 rue des Manguiers","commune":"Mamoudzou","nombrePersonnes":4,"telephone":"0639000000"}' \
  http://localhost:8000/api/foyers

curl -c /tmp/foyers-cookie.txt -b /tmp/foyers-cookie.txt \
  http://localhost:8000/api/foyers
```

## Installer et lancer le front

Depuis la racine, créer le projet React directement dans le dossier déjà présent :

```bash
cd front
npm create vite@latest . -- --template react
npm install
npm run dev
```

Consulter le terminal pour connaître l'URL locale du front. Garder le serveur PHP ouvert dans un autre terminal.

## Git et GitHub

Cloner le dépôt puis créer une branche de travail :

```bash
git clone URL_DU_DEPOT
cd recencement-foyers
git switch -c prenom-nom
```

Enregistrer régulièrement son travail :

```bash
git status
git add front
git commit -m "feat: affiche la liste des foyers"
git push -u origin prenom-nom
```

Récupérer les nouvelles modifications de sa branche distante :

```bash
git pull --rebase origin prenom-nom
```

Après le premier `push`, les suivants peuvent être faits avec :

```bash
git push
```

À la fin, vérifier que tout est poussé sur GitHub et transmettre le lien de la branche ou ouvrir une pull request selon les consignes reçues.

## Bonus facultatifs

- recherche ou filtre par commune ;
- tri des foyers ;
- compteur du nombre total de personnes recensées ;
- séparation des appels HTTP dans un petit module dédié ;
- tests de quelques composants ou fonctions JavaScript.

Les bonus ne compensent pas une fonctionnalité principale absente.
