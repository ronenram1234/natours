const express=require('express')

const router=express.Router()

const userControler=require('./../controllers/userController')

router.route('/').get(userControler.getAllUsers).post(userControler.createUser)
router.route('/:id').get(userControler.getUser).delete(userControler.deleteUser).patch(userControler.updateUser)

module.exports=router