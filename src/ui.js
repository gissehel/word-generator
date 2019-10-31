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

        workspace.classList.add('ui');
        workspace.classList.add('container');

        this._createTitle(workspace, 'Word Generator');

        const controlPanel = this._controlPanel = this._createPanel(workspace, ['ui', 'form', 'segment', 'controlPanel']);

        this._createButton(workspace, 'Generate', () => this.run(), ['run']);

        this._resultPanel = this._createPanel(workspace, ['ui', 'segment', 'resultPanel']);

        const dataNamePanel = this._dataNamePanel = this._createPanel(controlPanel, ['field', 'dataNamePanel']);

        const prefixSizePanel = this._prefixSizePanel = this._createPanel(controlPanel, ['field', 'prefixSizePanel']);

        const minMaxWordPanel = this._minMaxWordPanel = this._createPanel(controlPanel, ['two', 'fields', 'minMaxWordPanel']);

        const minWordPanel = this._minWordPanel = this._createPanel(minMaxWordPanel, ['field', 'minWordPanel']);
        const maxWordPanel = this._maxWordPanel = this._createPanel(minMaxWordPanel, ['field', 'maxWordPanel']);

        this._createLabel(dataNamePanel, 'Data Source', ['dataName']);
        this._createLabel(prefixSizePanel, 'Prefix\'s length', ['prefixLen']);
        this._createLabel(minWordPanel, 'Minimum word size', ['minSize']);
        this._createLabel(maxWordPanel, 'Maximum word size', ['maxSize']);


        /**
         * @type {Object.<string, HTMLElement>}
         */
        this._dataNames = {};
        this._createButtons(
            dataNamePanel,
            this._dataNames,
            Object.keys(this._data),
            (dataName) => this._data[dataName].name,
            (dataName) => this.onDataNameClicked(dataName),
            ['dataName']
        );

        /**
         * @type {Object.<number, HTMLElement>}
         */
        this._prefixLens = {};
        const prefixLen = [2, 3, 4, 5, 6];
        this._createButtons(
            prefixSizePanel,
            this._prefixLens,
            prefixLen,
            (prefixLen) => `${prefixLen}`,
            (prefixLen) => this.onPrefixLenClicked(prefixLen),
            ['prefixLen']
        );

        /**
         * @type {Object.<number, HTMLElement>}
         */
        this._minSizes = {};
        const minSizes = [5, 6, 7, 8, 20, 30];
        this._createButtons(
            minWordPanel,
            this._minSizes,
            minSizes,
            (minSize) => `${minSize}`,
            (minSize) => this.onMinSizeClicked(minSize),
            ['minSize']
        );

        /**
         * @type {Object.<number, HTMLElement>}
         */
        this._maxSizes = {};
        const maxSizes = [10, 12, 14, 16, 18, 20, 45, 85];
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
     */
    onDataNameClicked(dataName) {
        console.log(`onDataNameClicked: [${dataName}]`);
        this._state.dataName = dataName;
    }

    /**
     * @param {number} prefixLen
     */
    onPrefixLenClicked(prefixLen) {
        console.log(`onPrefixLenClicked: [${prefixLen}]`);
        this._state.prefixLen = prefixLen;
    }

    /**
     * @param {number} minSize
     */
    onMinSizeClicked(minSize) {
        this._state.minSize = minSize;
    }

    /**
     * @param {number} maxSize
     */
    onMaxSizeClicked(maxSize) {
        this._state.maxSize = maxSize;
    }

    /**
     * @param {State} state
     * @param {string[]} changed
     */
    onControlDataChanged(state, changed) {
        const all = changed === undefined;
        console.log(`data changed : ${all ? ' (all)' : changed.join(', ')}`);
        if (all || changed.includes('dataName')) {
            Object.keys(this._dataNames).forEach((dataName) => {
                if (dataName === state.dataName) {
                    this._dataNames[dataName].classList.add('active');
                } else {
                    this._dataNames[dataName].classList.remove('active');
                }
            });
        }
        if (all || changed.includes('prefixLen')) {
            const prefixLenStrState = `${state.prefixLen}`;
            Object.keys(this._prefixLens).forEach((prefixLenStr) => {
                if (prefixLenStr === prefixLenStrState) {
                    this._prefixLens[prefixLenStr].classList.add('active');
                } else {
                    this._prefixLens[prefixLenStr].classList.remove('active');
                }
            });
        }
        if (all || changed.includes('minSize')) {
            const minSizeStrState = `${state.minSize}`;
            Object.keys(this._minSizes).forEach((minSizeStr) => {
                if (minSizeStr === minSizeStrState) {
                    this._minSizes[minSizeStr].classList.add('active');
                } else {
                    this._minSizes[minSizeStr].classList.remove('active');
                }
            });
        }
        if (all || changed.includes('maxSize')) {
            const maxSizeStrState = `${state.maxSize}`;
            Object.keys(this._maxSizes).forEach((maxSizeStr) => {
                if (maxSizeStr === maxSizeStrState) {
                    this._maxSizes[maxSizeStr].classList.add('active');
                } else {
                    this._maxSizes[maxSizeStr].classList.remove('active');
                }
            });
        }
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
            parent: this._resultPanel,
        });
    }

    /**
     * @returns {void}
     */
    onResultCleaned() {
        this._resultPanel.innerHTML = '';
    }

    run() {
        this._controller.run();
    }
}
