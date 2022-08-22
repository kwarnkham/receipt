import { useQuasar } from "quasar";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export default function useResponsePagination(fetcher) {
  const { loading } = useQuasar();
  const page = ref(null);
  const currentPage = ref(0);
  const max = computed(() => {
    if (!page.value) return 0;
    return Math.ceil(page.value.total / page.value.per_page);
  });

  const router = useRouter();
  const route = useRoute();

  const fetchAppend = (params) => {
    if (page.value.next_page_url) {
      loading.show();
      fetcher({ ...params, page: page.value.current_page + 1 })
        .then((response) => {
          if (response) {
            const temp = JSON.parse(JSON.stringify(page.value));
            const oldData = JSON.parse(JSON.stringify(temp.data));
            const newData = [...oldData, ...response.data];
            response.data = newData;
            page.value = response;
          }
        })
        .finally(() => {
          loading.hide();
        });
    }
  };

  const fetchPage = (params) => {
    loading.show();
    fetcher({ ...params, page: currentPage.value })
      .then((response) => {
        if (response) {
          page.value = response;
        }
      })
      .finally(() => {
        loading.hide();
      });
  };

  watch(currentPage, () => {
    router.replace({
      name: route.name,
      params: route.params,
      query: { page: currentPage.value },
    });
  });

  onMounted(() => {
    currentPage.value = Number(route.query.page) || 1;
  });

  return {
    page,
    currentPage,
    fetchPage,
    fetchAppend,
    max,
  };
}
