/**
 * This callback take a work
 * @callback OnWordCallback
 * @param {string} word
 * @return {void}
 */

/**
 * This callback take a work
 * @callback OnWordFreqCallback
 * @param {string} word
 * @param {number?} freq
 * @return {void}
 */

/**
 * This callback take a work
 * @callback Parser
 * @param {string} url
 * @param {OnWordFreqCallback} on_word
 * @return {Promise<void>}
 */

/**
 * This callback take a work
 * @callback Reader
 * @param {OnWordFreqCallback} on_word
 * @return {Promise<void>}
 */

/**
 * @typedef {[ string, number ]} LetterStat
 */

/**
 * @typedef {{ total: number, data: LetterStat[]}} StatsOnPrefix
 */

/**
 * @typedef {Object.<string, StatsOnPrefix>} WordStruct
 */

/**
 * @typedef {{total: number, data: Object.<string, number>} StatsOnCollectingPrefix
 */

/**
 * @typedef {Object.<string, StatsOnCollectingPrefix>} WordCollectingStruct
 */

/**
 * @typedef {{n: number, words: string[], data: WordStruct}} WordDict
 */

/**
 * @typedef {{n: number, words: string[], data: WordCollectingStruct}} WordCollectingDict
 */


/**
 * Manage word learning/generation
 */
class WordStat {
    /**
     * 
     * @param {Random} random 
     * @param {Tools} tools 
     */
    constructor(random, tools) {
        this._random = random;
        this._tools = tools;
    }

    /**
     * Read a text file given an url. Return the text content.
     * @async
     * @param {string} url 
     * @returns {Promise<string>}
     */
    async read_text(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        return await blob.text();
    }

    /**
     * Parse a file containing one word per line and it's freq as a two digits decimals (Ex: "Poide 8.54")
     * @param {string} url 
     * @param {OnWordFreqCallback} on_word
     * @returns {Promise<void>}
     */
    async parse_freq(url, on_word) {
        // console.log('parse_freq', [this, url, on_word]);
        const text = await this.read_text(url);
        const re_line = new RegExp('^([^\\s]+)\\s+(\\d+)\\.(\\d+)[\\r\\n]*');
        text.split('\n').forEach((line) => {
            const match = line.match(re_line);
            if (match !== null) {
                let [word, freq_int, freq_frac] = [...match.values()].slice(1);
                let freq = Math.round(100 * (freq_int + '.' + freq_frac));
                // console.log([word, freq]);
                on_word(word, freq);
            }
        });
    }

    /**
     * Parse a file containing one word per line and no freq (so a freq of 1 will be used)
     * @param {string} url 
     * @param {OnWordFreqCallback} on_word 
     * @returns {Promise<void>}
     */
    async parse_word(url, on_word) {
        // console.log('parse_word', [this, url, on_word]);
        const text = await this.read_text(url);
        text.split('\n').forEach((line) => {
            line = line.trim();
            on_word(line, 1);
        });
    }

    /**
     * 
     * @param {number} n 
     * @param {Reader} reader 
     * @returns {Promise<WordDict>}
     */
    async create_struct(n, reader) {
        /**
         * @type {WordCollectingDict}
         */
        const struct = {
            n,
            words: [],
            data: {},
        };

        await reader(async (word, freq) => {
            if (word.length > n - 2) {
                this.update_struct(struct, `_${word}_`, freq);
            }
        });

        /**
         * @type {WordDict}
         */
        const new_struct = {
            n: struct.n,
            words: struct.words,
            data: {},
        }

        Object.keys(struct.data).forEach((prefix) => {
            const sub_struct = struct.data[prefix];
            new_struct.data[prefix] = { total: sub_struct.total, data: [] };

            const new_sub_struct_data = new_struct.data[prefix].data;
            [...Object.keys(sub_struct.data)].sort().forEach((letter) => {
                new_sub_struct_data.push([letter, sub_struct.data[letter]]);
            });
        });

        return new_struct;
    }

    /**
     * 
     * @param {WordCollectingDict} struct 
     * @param {string} word 
     * @param {number} freq 
     */
    update_struct(struct, word, freq) {
        struct.words.push(word.slice(1, -1))
        for (let pos = 1; pos < word.length; pos++) {
            let start_pos = pos - struct.n;
            if (start_pos < 0) {
                start_pos = 0;
            }
            const prefix = word.slice(start_pos, pos);
            const letter = word[pos];
            if (struct.data[prefix] === undefined) {
                struct.data[prefix] = {
                    total: 0,
                    data: {},
                };
            }
            const sub_struct = struct.data[prefix];
            sub_struct.total += freq;
            if (sub_struct.data[letter] === undefined) {
                sub_struct.data[letter] = 0;
            }
            sub_struct.data[letter] += freq;
        }
    }

    /**
     * 
     * @param {Reader} reader 
     * @param {number} n 
     * @param {string} xdict_name 
     */
    async create_xdict(reader, n, xdict_name) {
        const struct = await this.create_struct(n, reader);
        await this.save_struct(struct, xdict_name);
    }

    /**
     * 
     * @param {WordDict} struct 
     * @param {string} xdict_name 
     */
    async save_struct(struct, xdict_name) {
        this._tools.download(JSON.stringify(struct), xdict_name, 'application/json');
    }

    /**
     * 
     * @param {string} dict_name 
     */
    async load(dict_name) {
        return JSON.parse(await this.read_text(dict_name));
    }

    /**
     * 
     * @param {StatsOnPrefix} sub_struct 
     */
    pick(sub_struct) {
        let index = this._random.randint(0, sub_struct.total-1);
        let result = null;
        let data_index = 0;
        // console.log('sub_struct', sub_struct);
        // console.log('sub_struct.total', sub_struct.total);
        // console.log('index', index);
        // console.log('this._random.randint', this._random.randint);
        let [letter, freq] = sub_struct.data[data_index];
        result = letter;
        // console.log('[letter, freq]', [letter, freq]);
        while (index >= freq) {
            // if (freq === undefined) {
            //     console.log('sub_struct', sub_struct);
            //     console.log('index', index);
            //     console.log('data_index', data_index);
            //     console.log('sub_struct.total', sub_struct.total);
            // }
            // console.log('index', index);
            index -= freq;

            data_index += 1;
            // console.log('data_index', data_index);
            letter = sub_struct.data[data_index][0];
            freq = sub_struct.data[data_index][1];
            result = letter;
        }
        return result;
    }

    /**
     * 
     * @param {WordDict} struct
     * @param {number} count
     * @param {number} min_size
     * @param {number} max_size
     * @param {OnWordCallback} on_word
     */
    async generate(struct, count, min_size, max_size, on_word) {
        const { n, data, words } = struct;
        const words_set = {}
        words.forEach((word) => {
            words_set[word] = true;
        });

        while (count > 0) {
            // await this._tools.processMessages();
            let word = '_';
            let cont = true;
            while (cont) {
                // console.log('...', word);
                const letter = this.pick(data[word.slice(-n)]);
                if (letter === null) {
                    console.log('problem', word);
                    cont = false;
                } else {
                    if (letter === '_') {
                        word = word.slice(1);
                        cont = false;
                    } else {
                        word += letter;
                    }
                }
            }
            if (min_size <= word.length && word.length <= max_size && (!words_set[word])) {
                on_word(word);
                count -= 1;
            } else {
                // await this._tools.processMessages();
            }
        }
    }
}
