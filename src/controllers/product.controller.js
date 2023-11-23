// const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");
const { SuccessResponse } = require("../core/success.response");

class ProductController {
    createProduct = async (req, res, next) => {
        // new SuccessResponse({
        //     message: "create new product success",
        //     metadata: await ProductService.createProduct(
        //         req.body.product_type,
        //         {
        //             ...req.body,
        //             product_shop: req.user.userId,
        //         }
        //     ),
        // }).send(res);
        //v2
        new SuccessResponse({
            message: "create new product success",
            metadata: await ProductServiceV2.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    };

    //updateProduct
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: `Update product success`,
            metadata: await ProductServiceV2.updateProduct(
                req.body.product_type,
                req.params.productId,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    };

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "List search product",
            metadata: await ProductServiceV2.getListSearchProduct(req.params),
        }).send(res);
    };

    publicProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "publish product by shop success",
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res);
    };
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "unPublish product by shop success",
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res);
    };
    // QUERY //
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "get list draft for shop",
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "get list publish for shop",
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "List Products",
            metadata: await ProductServiceV2.findAllProducts(req.query),
        }).send(res);
    };
    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Product detail",
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id,
            }),
        }).send(res);
    };
    // END QUERY //
}

module.exports = new ProductController();
