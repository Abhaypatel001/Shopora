const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// ==========================================
// UPLOAD BUFFER TO CLOUDINARY
// ==========================================
const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "shopora/products",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error(
              "Cloudinary upload error:",
              error
            );

            reject(error);
            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

    uploadStream.end(file.buffer);
  });
};


// ==========================================
// DELETE CLOUDINARY IMAGE
// ==========================================
const deleteImageFromCloudinary = async (
  publicId
) => {
  if (!publicId) {
    return;
  }

  try {
    const result =
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image",
          invalidate: true,
        }
      );

    console.log(
      "Cloudinary delete result:",
      result
    );

    return result;
  } catch (error) {
    console.error(
      "Cloudinary delete error:",
      error
    );
  }
};


// ==========================================
// CREATE PRODUCT
// ==========================================
const createProduct = async (req, res) => {
  try {
    console.log(
      "Uploaded file:",
      req.file
    );

    const productData = {
      name: req.body.name,
      category: req.body.category,

      price: Number(req.body.price),
      oldPrice: Number(
        req.body.oldPrice || 0
      ),

      rating: Number(
        req.body.rating || 0
      ),

      reviews: Number(
        req.body.reviews || 0
      ),

      description:
        req.body.description || "",

      stock: Number(
        req.body.stock || 0
      ),

      section:
        req.body.section ||
        "trending",

      sortOrder: Number(
        req.body.sortOrder || 0
      ),

      image: "",
      imagePublicId: "",
    };

    // ----------------------------------------
    // IMAGE UPLOAD
    // ----------------------------------------
    if (req.file) {
      const uploadedImage =
        await uploadImageToCloudinary(
          req.file
        );

      if (!uploadedImage?.url) {
        return res.status(500).json({
          success: false,
          message:
            "Image upload failed",
        });
      }

      productData.image =
        uploadedImage.url;

      productData.imagePublicId =
        uploadedImage.publicId;

      console.log(
        "Cloudinary image URL:",
        productData.image
      );

      console.log(
        "Cloudinary public ID:",
        productData.imagePublicId
      );
    }

    const product =
      await Product.create(
        productData
      );

    res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
    });

  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create product",
    });
  }
};


// ==========================================
// GET ALL PRODUCTS
// ==========================================
const getProducts = async (req, res) => {
  try {
    const products =
      await Product.find().sort({
        section: 1,
        sortOrder: 1,
      });

    res.json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch products",
    });
  }
};


// ==========================================
// GET SINGLE PRODUCT
// ==========================================
const getProductById = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });

  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch product",
    });
  }
};


// ==========================================
// UPDATE PRODUCT
// ==========================================
const updateProduct = async (
  req,
  res
) => {
  try {
    // Get existing product first
    const existingProduct =
      await Product.findById(
        req.params.id
      );

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    const updateData = {
      name: req.body.name,
      category: req.body.category,

      price: Number(req.body.price),
      oldPrice: Number(
        req.body.oldPrice || 0
      ),

      rating: Number(
        req.body.rating || 0
      ),

      reviews: Number(
        req.body.reviews || 0
      ),

      description:
        req.body.description || "",

      stock: Number(
        req.body.stock || 0
      ),

      section:
        req.body.section ||
        "trending",

      sortOrder: Number(
        req.body.sortOrder || 0
      ),
    };

    let oldPublicId =
      existingProduct.imagePublicId;

    // ----------------------------------------
    // NEW IMAGE
    // ----------------------------------------
    if (req.file) {
      console.log(
        "New image received:",
        req.file.originalname
      );

      const uploadedImage =
        await uploadImageToCloudinary(
          req.file
        );

      if (!uploadedImage?.url) {
        return res.status(500).json({
          success: false,
          message:
            "Image upload failed",
        });
      }

      updateData.image =
        uploadedImage.url;

      updateData.imagePublicId =
        uploadedImage.publicId;

      console.log(
        "New Cloudinary URL:",
        updateData.image
      );

      console.log(
        "New Cloudinary public ID:",
        updateData.imagePublicId
      );
    }

    // ----------------------------------------
    // UPDATE DATABASE
    // ----------------------------------------
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    // ----------------------------------------
    // DELETE OLD IMAGE
    // Only after database update succeeded
    // ----------------------------------------
    if (
      req.file &&
      oldPublicId &&
      oldPublicId !==
        updateData.imagePublicId
    ) {
      await deleteImageFromCloudinary(
        oldPublicId
      );
    }

    res.json({
      success: true,
      message:
        "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update product",
    });
  }
};


// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    // ----------------------------------------
    // DELETE FROM DATABASE
    // ----------------------------------------
    await Product.findByIdAndDelete(
      req.params.id
    );

    // ----------------------------------------
    // DELETE IMAGE FROM CLOUDINARY
    // ----------------------------------------
    if (product.imagePublicId) {
      await deleteImageFromCloudinary(
        product.imagePublicId
      );
    }

    res.json({
      success: true,
      message:
        "Product deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete product",
    });
  }
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
