import { Router } from 'express'
import { create, login, logout, extend, getProfile, edit, getAll, remove } from '../controllers/users.js'
import * as auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'

const router = Router()

router.post('/', create)
router.post('/login', auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
router.get('/me', auth.jwt, getProfile)

router.get('/all', auth.jwt, admin, getAll)
router.patch('/me', auth.jwt, edit)
router.delete('/:id', auth.jwt, admin, remove)
export default router
