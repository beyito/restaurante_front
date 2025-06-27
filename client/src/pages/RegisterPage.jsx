
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Toaster } from "@/components/ui/sonner.jsx";
import { toast } from "sonner";

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, } = useForm()
  const { signUp, errors: RegisterError } = useAuth()


  const onSubmit = handleSubmit(async (values) => {
    signUp(values)
    toast.success("Usuario creado correctamente, inicia sesión para continuar", {
      position: "top-center",
    })
    setTimeout(() => {
      navigate("/login")
    }, 3000)
  })

  return (
    <div className="flex items-center justify-center w-screen mt-15">
      <Toaster richColors />
      <Card className=" w-full max-w-md shadow-lg rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Create an Account
          </CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {RegisterError.map((error, i) => (
              <Alert key={i} variant="destructive">
                <AlertDescription>{error.msg}</AlertDescription>
              </Alert>
            ))}
            <div>
              <Label className="mb-2" htmlFor="nombre">nombre</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Enter your username"
                {...register("nombre", { required: true })}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">nombre es requerido</p>
              )}
            </div>
            <div>
              <Label className="mb-2" htmlFor="nombreUsuario">nombreUsuario</Label>
              <Input
                id="nombreUsuario"
                type="text"
                placeholder="Enter your username"
                {...register("nombreUsuario", { required: true })}
              />
              {errors.nombreUsuario && (
                <p className="text-red-500 text-sm mt-1">nombre de Usuario es requerido</p>
              )}
            </div>
            <div>
              <Label className="mb-2" htmlFor="correo">correo</Label>
              <Input
                id="correo"
                type="email"
                placeholder="Enter your email"
                {...register("correo", { required: true })}
              />
              {errors.correo && (
                <p className="text-red-500 text-sm mt-1">Correo es requerido</p>
              )}
            </div>
            <div>
              <Label className="mb-2" htmlFor="direccion">direccion</Label>
              <Input
                id="direccion"
                type="text"
                placeholder="Enter your address"
                {...register("direccion", { required: true })}
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="telefono">telefono</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="Enter your phone number"
                {...register("telefono", { required: true })}
              />
              {errors.telefono && (
                <p className="text-red-500 text-sm mt-1">telefono es requerido</p>
              )}
            </div>
            <div>
              <Label className="mb-2" htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">password es requerido</p>
              )}
            </div>
            <div>
              <Label className="mb-2" htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Confirm your password"
                {...register("confirm", { required: true })}
              />
              {errors.confirm && (
                <p className="text-red-500 text-sm mt-1">confirmar password</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 mt-5">
            <Button type="submit" className="w-full">
              Register
            </Button>
            <p className="flex gap-x-2 justify-between text-sm">
              ¿ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="text-purple-700"
              >
                Inicia Sesion
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
