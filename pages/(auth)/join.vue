<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        Invitación a la organización
      </h2>

      <div v-if="pending" class="text-gray-600">Validando invitación...</div>

      <div v-else-if="error" class="text-red-600 font-semibold">
        Error al unirte a la organización
        <br />
        Por favor, verifica que el enlace de invitación sea correcto o solicita
        uno nuevo.
        <br />
        <button
          @click="goToDashboard"
          class="w-28 mt-4 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
        >
          Ir al dashboard
        </button>
      </div>

      <div v-else class="text-green-700 text-lg font-medium">
        ¡Ahora formas parte de la organización!
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Join Organization",
  description: "Join an organization using the invitation link.",
});
import { useRoute } from "nuxt/app";

const { token } = useRoute().query;
const router = useRouter();

const { pending, error } = await useApi(`organization/invite/${token}`);
const goToDashboard = () => {
  router.push("/dashboard");
};
</script>
