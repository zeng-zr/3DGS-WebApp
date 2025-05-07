import express from "express";
import multer from "multer";
import path from "path";
import fs, { fstat } from "fs";
import cors from "cors";
import {
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES,
  UPLOAD_API_ENDPOINT,
  UPLOAD_CONFIG,
} from "@/config/upload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(UploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    //需修改为和用户有关
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname);
  },
});

const Upload = multer({ storage });

// express应用
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); //中间件，允许跨域请求 app.use?

app.post("/api/upload", upload.single("video"), (req, res) => {
  //upload.single作用是？
  console.log("🎉 文件上传完成！");
  console.log("📄 文件信息：", req.file);
  console.log("📄 表单数据：", req.body);
  // 后续处理
  processUploadedFile(req.file);
  // 向前端返回响应
  res.status(200).json({
    // message: "文件上传成功",
    // filename: req.file.filename,
    // path: req.file.path,
  });
});

// 错误处理 app.use?
app.use((err, req, res, next) => {
  console.error("❌ 上传失败:", err.message); //err.message?
  res
  .status(500)
  .json({ error: "文件上传失败" });
});

// 启动服务器
app.listen(PORT,()=>{
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

function processUploadedFile(file){

}