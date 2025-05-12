import type { HandleClientError } from "@sveltejs/kit";

export const handleError: HandleClientError = async ({
  error,
  message,
  event,
}) => {
  console.error(error);
  console.log(event);
  // For other errors, return the default message
  return {
    message: message,
  };
};
