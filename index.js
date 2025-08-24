import express from 'express';
import { dbConnection } from './database/dbConnection.js';
import { userRouter } from './source/modules/user/userRoutes.js';
import { addressRouter } from './source/modules/address/addressRoutes.js';
import { bookRouter } from './source/modules/book/bookRoutes.js';
import { cartRouter } from './source/modules/cart/cartRoutes.js';
import { wishlistRouter } from './source/modules/wishlist/wishlistRoutes.js';
import { orderRouter } from './source/modules/order/orderRoutes.js';

const app = express();
dbConnection;
app.use(express.json());
app.use(userRouter);
app.use(addressRouter);
app.use(bookRouter);
app.use(cartRouter);
app.use(wishlistRouter);
app.use(orderRouter);

app.listen(3000, () => {
    console.log("server running: http://localhost:3000");
})