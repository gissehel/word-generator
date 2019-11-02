/**
 * Manipulate Dom elements
 */
class Dom {
    /**
     * 
     * @param {Object} props 
     * @param {string} props.name
     * @param {string[]} props.classes
     * @param {HTMLElement} props.parent
     * @param {string} props.text
     * @param {()=>void} props.onClick
     * @returns {HTMLElement}
     */
    createElement(props) {
        props = props || {};
        let { name, classes, parent, text, onClick } = props;
        name = name || 'div';
        classes = classes || [];

        const element = document.createElement(name);
        classes.forEach((className) => {
            element.classList.add(className);
        });
        if (parent) {
            // console.log(`Append ${element} to ${parent}`, element, parent );
            parent.append(element);
        }
        if (text) {
            element.textContent = text;
        }
        if (onClick) {
            element.addEventListener('click', () => onClick());
        }

        return element;
    }

    /**
     * Force a className on an element or remove it.
     * @param {HTMLElement} element 
     * @param {string[]} classNames 
     * @param {boolean} isPresent
     */
    forceClass(element, classNames, isPresent) {
        if (isPresent) {
            classNames.forEach((className) => element.classList.add(className));
        } else {
            classNames.forEach((className) => element.classList.remove(className));
        }
    }

    /**
     * Remove everything inside an HTMLElement
     * @param {HTMLElement} element 
     */
    empty(element) {
        element.innerHTML = '';
    }

    /**
     * The current hash
     * @returns {string}
     */
    get hash() {
        return window.location.hash;
    }

    set hash(value) {
        window.location.hash = value;
    }

    /**
     * @returns {Ev<{hash:string}>}
     */
    get onHashChanged() {
        if (this._onHashChanged === undefined) {
            this._onHashChanged = new Ev();
            window.addEventListener('hashchange', () => this._onHashChanged.execute({ hash: this.hash }), false);
        }
        return this._onHashChanged;
    }

}
