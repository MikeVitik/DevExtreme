const ValidationMixin = {
    _findGroup: function() {
        let group = this.option('validationGroup');
        let $dxGroup;

        if(!group) {
            // try to find out if this control is child of validation group
            $dxGroup = this.$element().parents('.dx-validationgroup').first();
            if($dxGroup.length) {
                group = $dxGroup.dxValidationGroup('instance');
            } else {
                // Trick to be able to securely get ViewModel instance ($data) in Knockout
                group = this._modelByElement(this.$element());
            }
        }

        return group;
    }
};

module.exports = ValidationMixin;
