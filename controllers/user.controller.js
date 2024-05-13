//import Post model
const Post = require('./../model/Post.model')

exports.getAllPosts = async (req, res) => {
  const { state, page = 1, orderBy } = req.query; // Extract state, page, and orderBy from query parameters

  try {
    let query = { authorId: req.user._id };

    // Set default state to "published" if not provided
    query.state = state || "published";

    const perPage = 20; // Number of posts per page
    const currentPage = parseInt(page);
    const orderByOptions = ['read_count', 'reading_time', 'timestamp'];

    let sortOption = '-timestamp'; // Default sort option

    // Check if orderBy is provided and is one of the allowed options
    if (orderBy && orderByOptions.includes(orderBy)) {
      sortOption = orderBy === 'timestamp' ? '-' + orderBy : '-' + orderBy; // Sort in descending order for read_count and reading_time
    }

    const totalCount = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const skip = perPage * (currentPage - 1);

    const posts = await Post.find(query)
      .sort(sortOption) // Apply sorting
      .skip(skip)
      .limit(perPage);

    res.status(200).json({
      status: 'success',
      currentPage,
      totalPages,
      totalCount,
      posts,
    });
  } catch (err) {
    throw err;
  }
};

