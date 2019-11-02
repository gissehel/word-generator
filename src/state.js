
const stateProps = ['dataName', 'prefixLen', 'count', 'minSize', 'maxSize'];

class State {
    constructor() {
        /** @type {Ev<{state:State, changed: string[]}>} */
        this.onControlDataChanged = new Ev()
        /** @type {Ev<{state:State, result: string}>} */
        this.onResultAdded = new Ev()
        /** @type {Ev<{state:State}>} */
        this.onResultCleaned = new Ev()
        /** @type {Ev<{hash:string}>} */
        this.onHashChanged = new Ev()
        /** @type {string[]} */
        this._results = [];

        this._hashUpdate = false;

        this._properties = {};

        this.dataName = 'fr';
        this.minSize = 6;
        this.maxSize = 16;
        this.count = 10;
        this.prefixLen = 3;

    }

    /**
     * @param {string} propertyName 
     * @param {string} value 
     * @returns {void}
     */
    propertySetterString(propertyName, value) {
        if (this._properties[propertyName] !== value) {
            this._properties[propertyName] = value;
            this.onControlDataChanged.execute({ state: this, changed: [propertyName] });
            this.notifyHashChanged();
        }
    }

    /**
     * @param {string} propertyName 
     * @param {number} value 
     * @returns {void}
     */
    propertySetterNumber(propertyName, value) {
        if (this._properties[propertyName] !== value) {
            this._properties[propertyName] = value * 1;
            this.onControlDataChanged.execute({ state: this, changed: [propertyName] });
            this.notifyHashChanged();
        }
    }

    /**
     * @param {string} propertyName 
     * @returns {number}
     */
    propertyGetterNumber(propertyName) {
        return this._properties[propertyName];
    }

    /**
     * @param {string} propertyName 
     * @returns {string}
     */
    propertyGetterString(propertyName) {
        return this._properties[propertyName];
    }

    get dataName() { return this.propertyGetterString('dataName'); }
    get minSize() { return this.propertyGetterNumber('minSize'); }
    get maxSize() { return this.propertyGetterString('maxSize'); }
    get count() { return this.propertyGetterNumber('count'); }
    get prefixLen() { return this.propertyGetterNumber('prefixLen'); }

    set dataName(value) { this.propertySetterString('dataName', value); }
    set prefixLen(value) { this.propertySetterNumber('prefixLen', value); }
    set minSize(value) { this.propertySetterNumber('minSize', value); }
    set maxSize(value) { this.propertySetterNumber('maxSize', value); }
    set count(value) { this.propertySetterNumber('count', value); }

    notifyHashChanged() {
        if (!this._hashUpdate) {
            this.onHashChanged.execute({ hash: this.hash });
        }
    }

    get hash() {
        return stateProps.map((prop) => `${prop}=${this[prop]}`).join('|');
    }
    set hash(value) {
        this._hashUpdate = true;
        if (value.startsWith('#')) {
            value = value.substring(1);
        }
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