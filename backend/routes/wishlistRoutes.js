import { Router } from 'express'
import {
  listWishlist, addToWishlist, removeFromWishlist, removeByItem,
} from '../controllers/wishlistController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', listWishlist)
router.post('/', addToWishlist)
router.delete('/item/:type/:itemId', removeByItem)
router.delete('/:id', removeFromWishlist)

export default router
