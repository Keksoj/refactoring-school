# Refactorer une fonction d'assainissement & tests

> en: refactoring a sanitizer function & tests, for an open source job board project of the french team Coding Caen Camp. This is an exercise in refactoring, following the best practices.

Dans le cadre du [projet de job board du Coding Caen Camp](https://github.com/CaenCamp/jobs-caen-camp),
notre petit groupe d'étudiant s'est attaqué à [l'issue #56](https://github.com/CaenCamp/jobs-caen-camp/issues/56).

L'objectif est de refondre les paramètres de tri de l'API.
Lorsque le client effectue une requête, les paramètres passés dans la
requête sont de trois types :

-   filtres (type d'offre, durée du contrat...)
-   pagination ( nombre de résultats affichés par page et numéro de la page)
-   tri (critère de tri, ordre de tri)

Par exemple, le client peut demander à trier les offres par titre (`title`) et par ordre contre-alphabétique (`DESC`).
Cette requête est jusqu'à présent de la forme :

```
/api/organizations?sort=%5B%22title%22%2C%22DESC%22%5D
```

Le tri est traité comme le paramètre `sort`, c'est un tableau stringifié,
ici `["title", "DESC"]`.

Pour des raisons de compatibilité avec React-Admin et afin d'être au
plus prêt des bonnes pratiques, il a été décidé de supprimer le paramètre `sort`
au profit de ses deux éléments, devenus les paramètres `sortBy` et `orderBy`.

La requête devient ainsi davantage lisible :

```
api/organizations?sortBy=title&orderBy=DESC
```

Par commodité et souci d'harmonisation avec le reste du code,
nous avons décidé de les rassembler à nouveau
sous forme d'un objet dans `router.js` :

```js
sort: {
    sortBy: ctx.query.sortBy,
    orderBy: ctx.query.orderBy,
},
```

`sort` était auparavant un tableau, il est désormais un objet.
Il faut donc refactorer la fonction
d'assainissement `sortSanitizer`
qui vérifie que les valeurs de `sortBy` et `orderBy`
sont conformes. La fonction retourne ces valeurs sous forme d'un tableau qui sera
utilisé en aval. Si les valeurs sont inutilisables, la fonction `sortSanitizer` renvoie
par défaut `['datePosted', 'ASC']`.

Voilà la fonction :

```js
/**
 * Method to clean the sort sent in query parameters
 *
 * @param {object} sort - sort from query parameters
 * @param {Array} sortableFields the fields allowed to be used as a sort
 * @returns {Array} Ready-to-use filters for the sql query
 */
const sortSanitizer = (sort, sortableFields) => {
    const sortTwoFirstParameters = [
        sort ? sort[0] || null : null,
        sort ? sort[1] || null : null,
    ];
    if (
        !sortTwoFirstParameters ||
        !sortableFields.includes(sortTwoFirstParameters[0])
    ) {
        return [sortableFields[0], "ASC"];
    }

    if (!["ASC", "DESC"].includes(sort[1])) {
        return [sortTwoFirstParameters[0], "ASC"];
    }

    return sortTwoFirstParameters;
};
```

Il faudra aussi refactorer les fonctions de test écrites avec **jest**,
de la forme

```js
test("should return the first sortable field ASC if query sort is not an array", () => {
    const defaultSortableFields = ["foo", "bar"];
    expect(sortSanitizer({ bar: "DESC" }, defaultSortableFields)).toEqual([
        "foo",
        "ASC",
    ]);
});
```

## Marche à suivre

Installer les dépendances:

```
npm install
```

Lancer les tests:

```
npm run test
```

Se creuser les méninges !