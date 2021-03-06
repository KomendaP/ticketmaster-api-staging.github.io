/*
todo: single - first load;
todo: paging (params)
todo: ulr parse
todo: fields validation
 */

var self;

function CardGroup(params) {
	self = this;
	this.url = this.url || params.url;
	this.config = getConfig(params);
	this.data = prepareData(params, this.config._CONFIG);
	this.groupIndex = params.groupIndex || 0;
	this.sectionIndex = ko.utils.unwrapObservable(params.sectionIndex);
	this.colorClass = params.colorClass;
	this.getMore = params.getMore;
	this.page = getPagingInfo(params, this.data.page, this.url);
	this.collapseId = getCollapseId();
	this._hasEventsPanel = false;
}

CardGroup.prototype.sortByConfig = function (a, b) {
	if (this.config && this.config[a.key] && this.config[b.key] && this.config[a.key]._CONFIG && this.config[b.key]._CONFIG) {
		var i1 = this.config[a.key]._CONFIG.index;
		var i2 = this.config[b.key]._CONFIG.index;
		return i1 - i2;
	}
	return 0;
};

CardGroup.prototype.checkIfHasEventsList = function (key) {
	return self._hasEventsPanel = key === 'events' || self._hasEventsPanel;
};

module.exports = ko.components.register('panel-group', {
	viewModel: CardGroup,
	template:`
		<section data-bind="foreachprop: {data: data, sortFn: sortByConfig.bind($component)}" class="panel-group">
			<!--panel-->
			<panel data-bind="css: {'has-events-list': $component.checkIfHasEventsList(key)}" params="$data: $data, $index: $index, panelGroup: $component, sortByConfig: $component.sortByConfig"></panel>
		</section>
`});

/**
 * Configures and params for each panel group
 * @param params
 * @returns {*}
 */
function getConfig(params) {
	self.deepProp = params.deepProp || '';
	// main config
	if (!self.deepProp && !params.config) {
		// panelGroup index - 0

		// get full config;
		var filter = ko.utils.unwrapObservable(params.filter);

		// get current method config
		var methodConfig = filter[params.reqId] || {};

		// method config inherits global config
		methodConfig._CONFIG  = $.extend(true, {}, filter._GLOBAL_CONFIG, methodConfig._CONFIG);

		return methodConfig;
	} else {
		// panelGroup index > 0
		return params.config || {}
	}
}

/**
 * Data manipulations
 * @param params
 * @returns {*|{}}
 */
function prepareData(params, config) {
	var data = params && $.extend(true, {}, params.data) || {};
	unwrappObjects(data, config);
	removeDeprecated(data, config);
	return wrappPrimitives(data, params._propTitle);
}

/**
 * Gathers all stand alone props in to one object
 * @param data {object}
 * @param _propTitle {string}
 * @returns {object} revised data
 */
function wrappPrimitives(data, _propTitle) {
	var newData = {}, prop = _propTitle || 'object', val, key;

	// gathering all primitive props in additional panel
	for (key in data) {
		if (!data.hasOwnProperty(key)) {continue;}
		val = data[key];

		if (typeof val !== 'object') {
			newData[prop] = newData[prop] || {};
			newData[prop][key] = val;
		} else {
			newData[key] = val;
		}
	}
	return newData
}

/**
 * Unwraps objects
 * @param obj {object}
 * @returns {object} changed
 */
function removeDeprecated(obj, config) {
	var deprecated = config && config.deprecated || [];

	deprecated.map(function (item) {
		if (obj[item]) {
			delete obj[item]
		}
		return item;
	});

	return obj;
}

/**
 * Removes deprecated objects
 * @param obj {object}
 * @returns {object} changed
 */
function unwrappObjects(obj, config) {
	var unwrapp = config && config.unwrapp || [];

	unwrapp.map(function (item) {
		var val = obj[item];
		if (val) {
			var arr = Object.keys(val);
			for (var i = 0; i < arr.length; i++) {
				var prop = arr[i];
				obj[prop] = val[prop];
			}
			delete obj[item];
		}
		return item;
	});

	return obj;
}

/**
 * Prepares data for paging
 * @param pageObj
 * @param params
 * @returns {*}
 */
function getPagingInfo(params, pageObj, url) {
	var pageParam, size;

	if (pageObj){
		size = params.cardSize || pageObj.size;
		pageParam = params.pageParam || ko.utils.unwrapObservable(url).find(function (item) {
			return item.name === 'page';
		});

		return this.page = {
			parameter: pageParam && pageParam.value,
			size: size
		};
	}
	return null;
}

/**
 * Provides id str for panel 'collapse toggle' logic
 * @param str
 * @returns {string}
 */
function getCollapseId(str) {
	var className = str || 'card-panel-body-';
	return [
		className,
		self.sectionIndex,
		self.groupIndex
	].join('');
}
