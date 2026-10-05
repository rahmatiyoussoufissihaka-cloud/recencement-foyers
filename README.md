# Test pratique React / JavaScript — Recensement des foyers

Réaliser une petite application React permettant de recenser des foyers en consommant l'API PHP fournie.

Le dossier `front` est vide : l'installation, l'organisation et l'implémentation du projet font partie du test. Le dossier `api` ne doit pas être modifié.

## Fonctionnalités attendues

- afficher la liste des foyers ;
- ajouter un foyer avec un formulaire ;
- consulter les informations d'un foyer ;
- modifier un foyer existant ;
- supprimer un foyer après confirmation ;
- afficher les états de chargement et les erreurs de l'API ;
- afficher un message adapté lorsque la liste est vide.

## Un foyer

| Champ | Type | Règle |
| --- | --- | --- |
| `nomResponsable` | chaîne | obligatoire, non vide |
| `adresse` | chaîne | obligatoire, non vide |
| `commune` | chaîne | obligatoire, non vide |
| `nombrePersonnes` | entier | obligatoire, minimum 1 |
| `telephone` | chaîne ou `null` | facultatif |

L'API ajoute automatiquement `id`, `createdAt` et `updatedAt`.

## Ce qui est évalué

- découpage en composants, props, événements, listes avec `key` ;
- état (`useState`) et effets (`useEffect`) ;
- formulaires contrôlés et validation côté navigateur ;
- appels HTTP avec `fetch` et gestion des réponses en erreur ;
- code lisible et commits Git réguliers.

Le style est libre. React avec Vite est conseillé ; aucune autre bibliothèque n'est nécessaire.

## L'API

Prérequis : PHP 8.1 ou plus récent. Depuis la racine du dépôt :

```bash
php -S localhost:8000 -t api/public api/router.php
```

Les données sont enregistrées dans `api/var/foyers.json`.

| Méthode | Route | Description | Réponses |
| --- | --- | --- | --- |
| `GET` | `/api/foyers` | liste des foyers | `200` |
| `GET` | `/api/foyers/{id}` | un foyer | `200`, `404` |
| `POST` | `/api/foyers` | créer un foyer | `201`, `400`, `422` |
| `PUT` | `/api/foyers/{id}` | remplacer un foyer (tous les champs) | `200`, `404`, `422` |
| `PATCH` | `/api/foyers/{id}` | modifier certains champs | `200`, `404`, `422` |
| `DELETE` | `/api/foyers/{id}` | supprimer un foyer | `204`, `404` |

Les corps envoyés sont en JSON. Les réponses réussies ont la forme `{ "data": ... }`, les erreurs `{ "error": "..." }` avec un objet `details` en cas de données invalides.

## Rendu

Travailler sur une branche `prenom-nom`, la pousser sur GitHub et transmettre le lien de la branche.

## Bonus facultatifs

- recherche ou filtre par commune ;
- tri des foyers ;
- compteur du nombre total de personnes recensées ;
- appels HTTP regroupés dans un module dédié ;
- tests de quelques composants ou fonctions.

Les bonus ne compensent pas une fonctionnalité principale absente.
