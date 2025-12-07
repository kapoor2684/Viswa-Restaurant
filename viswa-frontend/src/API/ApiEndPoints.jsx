export const API_BASE_URL = 'http://localhost:2684';


export const API_ENDPOINTS = {

    LOGIN_BY_EMAIL: `/auth/login`,
    REGISTER_BY_EMAIL: `/auth/register`,


    ADD_FOOD_CATEGORY: `/foodcategories`,
    GET_FOOD_CATEGORIES: `/foodcategories`,

    GET_ALL_CUSTOMERS: `/customer`,
    UPDATE_CUSTOMER: (customerId) => `/customer/${customerId}`,
    GET_ALL_CUSTOMER_ADDRESSES: (customerId) => `/customer/${customerId}/addresses`,
    GET_CUSTOMER_CART_ITEMS: (customerId) => `/customer/${customerId}/cart`,

    ADD_FOOD_ITEM: `/fooditems`,
    GET_FOOD_ITEMS: `/fooditems`,
    GET_FOOD_ITEMS_BY_CATEGORY: (categoryId) => `/fooditems/category/${categoryId}`,

    Add_Address: `/addresses`,

    RESERVE_TABLE: `/reservetable`,
    All_BOOKED_TABLES: (date) => `/reservetable/booking?date=${date}`,
    RESERVE_PARTY_HALL: `/reservepartyhall`,

    CART_ADD_ITEM: `/cart/add`,
    CART_REMOVE_ITEM: `/cart/remove`,
    CART_CUSTOMER_ITEM: (customerId) => `/cart/${customerId}`,

    ORDERS: "/orders",

}