const advancedResults = (model, populate) => async (req, res, next) => {
    const reqQuery = { ...req.query };

    // Queries to Exclude
    const removeQueries = ['select', 'sort', 'page', 'limit'];
    removeQueries.forEach(param => delete reqQuery[param]);

    // Filtering
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = model.find(JSON.parse(queryStr));

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        query = query.sort(req.query.sort);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    // Executing query
    const data = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) { // if not the last page
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) { // if not first page
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.advancedResults = {
        success: true, count: data.length, pagination, data
    };

    next();
};

module.exports = advancedResults;