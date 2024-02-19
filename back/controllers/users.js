import users from '../models/users.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import validator from 'validator'

export const create = async (req, res) => {
  try {
    await users.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '帳號已註冊'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        phone: req.user.phone,
        email: req.user.email,
        role: req.user.role,
        cart: req.user.cartQuantity,
        avatar: req.user.avatar
      }
    })
  } catch (error) {
    console.log('controllers 登入錯誤')
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 登出
export const logout = async (req, res) => {
  try {
    req.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 舊換新
export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 取得使用者資料
export const getProfile = (req, res) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
        cart: req.user.cartQuantity,
        avatar: req.user.avatar
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 修改使用者資料
export const edit = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    // 1. 先把圖片路徑放進 req.body.image
    // 編輯時前端不一定會傳圖片，req.file 是 undefined，undefined 沒有 .path 所以要用 ?. 避免錯誤
    req.body.avatar = req.file?.path
    // 2. 再丟 req.body 更新資料，如果沒有圖片 req.file?.path 就是 undefined，不會更新圖片
    // .findByIdAndUpdate(要修改的資料 ID, 要修改的資料, { 更新時是否執行驗證: 預設 false })
    await users.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }).orFail(new Error('NOT FOUND')) // orFail() 如果沒有找到資料，就自動丟出錯誤

    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'ID 格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無使用者'
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

// 取得使用者資料
export const getAll = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = parseInt(req.query.sortOrder) || -1
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 20
    const page = parseInt(req.query.page) || 1
    const regex = new RegExp(req.query.search || '', 'i')

    const data = await users
      .find({
        $or: [{ account: regex }, { email: regex }]
      })
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage === -1 ? undefined : itemsPerPage)

    const total = await users.estimatedDocumentCount()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data,
        total
      }
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 刪除使用者資料
export const remove = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    await users.findByIdAndDelete(req.params.id).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'ID 格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無使用者'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

// 上傳圖片
export const avatar = async (req, res) => {
  try {
    /*
    console.log(req.file) -> 得到以下物件
    {
      fieldname: 'image',
      originalname: '0104.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      path: 'https://res.cloudinary.com/xxx.jpg',
      size: 46736,
      filename: 'wfsjhnj7mhucazq9rcpj'
    }
    */
    // 把大題貼改成這次檔案上傳的路徑
    req.user.avatar = req.file.path // 多檔上傳 req.files
    // 保存
    await req.user.save()
    // 回覆成功
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: req.user.avatar
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤'
    })
  }
}
