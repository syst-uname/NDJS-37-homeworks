import { Router } from "express";

const router = Router();

// авторизация
router.post('/login', (req, res) => {
  res.status(201)
  res.json({ id: 1, mail: "test@mail.ru" })
})

export default router