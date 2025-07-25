import {PayPalButtons,PayPalScriptProvider} from "@paypal/react-paypal-js"


const PayPalButton = ({amount,onSuccess,onError}) => {
  return (
   <PayPalScriptProvider
        options={{"client-id" : "AfvV4sqnicxlUUwarf2GEonxtbl9uzpUn7y103I3VwvCM93wQNmmMv1801rFRTWQHRO_bx1xwYLOSB0L"}}>
    <PayPalButtons
      style={{layout:"vertical"}}
       createOrder={(date,actions)=>{
          return actions.order.create({
            purchase_units :[{amount:{value: amount}}]
        })
      }}

      onApprove = {(date,actions)=>{
        return actions.order.capture().then(onSuccess)
       }}
      onError={onError}
    />
   </PayPalScriptProvider>
  )
}

export default PayPalButton