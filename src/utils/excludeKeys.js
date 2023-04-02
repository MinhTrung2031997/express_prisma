exports.exclude = (model, keys) => {
  for (let key of keys) {
    delete model[key];
  }
  return model;
};
