module.exports = async function findAndReplace(
  zuid,
  fieldName,
  substr,
  newSubstr
) {
  if (!zuid || !fieldName || !substr || !newSubstr) {
    throw new Error(
      "All function parameters are required. findAndReplace(zuid, fieldName, substr, newSubstr"
    );
  }

  // Determine ZUID is item or model
  const prefix = zuid.trim().charAt(0);
  if (prefix != 6 && prefix != 7) {
    throw new Error(
      `Find and replace actions are only allowed on content items and models. Unsupported zuid ${zuid} provided.`
    );
  }

  // Dynamically determine SDK call
  const funcName = prefix == "6" ? "getItems" : "getItem";
  const res = await this.instance[funcName](zuid);

  let dirty = [];

  // Replace values
  res.data.forEach(item => {
    if (item.data && item.data[fieldName]) {
      // Coerce value to string to ensure we can run `replace`
      const value = String(item.data[fieldName]);

      if (value) {
        const newValue = value.replace(substr, newSubstr);
        if (value !== newValue) {
          item.data[fieldName] = newValue;
          dirty.push(item);
        }
      }
    }
  });

  // Update dirty items
  return Promise.all(
    dirty.map(item => {
      console.log(`Updating item: ${item.meta.ZUID}`);

      return this.instance.updateItem(
        item.meta.contentModelZUID,
        item.meta.ZUID,
        item
      );
    })
  );
};
