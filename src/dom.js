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
}
