class State {
    constructor() {
        /** @type {string} */
        this._dataName = 'fr';
        /** @type {number} */
        this._minSize = 6;
        /** @type {number} */
        this._maxSize = 12;
        /** @type {number} */
        this._count = 10;
        /** @type {number} */
        this._prefixLen = 3;
        /** @type {string[]} */
        this._results = [];

        /** @type {Ev<{state:State, changed: string[]}>} */
        this.onControlDataChanged = new Ev()
        /** @type {Ev<{state:State, result: string}>} */
        this.onResultAdded = new Ev()
        /** @type {Ev<{state:State}>} */
        this.onResultCleaned = new Ev()
    }

    get dataName() { return this._dataName; }
    get minSize() { return this._minSize; }
    get maxSize() { return this._maxSize; }
    get count() { return this._count; }
    get prefixLen() { return this._prefixLen; }

    set dataName(value) {
        if (this._dataName !== value) {
            this._dataName = value;
            this.onControlDataChanged.execute({ state: this, changed: ['dataName'] });
        }
    }
    set prefixLen(value) {
        if (this._prefixLen !== value) {
            this._prefixLen = value;
            this.onControlDataChanged.execute({ state: this, changed: ['prefixLen'] });
        }
    }
    set minSize(value) {
        if (this._minSize !== value) {
            this._minSize = value;
            this.onControlDataChanged.execute({ state: this, changed: ['minSize'] });
        }
    }
    set maxSize(value) {
        if (this._maxSize !== value) {
            this._maxSize = value;
            this.onControlDataChanged.execute({ state: this, changed: ['maxSize'] });
        }
    }
    set count(value) {
        if (this._count !== value) {
            this._count = value;
            this.onControlDataChanged.execute({ state: this, changed: ['count'] });
        }
    }

    /**
     * Add a new result
     * @param {string} value 
     */
    addResult(value) {
        this._results.push(value);
        this.onResultAdded.execute({ state: this, result: value });
    }

    /**
     * Clean all results
     */
    cleanResults() {
        this._results.splice(0, this._results.length);
        this.onResultCleaned.execute({ state: this });
    }
}