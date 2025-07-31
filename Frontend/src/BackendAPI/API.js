const backendMainDomainURL = 'https://kirana-store-e-commerce.onrender.com'
//const backendMainDomainURL = "http://localhost:3000";
const backendRoutesAPI = {
    signup: {
        url: `${backendMainDomainURL}/api/v1/customer/signup`,
        method: "post"
    },
    signin: {
        url: `${backendMainDomainURL}/api/v1/customer/login`,
        method: "post"
    },
    signout: {
        url: `${backendMainDomainURL}/api/v1/customer/logout`,
        method: "post"
    },
    forgotPassword: {
        url: `${backendMainDomainURL}/api/v1/customer/forgotPassword`,
        method: "post"
    },
    updatePassword: {
        url: `${backendMainDomainURL}/api/v1/customer/updatePassword`,
        method: "post"
    },
    verifyOtp: {
        url: `${backendMainDomainURL}/api/v1/customer/verifyOtp`,
        method: "post"
    },
    current_user: {
        url: `${backendMainDomainURL}/api/v1/customer/customer-details`,
        method: "get"
    },
    guestCustomerCartDetail: {
        url: `${backendMainDomainURL}/api/v1/customer/guestCustomerCartDetail`,
        method: "post"
    },
    loggedInCustomerCartDetail: {
        url: `${backendMainDomainURL}/api/v1/customer/loggedInCustomerCartDetail`,
        method: "post"
    },
    getCustomerCartDetail: {
        url: `${backendMainDomainURL}/api/v1/customer/getCustomerCartDetail`,
        method: "get"
    },
    updateCartProductCount: {
        url: `${backendMainDomainURL}/api/v1/customer/productCountUpdation`,
        method: "post"
    },
    deleteItemFromCart: {
        url: `${backendMainDomainURL}/api/v1/customer/removeItemFromCart`,
        method: "post"
    },
    customerUpdateInfo: {
        url: `${backendMainDomainURL}/api/v1/customer/customerUpdateInfo`,
        method: "post"
    },
    updatingCustomerEmailPhase1: {
        url: `${backendMainDomainURL}/api/v1/customer//customerUpdateEmail/Phase1`,
        method: "post"
    },
    updatingCustomerEmailPhase2: {
        url: `${backendMainDomainURL}/api/v1/customer//customerUpdateEmail/Phase2`,
        method: "post"
    },
    modifyAddress: {
        url: `${backendMainDomainURL}/api/v1/customer//Customer/modify/Address`,
        method: "post"
    },
    addNewAddress: {
        url: `${backendMainDomainURL}/api/v1/customer//Customer/add/newAddress`,
        method: "post"
    },
    admin: {
        showAllUser: {
            url: `${backendMainDomainURL}/api/v1/admin/show-all-customer`,
            method: "get"
        },
        updateUserRole: {
            url: `${backendMainDomainURL}/api/v1/admin/customer-role-update`,
            method: "post"
        },
        uploadImage: {
            url: `${backendMainDomainURL}/api/v1/admin/upload-image`,
            method: "post"
        },
        deleteProductImage_WhileUploading: {
            url: `${backendMainDomainURL}/api/v1/admin/delete-image`,
            method: "post"
        },
        addProduct: {
            url: `${backendMainDomainURL}/api/v1/admin/add-product`,
            method: "post"
        },
        showProduct: {
            url: `${backendMainDomainURL}/api/v1/admin/show-products`,
            method: "get"
        },
        getCurrentProduct: {
            url: `${backendMainDomainURL}/api/v1/admin/getOneProductData`,
            method: "post"
        },
        updateImageInfo: {
            url: `${backendMainDomainURL}/api/v1/product/productImageUpdate`,
            method: "post"
        },
        updateProductInfoData: {
            url: `${backendMainDomainURL}/api/v1/product/productInfoDataUpdate`,
            method: "post"
        },
    },
    homePageAPI: {
        showCategories: {
            url: `${backendMainDomainURL}/api/v1/product/showCategories`,
            method: "get"
        },
        subCategoryWiseProduct: {
            url: `${backendMainDomainURL}/api/v1/product/subCategoryWiseProduct`,
            method: 'post'
        },
        categoryWiseProduct: {
            url: `${backendMainDomainURL}/api/v1/product/categoryWiseProduct`,
            method: 'post'
        }
    },
    createOrder: {
        url: `${backendMainDomainURL}/api/v1/paymentandorder/createOrder`,
        method: 'post'
    },
    verifyPayment: {
        url: `${backendMainDomainURL}/api/v1/paymentandorder/verifyPayment`,
        method: 'post'
    },
    specificOrderDetail: {
        url: `${backendMainDomainURL}/api/v1/paymentandorder/SpecificOrderData`,
        method: 'post'
    },
    getCurrentCustOrderDetail: {
        url: `${backendMainDomainURL}/api/v1/paymentandorder/CustomerOrderDetail`,
        method: 'get'
    },
    searchProductFromBackend:{
        url: `${backendMainDomainURL}/api/v1/product/search`,
        method: 'get'
    },
    addProductReview: (productId) => ({
        url: `${backendMainDomainURL}/api/v1/product/${productId}/reviews`,
        method: "post",
    }),
}
export default backendRoutesAPI