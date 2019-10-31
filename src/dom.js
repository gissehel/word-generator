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
}
