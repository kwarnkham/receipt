import { watch } from "vue";
import useResponsePagination from "src/composables/responsePagination";
import useBackend from "./backend";

export default function useReceiptList(params) {
  const { fetchReceipts } = useBackend();

  const { page, currentPage, fetchPage, fetchAppend } =
    useResponsePagination(fetchReceipts);

  //where it starts
  watch(currentPage, () => {
    fetchPage(params);
  });

  return {
    fetchReceipts,
    fetchAppend,
    page,
  };
}
