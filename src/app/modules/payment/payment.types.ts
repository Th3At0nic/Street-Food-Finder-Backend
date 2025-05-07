// export default interface iOrder {
//   user: Types.ObjectId
//   car: Types.ObjectId[]
//   quantity: number
//   status: 'pending' | 'cancled' | 'paid'
// }

export default interface iOrder {
  user: {
    id: string;
  }; // Reference to User model // Array of objects with car ID and quantity
  status?: 'Pending' | 'Paid' | 'Shipped' | 'Completed' | 'Cancelled'; // Order status
  transaction?: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
  totalPrice: number;
}

// export type OrderMethod = {
//     isOrderExits(id:string): Promise<iOrder>
// }
// export type OrderModel = Model<iOrder, Record<string,never>, OrderMethod>
