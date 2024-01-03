const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api/"
    : "https://api.goiterative.com/api/";
const SOCKET_IO_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://api.goiterative.com";

const DIGITALOCEAN_SERVERLESS =
  "https://faas-sfo3-7872a1dd.doserverless.co/api/v1/namespaces/fn-ec9474d0-9a08-4739-a85c-d5de4f6d5bf0/actions/";
const SERVERLESS_TOKEN =
  "Basic ZTU4OTM0NDYtOThiYS00MWMyLWI4OTAtMzEyOGM2NzRkZjg5OlFRUmI2WTZyZVBxbmlqMVBxQTljOEhRZ1hlZE9Cc2pWWW5Bc2c3bHVVcmVrNWkyVEhkamZtY015QXE5UDVHa0I=";

export {
  API_BASE_URL,
  SOCKET_IO_URL,
  DIGITALOCEAN_SERVERLESS,
  SERVERLESS_TOKEN,
};
