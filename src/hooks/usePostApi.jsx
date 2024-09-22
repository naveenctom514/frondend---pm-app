import { notification } from "antd";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

export const usePostApi = (url, disableMessage) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { csrf } = useSelector((state) => state.auth);
console.log(csrf)
  const postData = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url,
        data,
        // withCredentials: true,
        // headers: {
        //   "X-CSRFToken": csrf,
        // },
      });

      if (response.data.status) {
      } else if (response?.data?.message !== "" && !disableMessage) {
        notification.success({
          message: response?.data?.message
            ? response?.data?.message
            : "Success!",
        });
      }
      setData(
        response?.data?.details ? response?.data?.details : response?.data
      );
      setIsLoading(false);
    } catch (error) {
      if (error.response?.data?.email) {
        notification.error({ message: "Email not found!" });
      } else if (error.response?.data?.password) {
      } else {
        notification.error({
          message: error?.response?.data?.error
            ? error?.response?.data?.error
            : Array.isArray(error?.response?.data)
            ? error?.response?.data[0]
            : "Something went wrong",
        });
      }
      setError(error);
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setIsLoading(false);
    setData(null);
  };

  return { data, isLoading, error, postData, resetState };
};
