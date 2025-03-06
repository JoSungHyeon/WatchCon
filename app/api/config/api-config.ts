export const apiConfig = {
  MAIN: {
    DOWNLOAD: '/download_link/top',
    NOTICE: '/notice/list',
  },

  AUTH: {
    LOGIN: '/user/login',
    LOGOUT: '/user/logout',
    FIND_ID: '/user/find-id',
    FIND_PASSWORD: '/user/request-reset-password',
    VERIFY_OTP: '/user/verify-otp',
    CHANGE_PASSWORD: '/user/reset-password',
    ADMIN: {
      LOGIN: '/admin/user/login',
      LOGOUT: '/admin/user/logout',
    },
  },

  WATCHCON: {
    TOTAL_LIST: {
      GET: '/admin/dashboard/total-list',
    },
    BLACK_LIST: {
      GET: '/admin/dashboard/black-list',
      PUT: '/admin/dashboard/black-list',
    },
    DISABLED_LIST: {
      GET: '/admin/dashboard/disable-list',
    },
  },

  PRICING: {
    PRICE_LIST: {
      GET: 'admin/price/list',
      ACTION: 'admin/price/:priceId',
      POST: 'admin/price',
    },

    DISCOUNT_LIST: {
      GET: 'admin/discount/list',
      ACTION: 'admin/discount/:discountId',
      POST: 'admin/discount',
    },

    FEATURE_LIMIT: {
      GET: 'admin/price_feature/list',
      ACTION: 'admin/price_feature/:priceFeatureId',
      POST: 'admin/price_feature',
    },

    PUBLIC: {
      PRICE: '/price/list',
      FEATURE: '/price_feature/list',
      FEATURE_LIMIT: '/price_feature/list',
    },
  },

  FAQ: {
    MAIN: 'faq/list',
    ADMIN: {
      GET: 'admin/faq/list',
      ACTION: 'admin/faq/:faqId',
      CREATE: 'admin/faq',
    },

    CATEGORY: {
      GET: 'admin/faq_category/list',
      CREATE_UPDATE: 'admin/faq_category',
      DELETE: 'admin/faq_category/:categoryId',
    },
  },

  USER: {
    USER_LIST: {
      GET: 'admin/user/list',
    },
    MAILING_LIST: {
      GET: 'admin/mail/list',
      POST: 'admin/mail',
      RESULT: 'admin/mail_result/list',
      DETAIL: 'admin/mail/detail-info',
    },
  },

  NOTICE: {
    LIST: {
      GET: 'admin/notice/list',
      POST: 'admin/notice',
      ACTION: 'admin/notice/:noticeId',
    },
  },

  PURCHASE: {
    GET: '/admin/purchase/list',
  },

  CONTACT: {
    POST: '/contact_us',
    UPLOAD: '/ftp',
  },

  REQUEST: {
    POST: '/request',
    LIST: {
      GET: '/request/list',
    },
    CREATE: '/request',
    DELETE: '/request/:requestId',
    DETAIL: '/request/:requestId',
  },

  REPLY: {
    GET: '/admin/request_reply/list',
    POST: '/admin/request_reply',
    ITEM_GET: '/admin/request_reply?request_id=:requestId',
    UPLOAD: '/ftp',
  },

  ADDRESS: {
    LIST: {
      GET: '/address_book/list',
    },
    CREATE: '/address_book',
    DELETE: '/address_book/',
    UPDATE: '/address_book/',

    TAG: {
      GET: '/tag/list',
      CREATE: '/tag',
      UPDATE: '/tag',
      DELETE: '/tag/:tagId',
    },
  },

  LICENSE: {
    LIST: {
      GET: '/user/license/list',
    },

    PURCHASE: {
      LIST: {
        GET: '/purchase/',
      },
      CANCEL: '/purchase/v3',

      AUTO_RENEWAL: '/admin/user_license',
    },
  },

  ECOMMERCE: {
    TOTAL_CONNECTION:
      'admin/dashboard/ecommerce/total-connection?options=:number',
    TOTAL_SALES:
      'admin/dashboard/ecommerce/total-purchase?options=:number',
    TOTAL_DOWNLOAD:
      'admin/dashboard/ecommerce/total-download?options=:number',
    TOTAL_USER:
      'admin/dashboard/ecommerce/total-user?options=:number',
    LIST_USER:
      'admin/dashboard/ecommerce/top-list?order=0&options=0&limit=20',
    GRAPH_CONNECTION_MONTH:
      'admin/dashboard/ecommerce/connection-trend?options=1',
    GRAPH_CONNECTION_WEEK:
      'admin/dashboard/ecommerce/connection-trend?options=0',
    GRAPH_DOWNLOAD_MONTH:
      'admin/dashboard/ecommerce/download-trend?options=1',
    GRAPH_DOWNLOAD_WEEK:
      'admin/dashboard/ecommerce/download-trend?options=0',
  },
} as const;
