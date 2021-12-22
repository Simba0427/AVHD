<template>
  <div>
    <div class=" flex items-center ">
      <h2 class=" text-lg font-medium mt-10">Groups</h2>
    </div>

    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <a
          class="btn btn-primary shadow-md mr-2"
          data-toggle="modal"
          data-target="#add-group-modal"
          href="javascript:;"
          >Add Group</a
        >
        <div id="add-group-modal" class="modal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <!-- BEGIN: Modal Header -->
              <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">
                  Add Group
                </h2>
              </div>
              <!-- END: Modal Header -->
              <!-- BEGIN: Modal Body -->
              <div class="modal-body ">
                <div id="horizontal-form" class="p-5">
                  <div class="preview">
                    <div class="form-inline">
                      <label for="horizontal-form-1" class="form-label sm:w-20">Name</label>
                      <input
                        v-model="add_group_name"
                        type="text"
                        class="form-control"
                        placeholder=""
                      />
                    </div>
                    <div class="form-inline mt-5">
                      <label for="horizontal-form-1" class="form-label sm:w-20">Description</label>
                      <input
                        v-model="add_group_description"
                        type="text"
                        class="form-control"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- END: Modal Body -->
              <!-- BEGIN: Modal Footer -->
              <div class="modal-footer text-right">
                <button
                  type="button"
                  data-dismiss="modal"
                  class="btn btn-outline-secondary w-20 mr-1"
                  @click="
                    add_group_name = undefined;
                    add_group_description = undefined;
                  "
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="btn btn-primary w-20"
                  @click="addGroup()"
                  data-dismiss="modal"
                >
                  Add
                </button>
              </div>
              <!-- END: Modal Footer -->
            </div>
          </div>
        </div>

        <div class="hidden md:block mx-auto text-gray-600">
          Showing {{ (current_page - 1) * limit_select + 1 }} to
          {{ Math.min(current_page * limit_select, totalCount) }} of {{ totalCount }} groups
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
          <div class="w-56 relative text-gray-700 dark:text-gray-300">
            <input
              type="text"
              class="form-control w-56 box pr-10 placeholder-theme-8"
              placeholder="Search..."
            />
            <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
          </div>
        </div>
      </div>
      <!-- BEGIN: Users Layout -->
      <div
        v-for="(group, groupKey) in groupList"
        :key="groupKey"
        class="intro-y col-span-12 md:col-span-6"
      >
        <div class="box">
          <div class="flex flex-col lg:flex-row items-center p-5">
            <div class="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
              <img
                alt="Icewall Tailwind HTML Admin Template"
                class="rounded-full"
                :src="require(`@/assets/images/profile-1.jpg`)"
              />
            </div>
            <div class="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
              <a href="" class="font-medium">{{ group.name }}</a>
              <div class="text-gray-600 text-xs mt-0.5">
                {{ group.description }}
              </div>
            </div>
            <div class="dropdown ml-auto">
              <a
                class="dropdown-toggle w-5 h-5 block -mr-2"
                href="javascript:;"
                aria-expanded="false"
              >
                <MoreVerticalIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </a>
              <div class="dropdown-menu w-40">
                <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                  <a
                    href="javascript:;"
                    @click="
                      getSelectedHandlers(group._handler_group_id);
                      selectedGroup = group._handler_group_id;
                    "
                    class=" dropdown-toggle flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                    aria-expanded="false"
                    data-toggle="modal"
                    data-target="#assign-handler-modal"
                  >
                    <UserPlusIcon class="w-4 h-4 mr-2" />
                    Manage group
                  </a>
                  <a
                    href="javascript:;"
                    @click="selectedGroup = group._handler_group_id"
                    class=" dropdown-toggle flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                    aria-expanded="false"
                    data-toggle="modal"
                    data-target="#delete-confirm-modal"
                  >
                    <Trash2Icon class="w-4 h-4 mr-2" />
                    Delete group
                  </a>
                </div>
              </div>
            </div>

            <!-- <div class="flex mt-4 lg:mt-0">
              <button class="btn btn-primary py-1 px-2 mr-2">Message</button>
              <button class="btn btn-outline-secondary py-1 px-2">
                Profile
              </button>
            </div> -->
          </div>
        </div>
      </div>
      <!-- BEGIN: Users Layout -->
      <!-- END: Pagination -->
      <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
        <ul class="pagination">
          <li>
            <a class="pagination__link" @click="goPage('first')">
              <ChevronsLeftIcon class="w-4 h-4" />
            </a>
          </li>
          <li>
            <a class="pagination__link" @click="goPage('previous')">
              <ChevronLeftIcon class="w-4 h-4" />
            </a>
          </li>
          <li>
            <span class="pagination__link" href="">...</span>
          </li>
          <li v-for="page_number in paginationBarList" :key="page_number">
            <a
              class="pagination__link "
              v-bind:class="{ 'pagination__link--active': page_number == current_page }"
              @click="goPage(page_number)"
              >{{ page_number }}</a
            >
          </li>
          <li>
            <span class="pagination__link" href="">...</span>
          </li>
          <li>
            <a class="pagination__link" @click="goPage('next')">
              <ChevronRightIcon class="w-4 h-4" />
            </a>
          </li>
          <li>
            <a class="pagination__link" @click="goPage('last')">
              <ChevronsRightIcon class="w-4 h-4" />
            </a>
          </li>
        </ul>
        <select
          class="w-20 form-select box mt-3 sm:mt-0"
          @change="getData()"
          v-model="limit_select"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="35">35</option>
          <option value="50">50</option>
        </select>
      </div>
      <!-- END: Pagination -->
    </div>
  </div>

  <div id="delete-confirm-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto">
            Delete group
          </h2>
        </div>
        <!-- END: Modal Header -->
        <!-- BEGIN: Modal Body -->
        <div class="modal-body ">
          Are you sure delete this group?
        </div>
        <!-- END: Modal Body -->
        <!-- BEGIN: Modal Footer -->
        <div class="modal-footer text-right">
          <button
            type="button"
            data-dismiss="modal"
            class="btn btn-outline-secondary w-20 mr-1"
            @click="
              add_group_name = undefined;
              add_group_description = undefined;
            "
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary w-20"
            @click="viewDeleteGroup()"
            data-dismiss="modal"
          >
            Delete
          </button>
        </div>
        <!-- END: Modal Footer -->
      </div>
    </div>
  </div>

  <div id="assign-handler-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto">
            Add/Remove handlers
          </h2>
        </div>
        <!-- END: Modal Header -->
        <!-- BEGIN: Modal Body -->
        <div class="modal-body ">
          <div id="horizontal-form" class="p-5">
            <div class="preview">
              <TomSelect
                v-model="selectedHandlers"
                :options="{
                  placeholder: 'Select your favorite actors'
                }"
                class="w-full"
                multiple
              >
                <option
                  :value="handler._handler_id"
                  v-for="handler in allHandlers"
                  :key="handler"
                  >{{ handler.username }}</option
                >
              </TomSelect>
            </div>
          </div>
        </div>
        <!-- END: Modal Body -->
        <!-- BEGIN: Modal Footer -->
        <div class="modal-footer text-right">
          <button
            type="button"
            data-dismiss="modal"
            class="btn btn-outline-secondary w-20 mr-1"
            @click="
              add_group_name = undefined;
              add_group_description = undefined;
            "
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary w-20"
            @click="addHandlers()"
            data-dismiss="modal"
          >
            Confirm
          </button>
        </div>
        <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import {
  _getGroups,
  _deleteGroup,
  _addGroup,
  _getTotalCount,
  _linkHandlerAndGroup,
  _unLinkHandlerAndGroup
} from "@/utils/group";
import { _getHandlers, _getHandlersByGroup } from "@/utils/handler";

export default defineComponent({
  components: {},
  setup() {
    const select = ref("");
    const groupList = ref(null);
    const limit_select = ref(10);
    const totalCount = ref(0);
    const current_page = ref(1);
    const paginationBarList = ref([]);
    const selectedGroup = ref();
    async function getData() {
      let max_page_count = Math.ceil(totalCount.value / limit_select.value);
      if (current_page.value > max_page_count) current_page.value = max_page_count;
      if (current_page.value < 1) current_page.value = 1;
      let limit = limit_select.value;
      let step = (current_page.value - 1) * limit;
      groupList.value = await _getGroups("active", limit, step);
      let first, last;
      first = Math.max(1, current_page.value - 2);
      last = Math.min(first + 5, max_page_count);
      paginationBarList.value = [];
      for (let i = first; i <= last; i++) paginationBarList.value.push(i);
    }
    async function getTotalCount() {
      _getTotalCount().then(function(result) {
        totalCount.value = result;
        current_page.value = 1;
        getData();
      });
    }
    function goPage(page) {
      let max_page_count = Math.ceil(totalCount.value / limit_select.value);
      if (page == "previous") {
        if (current_page.value == 1) return;
        current_page.value--;
      } else if (page == "next") {
        if (current_page.value == max_page_count) return;
        current_page.value++;
      } else if (page == "first") current_page.value = 1;
      else if (page == "last") current_page.value = max_page_count;
      else if (isFinite(page)) current_page.value = page;
      else current_page.value = 1;
      getData();
    }

    onMounted(async () => {
      await getTotalCount();
      _getHandlers(selectedGroup.value, "active", 0).then(function(result) {
        allHandlers.value = result;
      });
    });

    async function viewDeleteGroup(group_id = null) {
      // if(!window.confirm("Are you sure that you want to delete this group?")) return;
      if (!group_id) group_id = selectedGroup.value;
      await unLinkAllHandlersOfGroup({_value: group_id});
      _deleteGroup(group_id).then(function(result) {
        if (result === "success") {
          totalCount.value--;
          getData();
        }
      });
    }
    function addGroup() {
      let _this = this;
      _addGroup(this.add_group_name, this.add_group_description).then(function(result) {
        if (result === "success") {
          totalCount.value++;
          getData();
        }
      });
      this.add_group_name = undefined;
      this.add_group_description = undefined;
    }

    const selectedHandlers = ref([]);
    const allHandlers = ref([]);

    function getSelectedHandlers(group_id) {
      _getHandlersByGroup(group_id, "active").then(function(result) {
        selectedHandlers.value = [];

        if (result == null) return;
        for (let i = 0; i < result.length; i++) {
          selectedHandlers.value.push(result[i]._handler_id);
        }
      });
    }
    async function addHandlers() {
        await unLinkAllHandlersOfGroup(selectedGroup);
        await linkAllNewHandlersOfGroup(selectedGroup, selectedHandlers);
    }
    async function unLinkAllHandlersOfGroup(group_id) {
      await _getHandlersByGroup(group_id._value, "active").then(async function(result) {
        if (result == null) return true;
        for (let i = 0; i < result.length; i++) {
          await _unLinkHandlerAndGroup(group_id._value, result[i]._handler_id);
        }
      });
      return true;
    }
    async function linkAllNewHandlersOfGroup(group_id, selectedHandlers) {
      if (selectedHandlers == null || selectedHandlers.length == 0) return;
      // console.log("Group Current Handler", selectedHandlers, group_id);
      for (let i = 0; i < selectedHandlers._rawValue.length; i++) {
        await _linkHandlerAndGroup(group_id._value, selectedHandlers._rawValue[i]);
      }
    }

    return {
      groupList,
      limit_select,
      select,
      totalCount,
      add_group_name: ref(),
      add_group_description: ref(),
      viewDeleteGroup,
      addGroup,
      getData,
      goPage,
      current_page,
      paginationBarList,
      selectedGroup,
      // this is for assigning handlers
      selectedHandlers,
      allHandlers,
      getSelectedHandlers,
      addHandlers
    };
  },
  methods: {}
});
</script>
