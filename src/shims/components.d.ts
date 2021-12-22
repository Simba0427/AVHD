declare module "vue" {
  export interface GlobalComponents {
    Chart: typeof import("@/global-components/chart/Main.vue").default;
  }
}

export {};
