import { useForm } from "react-hook-form";
import { InputText } from "@alpac/design-system";
import type { PersonalFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
const PersonalInformation = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PersonalFormData>({
    defaultValues: {
      firstName: "Luis",
      lastName: "Alberto",
      username: "luisito",
      email: "example@example.com",
      phone: "+505 84858976",
      newPassword: "",
      confirmPassword: "",
      role: "Desarrollador",
    },
  });
  const onSubmit = (data: PersonalFormData) => {
    console.log("enviar a la api :", data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 w-full"
    >
      <section className="space-y-6 md:space-y-8">
        <div className="flex items-center gap-3">
          <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold shadow-sm">
            1
          </span>
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
            Perfil
          </h3>
        </div>

        <div className="space-y-4">
          <InputText
            label="Nombre"
            editable
            error={errors.firstName?.message}
            {...register("firstName", { required: "El nombre es obligatorio" })}
          />
          <InputText
            label="Apellido"
            editable
            error={errors.lastName?.message}
            {...register("lastName", {
              required: "El apellido es obligatorio",
            })}
          />
          <InputText
            label="Nombre de usuario"
            editable
            error={errors.username?.message}
            {...register("username", {
              required: "El usuario es obligatorio",
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
            })}
          />
          <InputText label="Rol en la empresa" disabled {...register("role")} />
        </div>
      </section>
      <section className="space-y-6 md:space-y-8 flex flex-col h-full">
        <div className="flex items-center gap-3">
          <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold shadow-sm">
            2
          </span>
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
            Seguridad y Contacto
          </h3>
        </div>
        <div className="space-y-4 grow">
          <InputText
            label="Correo electrónico"
            type="email"
            editable
            error={errors.email?.message}
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Correo electrónico no válido",
              },
            })}
          />
          <InputText
            label="Teléfono personal"
            type="tel"
            editable
            {...register("phone")}
          />

          <InputText
            label="Nueva contraseña"
            placeholder="••••••••"
            isPassword
            editable
            error={errors.newPassword?.message}
            {...register("newPassword", {
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
          />
          <InputText
            label="Confirmar contraseña"
            placeholder="••••••••"
            isPassword
            editable
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              validate: (val) => {
                if (watch("newPassword") && watch("newPassword") !== val) {
                  return "Las contraseñas no coinciden";
                }
              },
            })}
          />
        </div>

        <div className="pt-6 mt-auto flex justify-end">
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-[10px] transition-colors shadow-sm focus:ring-4 focus:ring-blue-100"
          >
            Guardar cambios
          </button>
        </div>
      </section>
    </form>
  );
};

export default PersonalInformation;
