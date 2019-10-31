class Controller {

    /**
     * @param {WordStat} wordStat 
     * @param {State} state
     * @param {DictData} data
     */
    constructor(wordStat, state, data) {
        this._wordStat = wordStat;
        this._state = state;
        this._data = data;
    }

    /**
     * 
     * @param {WordStat} wordStat 
     * @param {string} type 
     * @returns {Parser}
     */
    get_parser_by_type(wordStat, type) {
        /**
         * @type {Object.<string, Parser>} The readers by reader type name
         */
        const parserByName = {
            freq: (url, on_word) => wordStat.parse_freq(url, on_word),
            word: (url, on_word) => wordStat.parse_word(url, on_word),
        };
        return parserByName[type];
    }

    /**
     * @returns {Promise<void>}
     */
    async run() {
        const data_name = this._state.dataName;

        this._state.cleanResults();
        /** @type {Object.<string, Object.<number, WordDict>>} */
        const structs = window.structs || {};
        window.structs = structs;

        const n = this._state.prefixLen;
        const count = this._state.count;
        const min = this._state.minSize;
        const max = this._state.maxSize;

        structs[data_name] = structs[data_name] || {};

        /** @type {WordDict} */
        let struct = null;

        if (structs[data_name][n]) {
            struct = structs[data_name][n];
        } else {
            const parser = this.get_parser_by_type(this._wordStat, this._data[data_name].type);
            /** @type {Reader} */
            const reader = (on_word_freq) => parser(this._data[data_name].url, on_word_freq);
            struct = await this._wordStat.create_struct(n, reader);
            structs[data_name][n] = struct;
        }
        await this._wordStat.generate(struct, count, min, max, (word) => this._state.addResult(word));
    }
}