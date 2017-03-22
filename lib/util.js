'use strict';

// Imports
const moment = require('moment');

const getDate = (d) => {
	d = d && d.replace(' ', 'T');
	d = moment(d);
	return (d.isValid() ? d : moment()).format();
};

const pad = (n, width, z) => {
  z = z || '0';
  n = n + '';

  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

const getDiff = (from, to) => {
	if (!from || !to) {
		return '';
	}

	from = moment(from);
	to = moment(to);

	if (!moment(from).isValid() || !moment(to).isValid()) {
		return '';
	}

	let dur = moment.duration(to.diff(from));
	let hh = pad('' + dur.hours(), 2),
			mm = pad('' + dur.minutes(), 2);

		return '' + hh + ':' + mm;
};

// Exports
module.exports = {
	pad,
	getDate,
	getDiff
}