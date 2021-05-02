const ytsr = require('ytsr');

/**
 * Module for searching YouTube videos
 *
 * Query params
 * query: string to search for (required)
 * limit: limits the pulled items (default 1)
 *
 */

module.exports = async (req, res) => {
  const limit = req.query.limit || 1;
  const searchString = req.query.query;
  const returnNotFoundError = (res) => {
    res.status(404).json({
      status: 'error',
      message: 'No results found'
    });
  };

  if (!searchString) {
    return res.status(500).json({
      status: 'error',
      message: "'query' param is required"
    });
  }

  try {
    const filters = await ytsr.getFilters(searchString);
    const typeFilter = filters.get('Type').get('Video');

    if (typeFilter.url === null) {
      return returnNotFoundError(res);
    }

    const searchResults = await ytsr(typeFilter.url, { limit });

    if (searchResults === undefined) {
      return returnNotFoundError(res);
    }

    return res.json(searchResults);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
