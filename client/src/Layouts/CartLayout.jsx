import { Outlet } from "react-router"
import { CartProvider } from "../context/CartContext"
import { Header } from "@/components/usuario/Header"


export const CartLayout = () => {

  return (
    <CartProvider>
      <div className="relative not-first:h-full">
        <Header />
        <Outlet />
      </div>
    </CartProvider>
  )
}
