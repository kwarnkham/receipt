import useApp from "./app";
export default function useHandleResponse() {
  const { errorNotify } = useApp();
  const defaultMessage =
    "Opps! Something went wrong. Please contact the system developer.";
  const handleResponse = (e) => {
    console.error(e);
    if (e.response?.status == 422) {
      let message = "";
      const errors = e.response.data.errors;
      const errorKeys = Object.keys(errors);
      errorKeys.forEach((key) => (message += errors[key]));
      console.log(message);
      errorNotify(message);
    } else if (e.response?.status == 401) {
      errorNotify("Mobile and password doesn't match");
    } else if (e.response?.status == 403) {
      if (e.response?.data?.message) errorNotify(e.response.data.message);
      else
        errorNotify(
          "Invalid password or you are not allowed to perform the action"
        );
    } else {
      if (e.response) errorNotify(e.response.data.message || defaultMessage);
      else errorNotify(e.message);
    }
  };

  return handleResponse;
}
