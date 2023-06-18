function IsOwner(ids, userId) {
  for (let i = 0; i < ids.length; i++) {
    if (ids[i] === userId) {
      return true;
    }
  }
  return false;
}

module.exports = IsOwner;
