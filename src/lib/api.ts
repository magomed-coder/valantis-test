import axios from "axios";
import { format } from "date-fns";
import { MD5 } from "crypto-js";
import ActionTypes from "@/types/ActionTypes";
import { API_URL, PASSWORD } from "@/constants/const";

const generateXAuth = () => {
  const timestamp = format(new Date(), "yyyyMMdd");
  const authString = `${PASSWORD}_${timestamp}`;
  return MD5(authString).toString();
};

const makeApiRequest = async ({
  action = ActionTypes.GET_IDS,
  params = {},
}) => {
  console.log(params);

  const xAuth = generateXAuth();
  const response = await axios.post(
    API_URL,
    {
      action,
      params: { ...params },
    },
    {
      headers: {
        "X-Auth": xAuth,
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};

export default makeApiRequest;
