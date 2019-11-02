/**
 * This callback take a work
 * @callback EvCallback
 * @param {T} params
 * @return {void}
 * @template T
 */

/**
 * An Event is a set of callbacks
 * @template T
 */
class Ev {
    /**
     * Event constructor
     * @param {Object} params
     */
    constructor(params) {
        params = params || {};
        /**
         * @type {EvCallback<T>[]} callbacks
         */
        this._callbacks = [];
    }

    /**
     * Add a new callback to the event
     * @param {EvCallback<T>} callback 
     * @param {T} t
     * @returns {void}
     */
    add(callback, t) {
        this._callbacks.push(callback);
        if (t !== undefined) {
            callback(t);
        }
    }

    /**
     * Remove a callback from the event
     * @param {EvCallback<T>} callback 
     * @returns {void}
     */
    remove(callback) {
        let index = this._callbacks.indexOf(callback);
        while (index >= 0) {
            this._callbacks.splice(index, index);
            index = this._callbacks.indexOf(callback);
        }
    }

    /**
     * Execute a callback
     * @param {T} params 
     * @returns {void}
     */
    execute(params) {
        this._callbacks.forEach((callback)=>{
            callback(params);
        });
    }
}