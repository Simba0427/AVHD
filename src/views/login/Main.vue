<template>
  <div>
    <DarkModeSwitcher />
    <div class="container sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <div class="flex-col hidden min-h-screen xl:flex">
          <a href="" class="flex items-center pt-5 -intro-x">
            <span class="ml-3 text-lg text-white"
              >AVHD<span class="font-medium"> Dashboard</span>
            </span>
          </a>
        </div>
        <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div
            class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-dark-1 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
              Sign In
            </h2>
            <div class="mt-8 intro-x">
              <input
                type="text"
                class="block px-4 py-3 border-gray-300 intro-x login__input form-control"
                placeholder="Username"
                v-model="username"
              />
              <input
                type="password"
                class="block px-4 py-3 mt-4 border-gray-300 intro-x login__input form-control"
                placeholder="Password"
                v-model="password"
              />
            </div>
            <p v-if="error" class="mt-4 text-center text-red-500 xl:text-left">
              {{ error }}
            </p>
            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <button
                class="w-full px-4 py-3 align-top btn xl:w-32 xl:mr-3"
                :class="{ 'btn-primary': username && password }"
                :onclick="handleSignIn"
                :disabled="!username || !password"
              >
                <LoadingIcon v-if="loading" icon="three-dots" color="white" class="h-5" />
                <span v-else>Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
import cash from "cash-dom";
import { login } from "@/utils/auth";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    DarkModeSwitcher
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const username = ref("u823421911");
    const password = ref("fgdfgRRT34-3434-324fsf1");
    const error = ref("");
    const handleSignIn = async () => {
      if (username.value && password.value) {
        loading.value = true;
        error.value = await login(username.value, password.value);
        loading.value = false;
        console.log(localStorage.getItem("avhd_dashboard_token"));
        if (!error.value) {
          await router.push("/");
        }
      }
    };

    onMounted(() => {
      cash("body")
        .removeClass("main")
        .removeClass("error-page")
        .addClass("login");
    });
    watch([username, password], () => {
      error.value = "";
    });

    return {
      handleSignIn,
      error,
      loading,
      username,
      password
    };
  }
});
</script>
