<template>
  <!-- BEGIN: Top Bar -->
  <div
    class="px-3 mb-12 -mx-3 border-b top-bar-boxed border-theme-2 -mt-7 md:-mt-5 sm:-mx-8 sm:px-8 md:pt-0"
  >
    <div class="flex items-center h-full">
      <!-- BEGIN: Logo -->
      <a href="" class="hidden -intro-x md:flex">
        <span class="ml-3 text-lg text-white">
          AVHD <span class="font-medium">dashboard</span>
        </span>
      </a>
      <!-- END: Logo -->
      <!-- BEGIN: Breadcrumb -->
      <div class="mr-auto -intro-x breadcrumb">
        <a href="">Application</a>
        <ChevronRightIcon class="breadcrumb__icon" />
        <a href="" class="breadcrumb--active">Dashboard</a>
      </div>
      <!-- END: Breadcrumb -->
      <!-- BEGIN: Account Menu -->
      <div class="w-8 h-8 intro-x dropdown">
        <div
          class="w-8 h-8 overflow-hidden scale-110 rounded-full shadow-lg dropdown-toggle zoom-in"
          role="button"
          aria-expanded="false"
        >
          <UserIcon class="w-6 h-6 text-white" />
        </div>
        <div class="w-32 dropdown-menu">
          <div class="text-white dropdown-menu__content box bg-theme-11 dark:bg-dark-6">
            <div class="p-2">
              <button
                class="flex items-center block p-2 transition duration-300 ease-in-out rounded-md hover:bg-theme-1 dark:hover:bg-dark-3"
                :onclick="logout"
              >
                <ToggleRightIcon class="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Account Menu -->
    </div>
  </div>
  <!-- END: Top Bar -->
</template>

<script>
import { defineComponent, ref } from "vue";
import { logout } from "@/utils/auth";

export default defineComponent({
  setup() {
    const searchDropdown = ref(false);

    const showSearchDropdown = () => {
      searchDropdown.value = true;
    };

    const hideSearchDropdown = () => {
      searchDropdown.value = false;
    };

    return {
      logout,
      searchDropdown,
      showSearchDropdown,
      hideSearchDropdown
    };
  }
});
</script>
