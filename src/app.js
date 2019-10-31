class App {

    /**
     * @param {State} state 
     * @param {Ui} ui 
     * @param {Controller} controller
     */
    constructor(state, ui, controller) {
        this._state = state;
        this._ui = ui;
        this._controller = controller;
    }

    async run(props = {}) {
        /** @type {string} */
        const data_name = props.data_name;
        /** @type {number} */
        const n = props.n;
        /** @type {number} */
        const count = props.count;
        /** @type {number} */
        const min = props.min;
        /** @type {number} */
        const max = props.max;

        if (data_name !== undefined) {
            this._state.dataName = data_name;
        }
        if (n !== undefined) {
            this._state.prefixLen = n;
        }
        if (count !== undefined) {
            this._state.count = count;
        }
        if (min !== undefined) {
            this._state.minSize = min;
        }
        if (max !== undefined) {
            this._state.maxSize = max;
        }
        await this._controller.run();
    }

    start() {
        this._ui.draw();
    }
}
