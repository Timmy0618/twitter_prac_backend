const { writeFile } = require("fs/promises");
//寫檔
exports.write = async (path, buffer) => {
  try {
    await writeFile(path, buffer);
    return true;
  } catch {
    return false;
  }

  // fs.writeFile(path, new Buffer.from(buffer, "base64"), (err) => {
  //   if (err) {
  //     console.log(err);
  //     return err;
  //   }
  //   console.log("The file has been saved!");
  //   return true;
  // });
};
