/**
 * Base class for all CFNSane resources
 */
class Aspect {
    constructor() {
        if( !this.sanity ) {
            throw new Error('Subclass of Aspect must implement sanity');
        }
    }
    visit(node) {
        if (this.resource && !(node instanceof this.resource)) {
            return;
        }
        try {
            this.sanity(node);
        } catch(e) {
            node.node.addError(e.message);
        }

    }
}

module.exports = Aspect;
