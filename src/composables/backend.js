import { api } from "src/boot/axios";
import useHandleResponse from "./handleResponse";

export default function useBackend() {
  const handleResponse = useHandleResponse();
  return {
    login: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "login",
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    createReceipt: async (data) => {
      if (!data.discount) data.discount = undefined;
      if (!data.deposit) data.deposit = undefined;
      try {
        return await api({
          method: "POST",
          url: "receipt",
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    findReceipt: async (id) => {
      try {
        return await api({
          method: "GET",
          url: "receipt/" + id,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
  };
}
