<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Confirmando usuario</h2>

      <div v-if="pending" class="text-gray-600">Validando usuario...</div>

      <div v-else-if="error" class="text-red-600 font-semibold">
        Error al confirmar el usuario
        <br />
        Por favor, verifica que el enlace de confirmación sea correcto o
        solicita uno nuevo.
        <br />
        <button
          @click="goToLogin"
          class="w-28 mt-4 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
        >
          Ir a Login
        </button>
      </div>

      <div v-else class="text-green-700 text-lg font-medium">
        ¡Usuario confirmado correctamente!
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Email Confirmation",
  description: "Confirm your email address to complete the registration.",
});
import { useRoute } from "nuxt/app";

const { token } = useRoute().query;

const router = useRouter();

const { status, pending, error } = await useApi(`user/verify`, {
  lazy: true,
  params: { token },
});

watch(status, (newStatus) => {
  if (newStatus === 200) {
    // User confirmed successfully
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  } else if (newStatus === 400 || newStatus === 404) {
    // Error in confirmation
    error.value = true;
  }
});

const goToLogin = () => {
  router.push("/login");
};
</script>
