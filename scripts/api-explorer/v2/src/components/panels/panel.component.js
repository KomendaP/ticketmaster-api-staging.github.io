var self;

function cardComponent(params) {
	self = this;
	this.key = params.$data.key;
	this.$data = params.$data;
	this.$index = ko.utils.unwrapObservable(params.$index);
	this.panelGroup = params.panelGroup;
	this.page = this.panelGroup.page;
	this.colorClass = this.panelGroup.colorClass || '';
	this.config = getPanelConfig(this.panelGroup.config, this.key);
	this.isExpanded = isExpanded(this.config);
	this.collapseId = this.panelGroup.collapseId + this.$index;
	this.isActive = ko.observable(this.isExpanded);
}

cardComponent.prototype.setActive = function (model, event) {
	this.isActive(!this.isActive());
};

/**
 * Gets config for each panel
 * @param key {string} key of panel object
 * @returns {object} config
 */
function getPanelConfig(config, key) {
	var subConfig = config[key] || {};

	subConfig._CONFIG = $.extend(true, {}, config._CONFIG, subConfig._CONFIG);
	return subConfig;
}

/**
 * Checks for 'collapsed' config for each panel
 * @param key {string} key of panel object
 * @returns {boolean} for css class add/remove
 */
function isExpanded(config) {
	return !(Object.getProp(config, '._CONFIG.collapsed') || false);
}

module.exports = ko.components.register('panel', {
	viewModel: cardComponent,
	template:`
		<section data-bind="css: {[colorClass]: true, active: isActive}" class="panel panel-primary">
			<!--panel-heading-->
			<panel-heading params="config: config, data: $data, index: $index, page: page, setActive: setActive.bind($component), collapseId: collapseId, colorClass: colorClass, isExpanded: isExpanded"></panel-heading>
			
			<!--panel-body-->
			<section data-bind="attr: {'id': collapseId}, css: {'in': isExpanded}" class="panel-collapse collapse">				
				<!-- ko if: (typeof $data.value === 'object' && !$.isArray($data.value)) -->
					<object-panel-body params="config: config, data: $data, index: $index, panelGroup: panelGroup, page: page, collapseId: collapseId"></object-panel-body>
				<!-- /ko -->
				<!-- ko if: (typeof $data.value === 'object' && $.isArray($data.value)) -->
					<array-panel-body params="config: config, data: $data, index: $index, panelGroup: panelGroup"></array-panel-body>
				<!-- /ko -->
			</section>
		</section>
`});
