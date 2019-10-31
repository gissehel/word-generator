class Random {
    /**
     * Get an integer random number between 0 included and n excluded.
     * @param {number} max 
     * @returns {number}
     */
    randint(min, max) {
        if (min !== undefined && max === undefined) {
            max = min;
            min = 0;
        } 
        return min+Math.floor((max-min+1) * Math.random());
    }
}