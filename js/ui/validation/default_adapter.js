const Callbacks = require('../../core/utils/callbacks');
const Class = require('../../core/class');

const DefaultAdapter = Class.inherit({
    ctor: function(editor, validator) {
        const that = this;
        that.editor = editor;
        that.validator = validator;

        that.validationRequestsCallbacks = Callbacks();

        const handler = function(args) {
            that.validationRequestsCallbacks.fire(args);
        };

        editor.validationRequest.add(handler);

        editor.on('disposing', function() {
            editor.validationRequest.remove(handler);
        });
    },

    getValue: function() {
        return this.editor.option('value');
    },

    getCurrentValidationError: function() {
        return this.editor.option('validationError');
    },

    bypass: function() {
        return this.editor.option('disabled');
    },

    applyValidationResults: function(params) {
        this.editor.option({
            isValid: params.isValid,
            validationError: params.brokenRule
        });
    },

    reset: function() {
        this.editor.reset();
    },

    focus: function() {
        this.editor.focus();
    }
});

module.exports = DefaultAdapter;
