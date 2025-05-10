import type { HandleClientError } from "@sveltejs/kit";
export const handleError: HandleClientError = async ({ status, message }) => {
  if (status === 413) {
    console.log("Payload too large, returning message...");
    return {
      message: "Payload Too Large",
    };
  }

  // For other errors, return the default message
  return {
    message: message,
  };
};
