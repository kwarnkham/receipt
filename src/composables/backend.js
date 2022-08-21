import { api } from "src/boot/axios";
import useHandleResponse from "./handleResponse";
import useUtility from "./utility";

export default function useBackend() {
  const handleResponse = useHandleResponse();
  const { buildForm } = useUtility();
  return {
    createPicture: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "picture",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: buildForm(data),
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    updateUserInfo: async (data) => {
      try {
        return await api({
          method: "PUT",
          url: "user/" + data.user_id,
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
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
    fetchUsers: async (params) => {
      try {
        return await api({
          method: "GET",
          url: "user",
          params,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    findUser: async (id) => {
      try {
        return await api({
          method: "GET",
          url: "user/" + id,
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
    fetchReceipts: async (params) => {
      try {
        return await api({
          method: "GET",
          url: "receipt",
          params,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
  };
}
