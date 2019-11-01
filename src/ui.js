class Ui {
    /**
     * Create an Ui instance
     * @param {State} state
     * @param {Dom} dom
     * @param {Controller} controller
     * @param {DictData} data
     * @param {HTMLElement} body
     */
    constructor(state, dom, controller, data, body) {
        this._dom = dom;
        this._state = state;
        this._controller = controller;
        this._data = data;
        this._body = body;
    }

    /**
     * Draw in the dom
     */
    draw() {
        const workspace = this._body.getElementsByClassName('workspace')[0];

        this._dom.forceClass(workspace, ['ui', 'container'], true);

        this._createTitle(workspace, 'Word Generator');

        const controlPanel = this._createPanel(workspace, ['ui', 'form', 'segment', 'controlPanel']);
        this._createButton(workspace, 'Generate', () => this.run(), ['run']);
        const resultPanel = this._createPanel(workspace, ['ui', 'segment', 'resultPanel']);

        const dataNamePanel = this._createPanel(controlPanel, ['field', 'dataNamePanel']);
        
        const prefixSizeCountPanel = this._createPanel(controlPanel, ['two', 'fields', 'prefixSizeCountPanel']);
        const prefixSizePanel = this._createPanel(prefixSizeCountPanel, ['field', 'prefixSizePanel']);
        const countPanel = this._createPanel(prefixSizeCountPanel, ['field', 'countPanel']);

        const minMaxWordPanel = this._createPanel(controlPanel, ['two', 'fields', 'minMaxWordPanel']);
        const minWordPanel = this._createPanel(minMaxWordPanel, ['field', 'minWordPanel']);
        const maxWordPanel = this._createPanel(minMaxWordPanel, ['field', 'maxWordPanel']);

        const resultDimmerLoader = this._resultDimmerLoader = this._createPanel(resultPanel, ['ui', 'dimmer']);
        this._resultLoader = this._createPanel(resultDimmerLoader, ['ui', 'loader']);

        this._results = this._createPanel(resultPanel, ['results']);

        this._createLabel(dataNamePanel, 'Data Source', ['dataName']);
        this._createLabel(prefixSizePanel, 'Prefix\'s length', ['prefixLen']);
        this._createLabel(countPanel, 'Result count', ['count']);
        this._createLabel(minWordPanel, 'Minimum word size', ['minSize']);
        this._createLabel(maxWordPanel, 'Maximum word size', ['maxSize']);


        /**
         * @type {Object.<string, HTMLElement>}
         */
        this._dataNames = {};

        /**
         * @type {Object.<number, HTMLElement>}
         */
        this._prefixLens = {};
        const prefixLen = [2, 3, 4, 5, 6];

        /**
         * @type {Object.<number, HTMLElement>}
         */
        this._counts = {};
        const counts = [2, 5, 10, 15, 20];

        /**
         * @type {Object.<number, HTMLElement>}
         */
        this._minSizes = {};
        const minSizes = [5, 6, 7, 8, 20, 30];

        /**
         * @type {Object.<number, HTMLElement>}
         */
        this._maxSizes = {};
        const maxSizes = [10, 12, 14, 16, 18, 20, 45, 85];

        this._createButtons(
            dataNamePanel,
            this._dataNames,
            Object.keys(this._data),
            (dataName) => this._data[dataName].name,
            (dataName) => this.onDataNameClicked(dataName),
            ['dataName']
        );

        this._createButtons(
            prefixSizePanel,
            this._prefixLens,
            prefixLen,
            (prefixLen) => `${prefixLen}`,
            (prefixLen) => this.onPrefixLenClicked(prefixLen),
            ['prefixLen']
        );

        this._createButtons(
            countPanel,
            this._counts,
            counts,
            (count) => `${count}`,
            (count) => this.onCountClicked(count),
            ['count']
        );

        this._createButtons(
            minWordPanel,
            this._minSizes,
            minSizes,
            (minSize) => `${minSize}`,
            (minSize) => this.onMinSizeClicked(minSize),
            ['minSize']
        );

        this._createButtons(
            maxWordPanel,
            this._maxSizes,
            maxSizes,
            (maxSize) => `${maxSize}`,
            (maxSize) => this.onMaxSizeClicked(maxSize),
            ['maxSize']
        );

        this._state.onControlDataChanged.add(({ state, changed }) => this.onControlDataChanged(state, changed), { state: this._state });
        this._state.onResultAdded.add(({ state, result }) => this.onResultAdded(state, result));
        this._state.onResultCleaned.add(({ state }) => this.onResultCleaned(state));

        window.addEventListener('hashchange', () => this.updateHashState(), false);
        this._state.onHashChanged.add(() => this.updateHashLocation());
        this.updateHashState();
    }

    updateHashState() {
        this._state.hash = window.location.hash;
        if (window.location.hash !== this._state.hash) {
            window.location.hash = this._state.hash;
        }
    }

    updateHashLocation() {
        if (window.location.hash !== this._state.hash) {
            window.location.hash = this._state.hash;
        }
    }

    /**
     * 
     * @param {HTMLElement} parent 
     * @param {Object.<T, HTMLElement>} elements 
     * @param {T[]} elementRefs 
     * @param {(ref:T)=>string} getName 
     * @param {(ref:T)=>void} onClick 
     * @param {string[]} classes 
     * @template T
     */
    _createButtons(parent, elements, elementRefs, getName, onClick, classes) {
        elementRefs.forEach((ref) => {
            elements[ref] = this._dom.createElement({
                parent,
                name: 'button',
                text: getName(ref),
                classes: ['ui', 'button', 'choice', ...classes],
                onClick: () => onClick(ref),
            });
        });
    }

    /**
     * 
     * @param {HTMLElement} parent 
     * @param {string} text 
     * @param {string[]} classes 
     */
    _createLabel(parent, text, classes) {
        classes = classes || [];
        this._dom.createElement({ parent, text, classes: ['label', ...classes] });
    }

    /**
     * 
     * @param {HTMLElement} parent 
     * @param {string[]} classes 
     * @returns {HTMLElement}
     */
    _createPanel(parent, classes) {
        classes = classes || [];
        return this._dom.createElement({ parent, classes });
    }

    /**
     * 
     * @param {HTMLElement} workspace 
     * @param {string} text 
     * @param {string[]} classes 
     */
    _createTitle(parent, text, classes) {
        classes = classes || [];
        this._dom.createElement({
            name: 'h1',
            text,
            parent,
            classes: ['ui', 'header', ...classes]
        });
    }



    /**
     * @param {HTMLElement} parent 
     * @param {string} text 
     * @param {()=>void} onClick 
     * @param {string[]} classes 
     */
    _createButton(parent, text, onClick, classes) {
        return this._dom.createElement({
            parent,
            name: 'button',
            text,
            classes: ['ui', 'button', ...classes],
            onClick,
        });
    }

    /**
     * @param {string} dataName
     * @returns {void}
     */
    onDataNameClicked(dataName) {
        this._state.dataName = dataName;
    }

    /**
     * @param {number} prefixLen
     * @returns {void}
     */
    onPrefixLenClicked(prefixLen) {
        this._state.prefixLen = prefixLen;
    }

    /**
     * @param {number} prefixLen
     * @returns {void}
     */
    onCountClicked(count) {
        this._state.count = count;
    }

    /**
     * @param {number} minSize
     * @returns {void}
     */
    onMinSizeClicked(minSize) {
        this._state.minSize = minSize;
    }

    /**
     * @param {number} maxSize
     * @returns {void}
     */
    onMaxSizeClicked(maxSize) {
        this._state.maxSize = maxSize;
    }

    /**
     * 
     * @param {Object.<T, HTMLElement>} htmlElements 
     * @param {boolean} all 
     * @param {string[]} changed 
     * @param {string} propertyName
     * @template T
     */
    _updateButtonsForProperty(htmlElements, all, changed, propertyName) {
        if (all || changed.includes(propertyName)) {
            const propertyValue = `${state[propertyName]}`;
            Object.keys(htmlElements).forEach((key) => {
                this._dom.forceClass(htmlElements[key], ['active'], key === propertyValue);
            });
        }
    }

    /**
     * @param {State} state
     * @param {string[]} changed
     */
    onControlDataChanged(state, changed) {
        const all = changed === undefined;
        this._updateButtonsForProperty(this._dataNames, all, changed, 'dataName');
        this._updateButtonsForProperty(this._prefixLens, all, changed, 'prefixLen');
        this._updateButtonsForProperty(this._counts, all, changed, 'count');
        this._updateButtonsForProperty(this._minSizes, all, changed, 'minSize');
        this._updateButtonsForProperty(this._maxSizes, all, changed, 'maxSize');
    }

    /**
     * 
     * @param {State} state 
     * @param {string} result 
     * @returns {void}
     */
    onResultAdded(state, result) {
        this._dom.createElement({
            name: 'p',
            classes: ['ui', 'item'],
            text: result,
            parent: this._results,
        });
        this._dom.forceClass(this._resultDimmerLoader, ['active'], false);
    }

    /**
     * @returns {void}
     */
    onResultCleaned() {
        this._results.innerHTML = '';
        this._dom.forceClass(this._resultDimmerLoader, ['active'], true);
    }

    run() {
        this._controller.run();
    }
}
