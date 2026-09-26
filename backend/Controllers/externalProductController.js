const axios = require("axios");

const searchExternalProducts = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const apiKey = process.env.SERPAPI_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "SERPAPI_KEY is missing in backend .env",
      });
    }

    const response = await axios.get(
      "https://serpapi.com/search.json",
      {
        params: {
          engine: "google_shopping",
          q: query,
          api_key: apiKey,
          location: "India",
          gl: "in",
          hl: "en",
        },
      }
    );

    const results = response.data?.shopping_results || [];

    const products = results.map((item, index) => ({
      id:
        item.product_id ||
        `external-${Date.now()}-${index}`,

      name: item.title || "Product",

      price: Number(item.extracted_price || 0),

      old: Number(item.extracted_old_price || 0),

      rating: Number(item.rating || 0),

      reviews: Number(item.reviews || 0),

      img:
        item.thumbnail ||
        item.serpapi_thumbnail ||
        "",

      source: item.source || "External Store",

      productLink:
        item.product_link ||
        item.link ||
        "",

      delivery: item.delivery || "",

      external: true,
    }));

    return res.status(200).json({
      success: true,
      query,
      products,
    });
  } catch (error) {
    console.error(
      "External product search error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "External product search failed.",
    });
  }
};

module.exports = {
  searchExternalProducts,
};