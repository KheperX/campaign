declare global {
  namespace Express {
    interface Request {
      user?: any; // หรือกำหนด type ให้ชัดเจน เช่น UserPayload
    }
  }
}
