const checkout={
    _id:"1213",
    createAt:new Date(),
    checkoutItems:[
        {
            productId:"1",
            name:"jacket",
            color:"black",
            size:"M",
            price:150,
            quantity:1,
            image:"https://picsum.photos/150?random=1",
        },
        {
            productId:"2",
            name:"jean",
            color:"blue",
            size:"L",
            price:50,
            quantity:3,
            image:"https://picsum.photos/150?random=2",
        },
        {
            productId:"3",
            name:"T-shirt",
            color:"white",
            size:"M",
            price:130,
            quantity:2,
            image:"https://picsum.photos/150?random=3",
        },
    ],
    shippingAddress:{
        address: "123 Fashion Street",
        city: " New York",
        country:"USA"
    }
}
const OrderConfirmationPage = () => {
    const calculateEstimatedDelivery = (createAt)=>{
        const orderDate = new Date(createAt)
        orderDate.setDate(orderDate.getDate() + 10) // add 10 days to the order date 
        return orderDate.toLocaleDateString()
    }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
        <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">Thank You For Your Order !</h1>
        {checkout && (
            <div className="p-6 rounded-lg border">
                <div className="flex justify-between mb-200">
                    {/* Order Id and Date  */}
                    <div>
                        <h2 className="text-xl font-semibold">
                            Order ID :{checkout._id}
                        </h2>
                        <p className="text-gray-500">
                            Order date : {new Date(checkout.createAt).toLocaleDateString()}
                        </p>
                    </div>
                    {/* Estimated Delivery */}
                    <div>
                        <p className="text-emerald-700 text-sm">
                        Estimated Delivery:{" "}{calculateEstimatedDelivery(checkout.createAt)}
                        </p>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default OrderConfirmationPage