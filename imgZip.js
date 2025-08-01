const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const dir = path.resolve(__dirname, "BD/static"); // 指定图片目录

fs.readdirSync(dir).forEach((file) => {
  const ext = path.extname(file).toLowerCase();
  if ([".jpg", ".jpeg", ".png"].includes(ext)) {
    const filePath = path.join(dir, file);
    sharp(filePath)
      .jpeg({ quality: 70 }) // 压缩质量可调整
      .toBuffer()
      .then((data) => {
        fs.writeFileSync(filePath, data);
        console.log("压缩完成:", file);
      })
      .catch((err) => console.error("压缩失败:", file, err));
  }
});
