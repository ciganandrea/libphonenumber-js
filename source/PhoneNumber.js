import Metadata from './metadata.js'
import isPossibleNumber from './isPossibleNumber_.js'
import isValidNumber from './validate_.js'
import isValidNumberForRegion from './isValidNumberForRegion_.js'
import getNumberType from './helpers/getNumberType.js'
import getPossibleCountriesForNumber from './helpers/getPossibleCountriesForNumber.js'
import formatNumber from './format_.js'

const USE_NON_GEOGRAPHIC_COUNTRY_CODE = false

export default class PhoneNumber {
	constructor(countryCallingCode, nationalNumber, metadata) {
		if (!countryCallingCode) {
			throw new TypeError('`country` or `countryCallingCode` not passed')
		}
		if (!nationalNumber) {
			throw new TypeError('`nationalNumber` not passed')
		}
		if (!metadata) {
			throw new TypeError('`metadata` not passed')
		}
		const _metadata = new Metadata(metadata)
		// If country code is passed then derive `countryCallingCode` from it.
		// Also store the country code as `.country`.
		if (isCountryCode(countryCallingCode)) {
			this.country = countryCallingCode
			_metadata.country(countryCallingCode)
			countryCallingCode = _metadata.countryCallingCode()
		} else {
			/* istanbul ignore if */
			if (USE_NON_GEOGRAPHIC_COUNTRY_CODE) {
				if (_metadata.isNonGeographicCallingCode(countryCallingCode)) {
					this.country = '001'
				}
			}
		}
		this.countryCallingCode = countryCallingCode
		this.nationalNumber = nationalNumber
		this.number = '+' + this.countryCallingCode + this.nationalNumber
		this.metadata = metadata
	}

	setExt(ext) {
		this.ext = ext
	}

	getPossibleCountries() {
		if (this.country) {
			return [this.country]
		}
		return getPossibleCountriesForNumber(
			this.countryCallingCode,
			this.nationalNumber,
			this.metadata
		)
	}

	isPossible() {
		return isPossibleNumber(this, { v2: true }, this.metadata)
	}

	isValid() {
		return isValidNumber(this, { v2: true }, this.metadata)
	}

	isNonGeographic() {
		const metadata = new Metadata(this.metadata)
		return metadata.isNonGeographicCallingCode(this.countryCallingCode)
	}

	isEqual(phoneNumber) {
		return this.number === phoneNumber.number && this.ext === phoneNumber.ext
	}

	// // Is just an alias for `this.isValid() && this.country === country`.
	// // https://github.com/googlei18n/libphonenumber/blob/master/FAQ.md#when-should-i-use-isvalidnumberforregion
	// isValidForRegion(country) {
	// 	return isValidNumberForRegion(this, country, { v2: true }, this.metadata)
	// }

	getType() {
		return getNumberType(this, { v2: true }, this.metadata)
	}

	format(format, options) {
		return formatNumber(
			this,
			format,
			options ? { ...options, v2: true } : { v2: true },
			this.metadata
		)
	}

	formatNational(options) {
		return this.format('NATIONAL', options)
	}

	formatInternational(options) {
		return this.format('INTERNATIONAL', options)
	}

	getURI(options) {
		return this.format('RFC3966', options)
	}
}

const isCountryCode = (value) => /^[A-Z]{2}$/.test(value)