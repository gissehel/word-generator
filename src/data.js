/**
 * @typedef {Object.<string, {url: string, type: string, name: string}>} DictData
 */
(() => {
    window.exp = window.exp || {};

    /**
     * @type {DictData}
     */
    const data = {
        fr: {
            url: './data/liste_mots.txt',
            type: 'freq',
            name: 'Français',
        },
        comm: {
            url: './data/communes-sort-u.txt',
            type: 'word',
            name: 'Communes françaises',
        },
        frppl: {
            url: './data/fr-PPL',
            type: 'word',
            name: 'Lieux : fr',
        },
        beppl: {
            url: './data/be-PPL',
            type: 'word',
            name: 'Lieux : be',
        },
        ukppl: {
            url: './data/uk-PPL',
            type: 'word',
            name: 'Lieux : uk',
        },
        fippl: {
            url: './data/fi-PPL',
            type: 'word',
            name: 'Lieux : fi',
        },
        frh: {
            url: './data/fr_hydrographic_h-all',
            type: 'word',
            name: 'Hydro : fr',
        }
    }

    window.exp.data = data
})();