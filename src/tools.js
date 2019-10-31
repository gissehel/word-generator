class Tools {
    // https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
    /**
     * 
     * @param {string} data 
     * @param {string} filename 
     * @param {string} type 
     */
    download(data, filename, type) {
        const file = new Blob([data], {
            type: type
        });
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            const a = document.createElement("a");
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    processMessages(delay = 0) {
        return new Promise((resolve, reject) => setTimeout(() => resolve(), delay));
    }

    /**
     * Export all keys of data into object target.
     * @param {Object} target 
     * @param {Object} data 
     */
    exportOn(target, data) {
        Object.keys(data).forEach((key)=>{
            target[key] = data[key];
        });
    }
}
