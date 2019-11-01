
const stateProps = ['dataName', 'prefixLen', 'count', 'minSize', 'maxSize'];

class State {
    constructor() {
        /** @type {string} */
        this._dataName = 'fr';
        /** @type {number} */
        this._minSize = 6;
        /** @type {number} */
        this._maxSize = 16;
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
        /** @type {Ev<{hash:string}>} */
        this.onHashChanged = new Ev()

        this._hashUpdate = false;
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
            this.notifyHashChanged();
        }
    }
    set prefixLen(value) {
        if (this._prefixLen !== value) {
            this._prefixLen = value * 1;
            this.onControlDataChanged.execute({ state: this, changed: ['prefixLen'] });
            this.notifyHashChanged();
        }
    }
    set minSize(value) {
        if (this._minSize !== value) {
            this._minSize = value * 1;
            this.onControlDataChanged.execute({ state: this, changed: ['minSize'] });
            this.notifyHashChanged();
        }
    }
    set maxSize(value) {
        if (this._maxSize !== value) {
            this._maxSize = value * 1;
            this.onControlDataChanged.execute({ state: this, changed: ['maxSize'] });
            this.notifyHashChanged();
        }
    }
    set count(value) {
        if (this._count !== value) {
            this._count = value * 1;
            this.onControlDataChanged.execute({ state: this, changed: ['count'] });
            this.notifyHashChanged();
        }
    }


    notifyHashChanged() {
        if (! this._hashUpdate) {
            this.onHashChanged.execute({ hash: this.hash });    
        }
    }

    get hash() {
        return stateProps.map((prop) => `${prop}=${this[prop]}`).join('|');
    }
    set hash(value) {
        this._hashUpdate = true;
        value.split('|').filter((part) => part.includes('=')).forEach((part) => {
            const partParts = part.split('=');
            if (partParts.length === 2 && stateProps.includes(partParts[0])) {
                this[partParts[0]] = partParts[1];
            }
        });
        this._hashUpdate = false;
        return;
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