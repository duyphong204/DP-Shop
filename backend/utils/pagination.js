const paginate = async (model, query = {}, { page = 1, limit = 10, sort = {} }) => {
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  const skip = (page - 1) * limit;
  const totalItems = await model.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  const results = await model
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return { results, page, totalPages, totalItems };
};

module.exports = { paginate };