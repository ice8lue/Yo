'use strict';

// Imports
const taffy = require('node-taffydb').TAFFY,
			jsonfile = require('jsonfile'),
			moment = require('moment'),
			Table = require('cli-table'),
			fs = require('fs');

const util = require('./util.js');

// Database initialization
const datafile = __dirname + '/../yo.json';
const data = fs.existsSync(datafile) ? require(datafile) : {
	tracks: []
};

const db = taffy(data && data.tracks || []);
const last = db().last();

/**
 * Default method to start/stop tracking.
 * @param {Array} args
 * @param {Object} options
 * @param {Function} logger
 * @constructor
 */
const track = (args, options, logger) => {

	let track = {};

	if (last && last.end || !last) { // no old track or old track has an end --> create new track
		
		track.start = util.getDate()

		db.insert(track);

		logger.info('\nYo, tracking started!');

	} else { // finish old track

		track.end = util.getDate();

		db(last.___id).update(track)

		logger.info('\nDone, huh? Yo!');

	}

	// save dataset
	data.tracks = db().get();
	jsonfile.writeFileSync(datafile, data, { spaces: 2 });

};

/**
 * Edit last saved track.
 * @param {Array} args
 * @param {Object} options
 * @param {Function} logger
 * @constructor
 */
const edit = (args, options, logger) => {

  // no settings? sorry ;)
  if (!(Object.keys(options) || []).length) {
    logger.error('\nYo dawg, ain\'t no edit without settings.');
  }

};

/**
 * Prints a nice table report.
 * @param {Array} args
 * @param {Object} options
 * @param {Function} logger
 * @constructor
 */
const list = (args, options, logger) => {
  const tracks = db().get();

  if (!tracks.length) {
    logger.error('\nNo tracks found, yo.')
  } else {

    logger.info('\nYo, here\'s your report:');

    let table = new Table({
      head: [
        'Date',
        'From',
        'To',
        'Duration',
        'Task'
      ]
    });

    let duration;

    for (let i = 0, len = tracks.length; i < len; i++) {

      if (!tracks[i] || !tracks[i].start) {
        continue;
      }

      duration = null;

      if (tracks[i].end) {
        duration = util.getDiff(tracks[i].start, tracks[i].end);
      }

      table.push([
        moment(tracks[i].start).format('YYYY-MM-DD'),
        moment(tracks[i].start).format('HH:mm'),
        tracks[i].end ? moment(tracks[i].end).format('HH:mm') : 'running',
        tracks[i].end && duration ? duration : '--:--',
        tracks[i].task || ''
      ]);

    }

    logger.info('\n' + table.toString());

  }
};

/**
 * Clear local db.
 * @param {Array} args
 * @param {Object} options
 * @param {Function} logger
 * @constructor
 */
const clear = (args, options, logger) => {

  const tracks = db().get();

  if (tracks.length) {
    data.tracks = [];
    jsonfile.writeFileSync(datafile, data, { spaces: 2 });
    logger.info('\nYo, cleared ' + tracks.length + ' tracks.');
  } else {
    logger.error('\nNo tracks found, yo.')
  }

};

// Exports
module.exports = {
	track,
	edit,
	list,
	clear
};