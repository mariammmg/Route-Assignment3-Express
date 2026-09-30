var longestCommonPrefix = function (strs) {
  let prefix= strs[0];
  for (let i = 1; i < strs.length; i++) {
    let word = strs[i];
    while(word.startsWith(prefix) === false){
      prefix = prefix.slice(0, -1);
      if (prefix === "") {
        return "";
      }
    }
  }
  return prefix;
};
