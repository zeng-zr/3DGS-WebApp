/**
 * 上传组件配置
 */

// 允许上传的最大文件大小 (MB)
export const MAX_FILE_SIZE = 800;

// 允许上传的文件类型
export const ACCEPTED_FILE_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];

// 上传API端点
export const UPLOAD_API_ENDPOINT = '/home/ubuntu/3DGSBACK/uploads';

// 上传配置
export const UPLOAD_CONFIG = {
  // 文件参数名
  fileFieldName: 'file',
  
  // 文件类型限制说明
  fileTypesText: '请上传视频文件 (MP4, MOV, WEBM, AVI)',
  
  // 文件大小限制说明
  fileSizeText: `视频文件必须小于${MAX_FILE_SIZE}MB`,
}; 