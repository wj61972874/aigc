const MODAL_TYPE_ENUM = {
  CONTENT_GENERATE: "CONTENT_GENERATE",
  CONTENT_CENSOR: "CONTENT_CENSOR",
};

const config = {
  [MODAL_TYPE_ENUM.CONTENT_GENERATE]: {
    name: "modal_jay_test",
    client_id: "PbN0DATzeJ41yR6gjkeAgcBH",
    client_secret: "UHcAr2yCbKIJnj492XXUZIKNMdEubSRA",
    apiContentType: "body",
  },
  [MODAL_TYPE_ENUM.CONTENT_CENSOR]: {
    name: "Jay_content_check",
    client_id: "kF9ufEg5wNeAp3Fut82pi0eZ",
    client_secret: "RR2B0A2XTiYPPD7tuDJT1z6HIs7VqGfG",
    strategyId: 34636,
    apiContentType: "form",
  },
};

module.exports = { MODAL_TYPE_ENUM, config };
