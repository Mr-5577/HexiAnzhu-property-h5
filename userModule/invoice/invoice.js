/** 发票类型 */
export const invoiceTypeEnum = ["增值税普通发票", "增值税专用发票"];
/** 缴费状态 */
export const paymentStatusEnum = [
  { text: "未交", value: 0, cls: "status-pending" },
  { text: "已交", value: 1, cls: "status-success" },
  { text: "免交", value: 2, cls: "status-pending" },
  { text: "VIP", value: 3, cls: "status-success" },
];
/** 开票状态 */
export const invoiceStatusEnum = [
  { text: "未开票", value: "0", cls: "status-pending" },
  { text: "开票中", value: "1", cls: "status-processing" },
  { text: "已开票", value: "2", cls: "status-success" },
  { text: "开票失败", value: "3", cls: "status-fail" },
];
