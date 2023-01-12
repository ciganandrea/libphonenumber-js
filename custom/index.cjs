'use strict'

var metadata = require('../metadata.max.json')
var core = require('../core/index.cjs')

function call(func, _arguments) {
	var args = Array.prototype.slice.call(_arguments)
	args.push(metadata)
	return func.apply(this, args)
}

function parsePhoneNumberFromString() {
	return call(core.parsePhoneNumberFromString, arguments)
}

exports = module.exports = parsePhoneNumberFromString
exports['default'] = parsePhoneNumberFromString

exports.parsePhoneNumberFromString = parsePhoneNumberFromString

