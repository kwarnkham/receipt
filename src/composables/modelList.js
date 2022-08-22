import { watch } from "vue";
import useResponsePagination from "src/composables/responsePagination";

export default function useModelList(fetcher, params) {
  const { page, currentPage, fetchPage, fetchAppend } =
    useResponsePagination(fetcher);

  //where it starts
  watch(currentPage, () => {
    fetchPage(params);
  });

  return {
    fetchAppend,
    page,
  };
}
