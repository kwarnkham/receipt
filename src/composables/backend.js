import { api } from "src/boot/axios";
import useHandleResponse from "./handleResponse";
import useUtility from "./utility";

export default function useBackend () {
  const handleResponse = useHandleResponse();
  const { buildForm, removeFalsyProperty } = useUtility();
  return {
    subscribeUser: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "subscription",
          data: removeFalsyProperty(data),
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    setSetting: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "setting/" + data.user_id,
          data: removeFalsyProperty(data),
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
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
    addPayment: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "user/payment",
          data: removeFalsyProperty(data),
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    createUser: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "user",
          data: removeFalsyProperty(data),
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    changePassword: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "password",
          data: removeFalsyProperty(data),
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    deleteUserPaymentInfo: async (data) => {
      try {
        return await api({
          method: "DELETE",
          url: `user/${data.user_id}/payment/${data.payment_id}/number/${data.number}`,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    updateUserPaymentInfo: async (data) => {
      try {
        return await api({
          method: "PUT",
          url: `user/${data.user_id}/payment/${data.payment_id}/number/${data.old_number}`,
          data: data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    fetchPayments: async (params) => {
      try {
        return await api({
          method: "GET",
          url: "payment",
          params,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    resetUserPassword: async (user_id) => {
      try {
        return await api({
          method: "POST",
          url: `/user/${user_id}/password`,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    fetchKnownItems: async () => {
      try {
        return await api({
          method: "GET",
          url: "item/known",
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    fetchKnownUsers: async () => {
      try {
        return await api({
          method: "GET",
          url: "customer/known",
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
          params: removeFalsyProperty(params),
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
    updateReceipt: async (data, id) => {
      if (!data.discount) data.discount = undefined;
      if (!data.deposit) data.deposit = undefined;
      try {
        return await api({
          method: "PUT",
          url: "receipt/" + id,
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    draftReceipt: async (data) => {
      if (!data.discount) data.discount = undefined;
      if (!data.deposit) data.deposit = undefined;
      try {
        return await api({
          method: "POST",
          url: "receipt/draft",
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
          params: removeFalsyProperty(params),
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    fetchAllReceipts: async () => {
      try {
        return await api({
          method: "GET",
          url: "receipt/all",
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    fetchAllReceiptsOfUser: async (user_id) => {
      try {
        return await api({
          method: "GET",
          url: "receipt/all/" + user_id,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    createPhone: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "phones",
          data: data
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    updatePhone: async (phoneId, data) => {
      try {
        return await api({
          method: "PUT",
          url: "phones/" + phoneId,
          data: data
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    deletePhone: async (phoneId) => {
      try {
        return await api({
          method: "DELETE",
          url: "phones/" + phoneId,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
  };
}
