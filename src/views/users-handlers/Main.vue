<template>
  <div>
    <div class=" flex items-center ">
      <h2 class=" text-lg font-medium mt-10">Handlers</h2>
      <div class=" ml-auto mt-10 w-60">
        <TomSelect
          v-model="selectedGroup"
          :options="{
            placeholder: 'Select the group'
          }"
          class="w-full"
          @change="group_changed()"
        >
          <option value="-1">Select the group</option>
          <option :value="group._handler_group_id" v-for="group in groupList" :key="group">{{ group.name }}</option>
        </TomSelect>
      </div>
    </div>
    <!----------------------------------------Add Handler Modal--------------------------->
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <a
          class="btn btn-primary shadow-md mr-2"
          data-toggle="modal"
          data-target="#add-handler-modal"
          href="javascript:;"
          >Add Handler</a
        >
        <div id="add-handler-modal" class="modal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <!-- BEGIN: Modal Header -->
              <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">
                  Add Handler
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
                        v-model="add_handler_username"
                        type="text"
                        class="form-control"
                        placeholder=""
                      />
                    </div>
                    <div class="form-inline mt-5">
                      <label for="horizontal-form-1" class="form-label sm:w-20">Email</label>
                      <input
                        v-model="add_handler_email"
                        type="email"
                        class="form-control"
                        placeholder=""
                      />
                    </div>
                    <div class="form-inline mt-5">
                      <label for="horizontal-form-1" class="form-label sm:w-20">Description</label>
                      <input
                        v-model="add_handler_description"
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
                    add_handler_username = undefined;
                    add_handler_email = undefined;
                    add_handler_description = undefined;
                  "
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="btn btn-primary w-20"
                  @click="addHandler()"
                  data-dismiss="modal"
                >
                  Add
                </button>
              </div>
              <!-- END: Modal Footer -->
            </div>
          </div>
        </div>
        <!----------------------------------------Add Handler Modal--------------------------->
        <div class="hidden md:block mx-auto text-gray-600">
          Showing {{ (current_page - 1) * limit_select + 1 }} to
          {{ Math.min(current_page * limit_select, totalCount) }} of {{ totalCount }} handlers
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
        v-for="(handler, handlerKey) in handlerList"
        :key="handlerKey"
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
              <a href="" class="font-medium">{{ handler.username }}</a>
              <div class="text-gray-600 text-xs mt-0.5">
                {{ handler.description }}
              </div>
              <div class="text-gray-600 text-xs mt-0.5">
                {{ getGroupNamesOfHandler(handler._handler_group_ids) }}
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
                  <a v-if="handler._handler_group_ids.length == 0"
                    href="javascript:;"
                    @click="selectedHandler = handler._handler_id"
                    class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                    aria-expanded="false"
                    data-toggle="modal"
                    data-target="#delete-confirm-modal"
                  >
                    <FileTextIcon class="w-4 h-4 mr-2" />
                    Delete
                  </a>
                  <a v-if="handler._handler_group_ids.length != 0"
                    href="javascript:;"
                    class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                    aria-expanded="false"
                    data-toggle="modal"
                    data-target="#delete-error-modal"
                  >
                    <FileTextIcon class="w-4 h-4 mr-2" />
                    Delete
                  </a>
                </div>
              </div>
            </div>
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
            Delete Handler
          </h2>
        </div>
        <!-- END: Modal Header -->
        <!-- BEGIN: Modal Body -->
        <div class="modal-body ">
          Are you sure delete this handler?
        </div>
        <!-- END: Modal Body -->
        <!-- BEGIN: Modal Footer -->
        <div class="modal-footer text-right">
          <button
            type="button"
            data-dismiss="modal"
            class="btn btn-outline-secondary w-20 mr-1"
            @click="
              add_handler_password = undefined;
              add_handler_email = undefined;
              add_handler_username = undefined;
              add_handler_description = undefined;
            "
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary w-20"
            @click="viewDeleteHandler()"
            data-dismiss="modal"
          >
            Delete
          </button>
        </div>
        <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id="delete-error-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto">
            Delete Handler
          </h2>
        </div>
        <!-- END: Modal Header -->
        <!-- BEGIN: Modal Body -->
        <div class="modal-body ">
          This handler can not be removed. Please remove all the links first.
        </div>
        <!-- END: Modal Body -->
        <!-- BEGIN: Modal Footer -->
        <div class="modal-footer text-right">
          <button
            type="button"
            class="btn btn-primary w-20"
            data-dismiss="modal"
          >
            Close
          </button>
        </div>
        <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { _deleteHandler, _getHandlers, _addHandler, _getTotalCount, _getHandlersByGroup } from "@/utils/handler";
import { _getGroups } from "@/utils/group";

export default defineComponent({
  components: {},
  setup() {
    const handlerList = ref(null);
    const select = ref("");
    const limit_select = ref(10);
    const totalCount = ref(0);
    const current_page = ref(1);
    const paginationBarList = ref([]);
    const selectedHandler = ref();
    const groupList = ref([]);
    const selectedGroup = ref(-1);
    

    const getData = async () => {
      // handlerList.value = await _getHandlers("active", 0);
      let max_page_count = Math.ceil(totalCount.value / limit_select.value);
      if (current_page.value > max_page_count) current_page.value = max_page_count;
      if (current_page.value < 1) current_page.value = 1;
      let limit = limit_select.value;
      let step = (current_page.value - 1) * limit;
      handlerList.value = await _getHandlers(selectedGroup.value, "active", limit, step);

      let first, last;
      first = Math.max(1, current_page.value - 2);
      last = Math.min(first + 5, max_page_count);
      paginationBarList.value = [];
      for (let i = first; i <= last; i++) paginationBarList.value.push(i);
    };
    async function getTotalCount() {
      _getTotalCount(selectedGroup.value).then(function(result) {
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
      await getGroupList();
    });

    function viewDeleteHandler(handler_id = null) {
      // if(!window.confirm("Are you sure that you want to delete this group?")) return;
      if (!handler_id) handler_id = selectedHandler.value;

      _deleteHandler(handler_id).then(function(result) {
        if (result === "success") {
          totalCount.value--;
          getData();
        }
      });
    }
    function addHandler() {
      let _this = this;
      _addHandler(
        this.add_handler_username,
        this.add_handler_password,
        this.add_handler_email,
        this.add_handler_description
      ).then(function(result) {
        if (result === "success") {
          totalCount.value++;
          getData();
        }
      });
      this.add_handler_username = undefined;
      this.add_handler_password = undefined;
      this.add_handler_email = undefined;
      this.add_handler_description = undefined;
    }
    async function getGroupList() {
        groupList.value = await _getGroups("active", 0, 0);
    }
    function getGroupNamesOfHandler(groupNameArray) {
        if(groupList.value.length ==0) return;
        let result = [];
        groupList.value.forEach(function(group) {
            if(groupNameArray.includes(group._handler_group_id)) result.push(group.name);
        });
        return result.join();
    }
    function group_changed() {
        getTotalCount();
    }
    function test(test) {
         console.log(test)
    }

    return {
      handlerList,
      select,
      limit_select,
      totalCount,
      add_handler_username: ref(),
      add_handler_password: ref(),
      add_handler_email: ref(),
      add_handler_description: ref(),
      groupList,
      selectedGroup,

      viewDeleteHandler,
      addHandler,
      getData,
      goPage,
      current_page,
      paginationBarList,
      selectedHandler,
      getGroupList,
      getGroupNamesOfHandler,
      group_changed,
      test
    };
  }
});
</script>
