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
         * @type {Object.<string, Object.<string, HTMLElement>>}
         */
        this._buttonElementsByTypeByValue = {};

        const prefixLen = [2, 3, 4, 5, 6];
        const counts = [2, 5, 10, 15, 20];
        const minSizes = [5, 6, 7, 8, 20, 30];
        const maxSizes = [10, 12, 14, 16, 18, 20, 45, 85];

        this._createButtons(
            dataNamePanel,
            'dataName',
            Object.keys(this._data),
            (dataName) => this._data[dataName].name,
            (dataName) => this.onDataNameClicked(dataName)
        );

        this._createButtons(
            prefixSizePanel,
            'prefixLen',
            prefixLen,
            (prefixLen) => `${prefixLen}`,
            (prefixLen) => this.onPrefixLenClicked(prefixLen)
        );

        this._createButtons(
            countPanel,
            'count',
            counts,
            (count) => `${count}`,
            (count) => this.onCountClicked(count)
        );

        this._createButtons(
            minWordPanel,
            'minSize',
            minSizes,
            (minSize) => `${minSize}`,
            (minSize) => this.onMinSizeClicked(minSize)
        );

        this._createButtons(
            maxWordPanel,
            'maxSize',
            maxSizes,
            (maxSize) => `${maxSize}`,
            (maxSize) => this.onMaxSizeClicked(maxSize)
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
     * @param {string} buttonType
     * @param {T[]} elementRefs 
     * @param {(ref:T)=>string} getName 
     * @param {(ref:T)=>void} onClick 
     * @param {string[]} classes 
     * @template T
     */
    _createButtons(parent, buttonType, elementRefs, getName, onClick, classes=null) {
        classes = classes || [];
        classes.push(buttonType);

        if (this._buttonElementsByTypeByValue[buttonType] === undefined) {
            this._buttonElementsByTypeByValue[buttonType] = {};
        }

        elementRefs.forEach((ref) => {
            this._buttonElementsByTypeByValue[buttonType][ref] = this._dom.createElement({
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
     * @param {boolean} all 
     * @param {string[]} changed 
     * @param {string} propertyName
     */
    _updateButtonsForProperty(all, changed, propertyName) {
        const htmlElements = this._buttonElementsByTypeByValue[propertyName];
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
        this._updateButtonsForProperty(all, changed, 'dataName');
        this._updateButtonsForProperty(all, changed, 'prefixLen');
        this._updateButtonsForProperty(all, changed, 'count');
        this._updateButtonsForProperty(all, changed, 'minSize');
        this._updateButtonsForProperty(all, changed, 'maxSize');
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
